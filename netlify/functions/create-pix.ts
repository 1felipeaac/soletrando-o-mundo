import type { Handler, HandlerEvent } from '@netlify/functions';

const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY || '';

const PRICING_MAP = {
  SINGLE_ROOM: { value: 5.0, desc: 'Cômodo Avulso' },
  FULL_HOUSE: { value: 15.0, desc: 'Casa Completa Vitalícia' },
  UPGRADE_HOUSE: { value: 10.0, desc: 'Upgrade Casa Completa' },
};

function getTomorrowDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2); // 2 dias para vencimento do PIX
  return d.toISOString().split('T')[0];
}

function cleanNumber(str: string): string {
  return (str || '').replace(/\D/g, '');
}

export const handler: Handler = async (event: HandlerEvent) => {
  // CORS Headers
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

  if (!ASAAS_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Chave do Asaas não configurada no servidor' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, email, cpfCnpj, plan, targetRoomId, roomName } = body;

    if (!name || !email || !cpfCnpj || !plan) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Campos obrigatórios ausentes: nome, e-mail, CPF e plano.',
        }),
      };
    }

    const planConfig = PRICING_MAP[plan as keyof typeof PRICING_MAP] || PRICING_MAP.FULL_HOUSE;
    const cleanCpf = cleanNumber(cpfCnpj);

    if (cleanCpf.length !== 11 && cleanCpf.length !== 14) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'CPF ou CNPJ inválido.' }),
      };
    }

    const asaasHeaders = {
      access_token: ASAAS_API_KEY,
      'Content-Type': 'application/json',
    };

    // 1. Buscar se o cliente já existe pelo CPF
    let customerId = '';
    const findRes = await fetch(
      `${ASAAS_API_URL}/customers?cpfCnpj=${cleanCpf}`,
      { headers: asaasHeaders }
    );
    const findData = await findRes.json();

    if (findData.data && findData.data.length > 0) {
      customerId = findData.data[0].id;
    } else {
      // 2. Criar novo cliente no Asaas
      const createCustRes = await fetch(`${ASAAS_API_URL}/customers`, {
        method: 'POST',
        headers: asaasHeaders,
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          cpfCnpj: cleanCpf,
        }),
      });

      const custData = await createCustRes.json();
      if (!createCustRes.ok || !custData.id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: custData.errors?.[0]?.description || 'Erro ao registrar cliente no Asaas',
          }),
        };
      }
      customerId = custData.id;
    }

    // 3. Criar a cobrança PIX
    const description =
      plan === 'SINGLE_ROOM' && roomName
        ? `Soletrando o Mundo: ${roomName}`
        : `Soletrando o Mundo: ${planConfig.desc}`;

    const externalReference = JSON.stringify({
      plan,
      targetRoomId: targetRoomId || null,
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    });

    const paymentRes = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: asaasHeaders,
      body: JSON.stringify({
        customer: customerId,
        billingType: 'PIX',
        value: planConfig.value,
        dueDate: getTomorrowDate(),
        description,
        externalReference,
      }),
    });

    const paymentData = await paymentRes.json();
    if (!paymentRes.ok || !paymentData.id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: paymentData.errors?.[0]?.description || 'Erro ao gerar cobrança no Asaas',
        }),
      };
    }

    const paymentId = paymentData.id;

    // 4. Buscar o QR Code do PIX e payload Copia e Cola
    const qrRes = await fetch(`${ASAAS_API_URL}/payments/${paymentId}/pixQrCode`, {
      headers: asaasHeaders,
    });
    const qrData = await qrRes.json();

    if (!qrRes.ok || !qrData.payload) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Cobrança criada, mas falha ao gerar o QR Code PIX',
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        paymentId,
        value: planConfig.value,
        encodedImage: qrData.encodedImage, // Base64 da imagem do QR Code
        payload: qrData.payload, // Código Copia e Cola do PIX
        expirationDate: qrData.expirationDate,
        plan,
        targetRoomId,
      }),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erro interno do servidor';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: errorMsg }),
    };
  }
};
