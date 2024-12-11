import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { recipient, subject, message } = req.body;

  if (!recipient || !subject || !message) {
    return res.status(400).json({ error: 'Dados insuficientes. Certifique-se de enviar recipient, subject e message.' });
  }

  try {
    const response = await fetch(process.env.WEBHOOK_NOTICIAS as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sendto: recipient,
        subject: subject,
        message: message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Erro ao enviar notificação: ${errorText}` });
    }

    const result = await response.json();
    return res.status(200).json({ message: 'Notificação enviada com sucesso.', result });
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao enviar a notificação.' });
  }
}
