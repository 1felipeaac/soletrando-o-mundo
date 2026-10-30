import type { Handler, HandlerEvent } from '@netlify/functions';
import crypto from 'crypto';

const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || '';

function cleanNumber(str: string): string {
  return (str || '').replace(/\D/g, '');
}

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' }),
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
    const { email, cpfCnpj } = JSON.parse(event.body || '{}');
    const cleanCpf = cleanNumber(cpfCnpj);

    if (!cleanCpf || cleanCpf.length !== 11) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Informe um CPF válido com 11 dígitos.' }),
      };
    }

    const asaasHeaders = {
      access_token: ASAAS_API_KEY,
      'Content-Type': 'application/json',
    };

    // 1. Localizar o cliente pelo CPF
    const custRes = await fetch(`${ASAAS_API_URL}/customers?cpfCnpj=${cleanCpf}`, {
      headers: asaasHeaders,
    });
    const custData = await custRes.json();

    if (!custData.data || custData.data.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: 'Nenhuma compra encontrada para este CPF no Soletrando o Mundo.',
        }),
      };
    }

    const customerId = custData.data[0].id;

    // 2. Buscar pagamentos aprovados (RECEIVED ou CONFIRMED)
    const payRes = await fetch(
      `${ASAAS_API_URL}/payments?customer=${customerId}&status=RECEIVED,CONFIRMED`,
      { headers: asaasHeaders }
    );
    const payData = await payRes.json();

    if (!payData.data || payData.data.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: 'Nenhum pagamento aprovado foi localizado para este cadastro.',
        }),
      };
    }

    // 3. Avaliar compras aprovadas
    let isFullHouse = false;
    const unlockedRooms = new Set<number>([1, 2]); // 1 e 2 são sempre gratuitos

    for (const payment of payData.data) {
      if (payment.value >= 15.0) {
        isFullHouse = true;
      }

      if (payment.externalReference) {
        try {
          const ext = JSON.parse(payment.externalReference);
          if (ext.plan === 'FULL_HOUSE' || ext.plan === 'UPGRADE_HOUSE') {
            isFullHouse = true;
          }
          if (ext.targetRoomId) {
            unlockedRooms.add(Number(ext.targetRoomId));
          }
        } catch {}
      }
    }

    const finalUnlockedRooms = isFullHouse ? [1, 2, 3, 4, 5, 6] : Array.from(unlockedRooms);

    // 4. Emitir o Token JWT de Restauração para este dispositivo
    const token = signJwt(
      {
        email: email || custData.data[0].email,
        plan: isFullHouse ? 'FULL_HOUSE' : 'SINGLE_ROOM',
        unlockedRoomIds: finalUnlockedRooms,
        restoredAt: new Date().toISOString(),
        iat: Math.floor(Date.now() / 1000),
        iss: 'soletrando-o-mundo',
      },
      JWT_SECRET
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        token,
        plan: isFullHouse ? 'FULL_HOUSE' : 'SINGLE_ROOM',
        unlockedRoomIds: finalUnlockedRooms,
      }),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erro ao restaurar licença';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: errorMsg }),
    };
  }
};
