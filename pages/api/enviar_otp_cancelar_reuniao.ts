import { NextApiRequest, NextApiResponse } from 'next';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email, evento_id } = req.body;

  if (!email || !evento_id) {
    return res.status(400).json({ error: 'E-mail e ID do evento são obrigatórios' });
  }

  try {
    // Verificar se o evento existe e se o email é do criador
    const evento = await pb.collection('agendamento_salas_reuniao').getOne(evento_id);
    
    if (evento.criador_email !== email) {
      return res.status(403).json({ error: 'Apenas o organizador pode cancelar esta reunião' });
    }

    // Gerar código OTP de 6 dígitos
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Calcular expiração (5 minutos)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Salvar OTP no PocketBase
    console.log('💾 Salvando OTP:', { email, codigo: otp, evento_id, expira_em: expiresAt.toISOString() });
    
    const otpRecord = await pb.collection('otp_cancelar_reuniao').create({
      email,
      codigo: otp,
      evento_id,
      expira_em: expiresAt.toISOString(),
      usado: false,
    });
    
    console.log('✅ OTP salvo:', otpRecord);

    // Enviar e-mail com OTP
    const emailResponse = await fetch(process.env.WEBHOOK_NOTICIAS as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sendto: email,
        subject: 'Código de Verificação - Cancelamento de Reunião',
        message: `
          <h2>Cancelamento de Reunião</h2>
          <p>Foi solicitado o cancelamento da reunião: <strong>${evento.titulo}</strong></p>
          <p>Seu código de verificação para confirmar o cancelamento é:</p>
          <h1 style="font-size: 32px; color: #dc2626; letter-spacing: 5px;">${otp}</h1>
          <p>Este código é válido por 5 minutos.</p>
          <p>Se você não solicitou este cancelamento, ignore este e-mail.</p>
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
    console.error('Erro ao enviar OTP de cancelamento:', error);
    return res.status(500).json({ error: 'Erro ao enviar código de verificação' });
  }
}
