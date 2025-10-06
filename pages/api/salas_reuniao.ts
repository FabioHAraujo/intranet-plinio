import { NextApiRequest, NextApiResponse } from 'next';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const salas = await pb.collection('salas_reuniao').getFullList({
      sort: 'nome',
    });

    return res.status(200).json(salas);
  } catch (error) {
    console.error('Erro ao buscar salas:', error);
    return res.status(500).json({ error: 'Erro ao buscar salas de reunião' });
  }
}
