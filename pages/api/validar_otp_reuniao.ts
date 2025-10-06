import { NextApiRequest, NextApiResponse } from 'next';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { 
    email, 
    codigo, 
    sala_id,
    titulo,
    data,
    hora_inicio,
    hora_fim,
    participantes // Array de e-mails
  } = req.body;

  if (!email || !codigo || !sala_id || !titulo || !data || !hora_inicio || !hora_fim) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  try {
    // Buscar OTP válido
    const otps = await pb.collection('otp_reuniao').getFullList({
      filter: `email = "${email}" && codigo = "${codigo}" && usado = false`,
      sort: '-created',
    });

    if (otps.length === 0) {
      return res.status(400).json({ error: 'Código inválido ou já utilizado' });
    }

    const otp = otps[0];

    // Verificar se expirou
    const expiresAt = new Date(otp.expira_em);
    if (expiresAt < new Date()) {
      return res.status(400).json({ error: 'Código expirado. Solicite um novo código.' });
    }

    // Verificar conflitos de horário
    const conflitos = await pb.collection('agendamento_salas_reuniao').getFullList({
      filter: `sala = "${sala_id}" && data = "${data}" && (
        (hora_inicio <= "${hora_inicio}" && hora_fim > "${hora_inicio}") ||
        (hora_inicio < "${hora_fim}" && hora_fim >= "${hora_fim}") ||
        (hora_inicio >= "${hora_inicio}" && hora_fim <= "${hora_fim}")
      )`,
    });

    if (conflitos.length > 0) {
      return res.status(400).json({ error: 'Horário já ocupado para esta sala' });
    }

    // Criar agendamento
    const agendamento = await pb.collection('agendamento_salas_reuniao').create({
      sala: sala_id,
      titulo,
      data,
      hora_inicio,
      hora_fim,
      criador_email: email,
      participantes: participantes || [],
    });

    // Marcar OTP como usado
    await pb.collection('otp_reuniao').update(otp.id, { usado: true });

    // Buscar informações da sala
    const sala = await pb.collection('salas_reuniao').getOne(sala_id);

    // Enviar e-mail para o criador
    const dataFormatada = new Date(data).toLocaleDateString('pt-BR');
    const mensagemCriador = `
      <h2>Reunião Agendada com Sucesso!</h2>
      <p>Sua reunião foi agendada com os seguintes detalhes:</p>
      <ul>
        <li><strong>Título:</strong> ${titulo}</li>
        <li><strong>Sala:</strong> ${sala.nome}</li>
        <li><strong>Data:</strong> ${dataFormatada}</li>
        <li><strong>Horário:</strong> ${hora_inicio} - ${hora_fim}</li>
        ${participantes && participantes.length > 0 ? `<li><strong>Participantes:</strong> ${participantes.join(', ')}</li>` : ''}
      </ul>
      <p>
        <a href="data:text/calendar;charset=utf-8,${encodeURIComponent(gerarICS(titulo, data, hora_inicio, hora_fim, sala.nome, participantes))}" 
           download="reuniao.ics" 
           style="display:inline-block;padding:10px 20px;background-color:#0066cc;color:white;text-decoration:none;border-radius:5px;">
          Adicionar à Agenda
        </a>
      </p>
    `;

    await fetch(process.env.WEBHOOK_NOTICIAS as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sendto: email,
        subject: `Reunião Agendada: ${titulo}`,
        message: mensagemCriador,
      }),
    });

    // Enviar e-mail para participantes
    if (participantes && participantes.length > 0) {
      const mensagemParticipantes = `
        <h2>Você foi convidado para uma reunião!</h2>
        <p><strong>${email}</strong> convidou você para uma reunião:</p>
        <ul>
          <li><strong>Título:</strong> ${titulo}</li>
          <li><strong>Sala:</strong> ${sala.nome}</li>
          <li><strong>Data:</strong> ${dataFormatada}</li>
          <li><strong>Horário:</strong> ${hora_inicio} - ${hora_fim}</li>
        </ul>
        <p>
          <a href="data:text/calendar;charset=utf-8,${encodeURIComponent(gerarICS(titulo, data, hora_inicio, hora_fim, sala.nome, participantes, email))}" 
             download="reuniao.ics" 
             style="display:inline-block;padding:10px 20px;background-color:#0066cc;color:white;text-decoration:none;border-radius:5px;">
            Adicionar à Agenda
          </a>
        </p>
      `;

      for (const participante of participantes) {
        await fetch(process.env.WEBHOOK_NOTICIAS as string, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sendto: participante,
            subject: `Convite: ${titulo}`,
            message: mensagemParticipantes,
          }),
        });
      }
    }

    return res.status(200).json({ 
      message: 'Reunião agendada com sucesso!',
      agendamento,
      success: true 
    });
  } catch (error) {
    console.error('Erro ao validar OTP e criar reunião:', error);
    return res.status(500).json({ error: 'Erro ao agendar reunião' });
  }
}

// Função para gerar arquivo ICS (iCalendar)
function gerarICS(
  titulo: string, 
  data: string, 
  horaInicio: string, 
  horaFim: string, 
  sala: string,
  participantes?: string[],
  organizador?: string
): string {
  const dataIso = data.replace(/-/g, '');
  const horaInicioIso = horaInicio.replace(/:/g, '') + '00';
  const horaFimIso = horaFim.replace(/:/g, '') + '00';
  
  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Intranet Plinio//Agendamento Salas//PT
BEGIN:VEVENT
UID:${Date.now()}@flecksteel.com.br
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${dataIso}T${horaInicioIso}
DTEND:${dataIso}T${horaFimIso}
SUMMARY:${titulo}
LOCATION:${sala}`;

  if (organizador) {
    ics += `\nORGANIZER:mailto:${organizador}`;
  }

  if (participantes && participantes.length > 0) {
    participantes.forEach(p => {
      ics += `\nATTENDEE:mailto:${p}`;
    });
  }

  ics += `\nEND:VEVENT
END:VCALENDAR`;

  return ics;
}
