import PocketBase from 'pocketbase';

// Configuração do PocketBase
const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

export interface Ramais {
  id: string;
  nome: string;
  ramal: string;
  setor: string;
}

export async function FetchRamais(): Promise<Ramais[]> {
  try {
    // Buscando todos os registros da coleção 'ramais' e ordenando por 'nome'
    const records = await pb.collection('ramais').getFullList({
      sort: 'nome',
      fields: 'id,nome,ramal,setor',
    });

    // Mapeando os registros para o formato desejado
    return records.map((record) => ({
      id: record.id,
      nome: record.nome,
      ramal: record.ramal,
      setor: record.setor,
    }));
  } catch (error) {
    console.error('Erro ao buscar registros no PocketBase:', error);
    throw new Error('Erro consultando ramais: ' + error);
  }
}
