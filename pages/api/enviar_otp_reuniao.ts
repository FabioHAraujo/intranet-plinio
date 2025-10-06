import { NextApiRequest, NextApiResponse } from 'next';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'E-mail é obrigatório' });
  }

  try {
    // Gerar código OTP de 6 dígitos
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Calcular expiração (5 minutos)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Salvar OTP no PocketBase (tabela: otp_reuniao)
    await pb.collection('otp_reuniao').create({
      email,
      codigo: otp,
      expira_em: expiresAt.toISOString(),
      usado: false,
    });

    // Enviar e-mail com OTP
    const emailResponse = await fetch(process.env.WEBHOOK_NOTICIAS as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sendto: email,
        subject: 'Código de Verificação - Agendamento de Sala',
        message: `
          <h2>Código de Verificação</h2>
          <p>Seu código de verificação para agendar uma sala de reunião é:</p>
          <h1 style="font-size: 32px; color: #0066cc; letter-spacing: 5px;">${otp}</h1>
          <p>Este código é válido por 5 minutos.</p>
          <p>Se você não solicitou este código, ignore este e-mail.</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      return res.status(500).json({ error: `Erro ao enviar e-mail: ${errorText}` });
    }

    return res.status(200).json({ 
      message: 'Código OTP enviado com sucesso para o e-mail',
      success: true 
    });
  } catch (error) {
    console.error('Erro ao enviar OTP:', error);
    return res.status(500).json({ error: 'Erro ao enviar código de verificação' });
  }
}
