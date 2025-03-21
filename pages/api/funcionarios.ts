import type { NextApiRequest, NextApiResponse } from 'next';
import oracledb from 'oracledb';

interface Funcionario {
  CRACHA: string | number;
  FUNCIONARIO: string;
  SETOR: string;
  ADMISSAO: Date | null;
}

type RowType = [string | number, string, string, Date | null];


async function fetchFuncionarios(): Promise<Funcionario[]> {
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
          CASE 
              WHEN R34FUN.numcad = '901312' THEN TO_DATE('15/07/2002', 'DD/MM/YYYY')
              WHEN R34FUN.numcad = '152' THEN TO_DATE('01/03/1987', 'DD/MM/YYYY')
              WHEN R34FUN.numcad = '400139' THEN TO_DATE('01/01/1988', 'DD/MM/YYYY')
              WHEN R34FUN.numcad = '245' THEN TO_DATE('01/07/1982', 'DD/MM/YYYY')
              WHEN R34FUN.numcad = '454' THEN TO_DATE('01/03/1976', 'DD/MM/YYYY')
              ELSE R34FUN.DATADM
          END AS ADMISSAO
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
          -- REMOVER DIRETORIA:
          -- MARCELO:
          AND R34FUN.NUMCAD NOT IN ('130016','901267','100011')
          -- ANA:
          AND R34FUN.NUMCAD NOT IN ('901269', '100013', '130018')
          -- MONICA:
          AND R34FUN.NUMCAD NOT IN ('100012', '130017', '901268')
      ORDER BY 
          ADMISSAO
    `);

    if (!result.rows) {
      return [];
    }

    // Agora especificamos que `rows` é do tipo `RowType[]`
    const funcionarios: Funcionario[] = (result.rows as RowType[]).map((row) => ({
      CRACHA: row[0],
      FUNCIONARIO: row[1],
      SETOR: row[2],
      ADMISSAO: row[3],
    }));

    return funcionarios;
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
    const funcionarios = await fetchFuncionarios();
    res.status(200).json(funcionarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar funcionários : ' + error});
  }
}
