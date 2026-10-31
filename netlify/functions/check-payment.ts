import type { Handler, HandlerEvent } from '@netlify/functions';
import crypto from 'crypto';

const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || '';

function signJwt(payload: object, secret: string): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodeBase64Url = (obj: object) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const b64Header = encodeBase64Url(header);
  const b64Payload = encodeBase64Url(payload);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${b64Header}.${b64Payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${b64Header}.${b64Payload}.${signature}`;
}

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    Pragma: 'no-cache',
    Expires: '0',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const paymentId = event.queryStringParameters?.id;
  if (!paymentId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'ID do pagamento não informado' }),
    };
  }

  if (!ASAAS_API_KEY || !JWT_SECRET) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Configurações de servidor ausentes (API Key ou JWT Secret)' }),
    };
  }

  try {
    const res = await fetch(`${ASAAS_API_URL}/payments/${paymentId}`, {
      headers: {
        access_token: ASAAS_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const text = await res.text();
    let payment: any = {};
    try {
      payment = JSON.parse(text);
    } catch {}

    if (!res.ok) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: payment?.errors?.[0]?.description || 'Cobrança não encontrada no Asaas',
        }),
      };
    }

    // Status de sucesso no Asaas: RECEIVED (PIX recebido), CONFIRMED (compensado) ou RECEIVED_IN_CASH
    const isPaid =
      payment.status === 'RECEIVED' ||
      payment.status === 'CONFIRMED' ||
      payment.status === 'RECEIVED_IN_CASH';

    if (!isPaid) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          paid: false,
          status: payment.status,
        }),
      };
    }

    // Pagamento confirmado! Extrair os metadados da compra
    let extRef: { plan?: string; targetRoomId?: number; email?: string } = {};
    try {
      if (payment.externalReference) {
        extRef = JSON.parse(payment.externalReference);
      }
    } catch {}

    const plan = extRef.plan || (payment.value >= 15 ? 'FULL_HOUSE' : 'SINGLE_ROOM');
    const isFullHouse = plan === 'FULL_HOUSE' || plan === 'UPGRADE_HOUSE';
    const unlockedRooms = isFullHouse ? [1, 2, 3, 4, 5, 6] : [1, 2, extRef.targetRoomId || 3];

    // Gerar token JWT assinado para o front-end salvar offline
    const token = signJwt(
      {
        email: event.queryStringParameters?.email || extRef.email || 'cliente@soletrando.com.br',
        plan: isFullHouse ? 'FULL_HOUSE' : 'SINGLE_ROOM',
        unlockedRoomIds: unlockedRooms,
        paymentId: payment.id,
        iat: Math.floor(Date.now() / 1000),
        iss: 'soletrando-o-mundo',
      },
      JWT_SECRET
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        paid: true,
        status: payment.status,
        token,
        plan,
        unlockedRoomIds: unlockedRooms,
      }),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erro ao verificar pagamento';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: errorMsg }),
    };
  }
};
