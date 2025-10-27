import type { NextApiRequest, NextApiResponse } from 'next';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { sala_id, data, hora_inicio, hora_fim } = req.body;

  if (!sala_id || !data || !hora_inicio || !hora_fim) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  try {
    // Buscar agendamentos existentes para a sala na data especificada
    const agendamentos = await pb.collection('agendamento_salas_reuniao').getFullList({
      filter: `sala = "${sala_id}" && data = "${data}"`,
    });

    // Verificar se há conflito de horário
    const conflito = agendamentos.some((agendamento: any) => {
      const inicio_existente = agendamento.hora_inicio;
      const fim_existente = agendamento.hora_fim;

      // Verifica se há sobreposição de horários
      // Conflito ocorre quando:
      // 1. O novo início está entre um agendamento existente
      // 2. O novo fim está entre um agendamento existente
      // 3. O novo agendamento engloba um agendamento existente
      return (
        (hora_inicio >= inicio_existente && hora_inicio < fim_existente) ||
        (hora_fim > inicio_existente && hora_fim <= fim_existente) ||
        (hora_inicio <= inicio_existente && hora_fim >= fim_existente)
      );
    });

    if (conflito) {
      return res.status(409).json({
        disponivel: false,
        error: 'Horário já ocupado para esta sala',
      });
    }

    return res.status(200).json({
      disponivel: true,
      message: 'Sala disponível para o horário solicitado',
    });
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    return res.status(500).json({ error: 'Erro ao verificar disponibilidade da sala' });
  }
}
