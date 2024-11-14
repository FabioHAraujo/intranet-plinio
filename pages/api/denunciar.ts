// pages/api/denunciar.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { setor, individuo, descricao } = req.body;

    const subject = "DENÚNCIA ANÔNIMA - ABUSO!!!";
    const message = `
      Setor da Denúncia: ${setor}

      Indivíduo Denunciado: ${individuo}

      Descrição da Situação: ${descricao}
    `;

    try {
      const info = await transporter.sendMail({
        from: `"Notificação" <${process.env.SMTP_USER}>`,
        to: 'fabio-araujo@flecksteel.com.br',
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
