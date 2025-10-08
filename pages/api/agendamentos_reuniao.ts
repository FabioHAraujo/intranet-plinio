import { NextApiRequest, NextApiResponse } from 'next';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { mes, ano } = req.query;

  try {
    let filter = '';
    
    // Se mes e ano forem fornecidos, filtrar por mês
    if (mes && ano) {
      const mesStr = String(mes).padStart(2, '0');
      const anoStr = String(ano);
      const dataInicio = `${ano}-${mes.toString().padStart(2, '0')}-01`;
      const ultimoDia = new Date(parseInt(ano), parseInt(mes), 0).getDate();
      const dataFim = `${ano}-${mes.toString().padStart(2, '0')}-${ultimoDia}`;
      
      // Usando operador & ao invés de &&
      filter = `data >= "${dataInicio}" & data <= "${dataFim}"`;
    }

    const agendamentos = await pb.collection('agendamento_salas_reuniao').getFullList({
      filter,
      sort: 'data,hora_inicio',
      expand: 'sala',
    });

    return res.status(200).json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
}
