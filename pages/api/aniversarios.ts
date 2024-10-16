import type { NextApiRequest, NextApiResponse } from 'next';
import oracledb from 'oracledb';

interface Aniversario {
  CRACHA: string | number;
  FUNCIONARIO: string;
  SETOR: string;
  DIA_ANIVERSARIO: string;
  MES_ANIVERSARIO: string;
}

type RowType = [string | number, string, string, string, string];

async function fetchAniversarios(): Promise<Aniversario[]> {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
    });

    const result = await connection.execute(`
      SELECT DISTINCT
          R34FUN.numcad AS CRACHA,
          R34FUN.nomfun AS FUNCIONARIO,
          R16ORN.nomloc AS SETOR,
          TO_CHAR(R34FUN.DATNAS, 'DD') AS DIA_ANIVERSARIO,
          TO_CHAR(R34FUN.DATNAS, 'MM') AS MES_ANIVERSARIO
      FROM 
          VETORH.R034FUN R34FUN 
      INNER JOIN 
          VETORH.R016ORN R16ORN 
      ON 
          R16ORN.numloc = R34FUN.numloc
      WHERE
          R34FUN.NUMEMP IN ('13','9','10')
          AND R34FUN.SITAFA <> '9'
          AND R34FUN.SITAFA <> '23'
          AND R34FUN.SITAFA <> '26'
          AND R34FUN.SITAFA <> '25'
          AND R34FUN.NUMCAD NOT IN ('130016','901267','100011', '901269', '100013', '130018', '100012', '130017', '901268')
      ORDER BY MES_ANIVERSARIO, DIA_ANIVERSARIO
    `);

    if (!result.rows) {
      return [];
    }

    // Agora especificamos que `rows` é do tipo `RowType[]`
    const aniversarios: Aniversario[] = (result.rows as RowType[]).map((row) => ({
      CRACHA: row[0],
      FUNCIONARIO: row[1],
      SETOR: row[2],
      DIA_ANIVERSARIO: row[3],
      MES_ANIVERSARIO: row[4],
    }));

    return aniversarios;
  } catch (error) {
    console.error('Erro ao executar a consulta:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Erro ao fechar a conexão:', err);
      }
    }
  }
}

// Handler da API do Next.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const aniversarios = await fetchAniversarios();
    res.status(200).json(aniversarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar aniversários: ' + error });
  }
}
