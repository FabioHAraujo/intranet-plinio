// pages/api/ramais.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { FetchRamais } from '../functions/busca'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ramais = await FetchRamais()
    res.status(200).json(ramais)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar ramais' + error})
  }
}
