import type { NextApiRequest, NextApiResponse } from 'next';
import PocketBase from 'pocketbase';

// Configuração do PocketBase
const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

// Interface para o tipo de resposta e tipo de registro do PocketBase
interface Formandos {
  id: string;
  nome: string;
  descricao: string;
  thumbnail: string;
}

interface PocketBaseRecord {
  id: string;
  nome: string;
  descricao: string;
  thumbnail?: string;
}

async function fetchTempoEmpresa(): Promise<Formandos[]> {
  try {
    // Buscando todos os registros da coleção 'formandos' com ordenação e campos específicos
    const records: PocketBaseRecord[] = await pb.collection('formandos').getFullList({
      sort: '-created',
      fields: 'id,nome,descricao,thumbnail',
    });

    // Mapeando os registros para o formato desejado
    const result: Formandos[] = records.map((record) => ({
      id: record.id,
      nome: record.nome,
      descricao: record.descricao,
      thumbnail: record.thumbnail ? `https://pocketbase.flecksteel.com.br/api/files/formandos/${record.id}/${record.thumbnail}` : '',
    }));
    console.log(result);

    return result;
  } catch (error) {
    console.error('Erro ao buscar registros no PocketBase:', error);
    throw error;
  }
}

// Handler da API do Next.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tempoEmpresa = await fetchTempoEmpresa();
    res.status(200).json(tempoEmpresa);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar registros: ' + error });
  }
}
