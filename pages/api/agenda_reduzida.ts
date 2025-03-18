import type { NextApiRequest, NextApiResponse } from 'next';
import { FetchAgenda } from '@/lib/functions/agenda';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ramais = await FetchAgenda();
    res.status(200).json(ramais);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar ramais: ' + error });
  }
}
