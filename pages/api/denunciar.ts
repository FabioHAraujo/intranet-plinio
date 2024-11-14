// pages/api/denunciar.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: 587,
  secure: false, // 'secure' é false para a porta 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false, // Pode ser necessário para alguns servidores
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { descricao } = req.body;

    // Obtendo a data e hora atual
    const now = new Date();
    const dataOcorrencia = now.toLocaleDateString('pt-BR');
    const horaOcorrencia = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const subject = "DENÚNCIA ANÔNIMA - ABUSO!!!";
    const message = `
      Data da Ocorrência: ${dataOcorrencia}
      Hora da Ocorrência: ${horaOcorrencia}

      Descrição da Situação: ${descricao}
    `;

    try {
      const info = await transporter.sendMail({
        from: `"Notificação" <${process.env.SMTP_USER}>`,
        to: `${process.env.SMTP_SENDTO}`,
        subject,
        text: message,
        html: `<pre>${message}</pre>`,
      });

      console.log('Denúncia Enviada: %s', info.messageId);
      res.status(200).json({ message: 'Denúncia enviada com sucesso!' });
    } catch (error) {
      console.error('Erro ao enviar a denúncia:', error);
      res.status(500).json({ message: 'Erro ao enviar a denúncia.' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
