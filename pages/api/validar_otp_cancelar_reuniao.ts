import { NextApiRequest, NextApiResponse } from 'next';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

// Autenticar como admin
async function authenticateAdmin() {
  if (!pb.authStore.isValid) {
    await pb.collection('_superusers').authWithPassword(
      process.env.POCKETBASE_ADMIN_EMAIL || 'admin@email.com',
      process.env.POCKETBASE_ADMIN_PASSWORD || 'senha_admin'
    );
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email, codigo, evento_id } = req.body;

  if (!email || !codigo || !evento_id) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  try {
    // Autenticar antes de fazer operações
    await authenticateAdmin();
    console.log('🔍 Buscando OTP com:', { email, codigo, evento_id });
    
    // Primeiro tentar buscar todos os OTPs para debug
    try {
      const todosOtps = await pb.collection('otp_cancelar_reuniao').getList(1, 10, {
        sort: '-created',
      });
      console.log('📋 Total de OTPs na coleção:', todosOtps.totalItems);
      console.log('📄 Últimos OTPs:', todosOtps.items);
    } catch (debugError) {
      console.error('❌ Erro ao buscar OTPs para debug:', debugError);
    }

    // Buscar OTP válido com filtro simples primeiro
    let otps;
    try {
      otps = await pb.collection('otp_cancelar_reuniao').getFullList({
        filter: `email = "${email}"`,
        sort: '-created',
      });
      console.log('✅ OTPs encontrados para o email:', otps.length);
      
      // Filtrar manualmente se necessário
      otps = otps.filter(otp => 
        otp.codigo === codigo && 
        otp.evento_id === evento_id && 
        otp.usado === false
      );
      console.log('✅ OTPs válidos após filtro:', otps.length);
      
      if (otps.length > 0) {
        console.log('📌 Evento ID no OTP:', otps[0].evento_id);
      }
    } catch (filterError: any) {
      console.error('❌ Erro no filtro do PocketBase:', filterError);
      return res.status(500).json({ 
        error: 'Erro ao buscar código de verificação',
        details: filterError.message 
      });
    }

    if (otps.length === 0) {
      return res.status(400).json({ error: 'Código inválido ou expirado' });
    }

    const otp = otps[0];

    // Verificar se expirou
    const expiraEm = new Date(otp.expira_em);
    const agora = new Date();

    if (agora > expiraEm) {
      return res.status(400).json({ error: 'Código expirado. Solicite um novo código.' });
    }

    // Marcar OTP como usado
    await pb.collection('otp_cancelar_reuniao').update(otp.id, {
      usado: true,
    });

    // Buscar o evento
    let evento;
    try {
      evento = await pb.collection('agendamento_salas_reuniao').getOne(evento_id);
    } catch (error: any) {
      if (error.status === 404) {
        // Evento já foi deletado
        return res.status(404).json({ 
          error: 'Evento não encontrado. Pode já ter sido cancelado anteriormente.' 
        });
      }
      throw error; // Re-lançar se for outro tipo de erro
    }

    // Deletar o evento
    await pb.collection('agendamento_salas_reuniao').delete(evento_id);

    // Enviar e-mail de confirmação do cancelamento
    await fetch(process.env.WEBHOOK_NOTICIAS as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sendto: email,
        subject: 'Reunião Cancelada com Sucesso',
        message: `
          <h2>Reunião Cancelada</h2>
          <p>Sua reunião foi cancelada com sucesso:</p>
          <ul>
            <li><strong>Título:</strong> ${evento.titulo}</li>
            <li><strong>Data:</strong> ${evento.data}</li>
            <li><strong>Horário:</strong> ${evento.hora_inicio} - ${evento.hora_fim}</li>
          </ul>
          <p>Todos os participantes serão notificados sobre o cancelamento.</p>
        `,
      }),
    });

    // Notificar participantes
    if (evento.participantes && evento.participantes.length > 0) {
      for (const participante of evento.participantes) {
        await fetch(process.env.WEBHOOK_NOTICIAS as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sendto: participante,
            subject: 'Reunião Cancelada',
            message: `
              <h2>Reunião Cancelada</h2>
              <p>A reunião abaixo foi cancelada pelo organizador:</p>
              <ul>
                <li><strong>Título:</strong> ${evento.titulo}</li>
                <li><strong>Data:</strong> ${evento.data}</li>
                <li><strong>Horário:</strong> ${evento.hora_inicio} - ${evento.hora_fim}</li>
                <li><strong>Organizador:</strong> ${evento.criador_email}</li>
              </ul>
            `,
          }),
        });
      }
    }

    return res.status(200).json({ 
      message: 'Reunião cancelada com sucesso',
      success: true 
    });
  } catch (error) {
    console.error('Erro ao validar OTP e cancelar reunião:', error);
    return res.status(500).json({ error: 'Erro ao cancelar reunião' });
  }
}
