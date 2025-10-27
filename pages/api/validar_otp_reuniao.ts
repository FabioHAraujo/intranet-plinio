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

    // Gerar arquivo ICS
    const icsContent = gerarICS(titulo, data, hora_inicio, hora_fim, sala.nome, participantes, email);
    const icsBase64 = Buffer.from(icsContent).toString('base64');

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
    `;

    await fetch(process.env.WEBHOOK_NOTICIAS as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sendto: email,
        subject: `Reunião Agendada: ${titulo}`,
        message: mensagemCriador,
        attachment: {
          filename: 'reuniao.ics',
          content: icsBase64,
          contentType: 'text/calendar; charset=utf-8; method=REQUEST'
        }
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
      `;

      for (const participante of participantes) {
        await fetch(process.env.WEBHOOK_NOTICIAS as string, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sendto: participante,
            subject: `Convite: ${titulo}`,
            message: mensagemParticipantes,
            attachment: {
              filename: 'reuniao.ics',
              content: icsBase64,
              contentType: 'text/calendar; charset=utf-8; method=REQUEST'
            }
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

// Função para gerar arquivo ICS (iCalendar) compatível com Outlook, Gmail, Apple
function gerarICS(
  titulo: string, 
  data: string, 
  horaInicio: string, 
  horaFim: string, 
  sala: string,
  participantes?: string[],
  organizador?: string
): string {
  // Formatar data e hora para formato iCalendar (YYYYMMDDTHHMMSS)
  const dataIso = data.replace(/-/g, '');
  const horaInicioIso = horaInicio.replace(/:/g, '') + '00';
  const horaFimIso = horaFim.replace(/:/g, '') + '00';
  
  // Gerar UID único
  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@flecksteel.com.br`;
  
  // Timestamp atual
  const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  let ics = `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//Intranet Plinio//Agendamento Salas//PT\r
CALSCALE:GREGORIAN\r
METHOD:REQUEST\r
BEGIN:VEVENT\r
UID:${uid}\r
DTSTAMP:${dtstamp}\r
DTSTART:${dataIso}T${horaInicioIso}\r
DTEND:${dataIso}T${horaFimIso}\r
SUMMARY:${titulo}\r
DESCRIPTION:Reunião agendada via Intranet Plinio\r
LOCATION:${sala}\r
STATUS:CONFIRMED\r
SEQUENCE:0\r
PRIORITY:5\r`;

  // Adicionar organizador
  if (organizador) {
    ics += `ORGANIZER;CN=${organizador}:mailto:${organizador}\r\n`;
  }

  // Adicionar participantes
  if (participantes && participantes.length > 0) {
    participantes.forEach(p => {
      ics += `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${p}:mailto:${p}\r\n`;
    });
  }

  // Adicionar alarme (lembrete 15 minutos antes)
  ics += `BEGIN:VALARM\r
TRIGGER:-PT15M\r
ACTION:DISPLAY\r
DESCRIPTION:Lembrete: ${titulo}\r
END:VALARM\r
END:VEVENT\r
END:VCALENDAR`;

  return ics;
}
