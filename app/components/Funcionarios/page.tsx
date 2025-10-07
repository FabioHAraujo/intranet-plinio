'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import imagem from '@/assets/teste.jpeg';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Loading from '@/components/personal/Loading/page';
import PocketBase from "pocketbase";

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");

interface Funcionario {
  CRACHA: number;
  FUNCIONARIO: string;
  SETOR: string;
  ADMISSAO: string;
}

// Função para obter a URL da foto
async function getFoto(cracha: string): Promise<string> {
  try {
    const foto = await pb.collection("3x4_funcionarios").getFirstListItem(`cracha = '${cracha}'`);
    return `${pb.baseUrl}/api/files/3x4_funcionarios/${foto.id}/${foto.imagem}`;
  } catch (error) {
    console.error("Erro ao buscar foto:", error);
    return imagem; // Retorna a imagem padrão em caso de erro
  }
}

// Subcomponente para exibir o card de cada funcionário
function FuncionarioCard({ funcionario }: { funcionario: Funcionario }) {
  const [fotoUrl, setFotoUrl] = useState<string>(imagem);

  useEffect(() => {
    const fetchFoto = async () => {
      const url = await getFoto(funcionario.CRACHA.toString());
      setFotoUrl(url);
    };
    fetchFoto();
  }, [funcionario.CRACHA]);

  const calcularAnosNaEmpresa = (dataAdmissao: string) => {
    if (!dataAdmissao) return 'Data não disponível';
    const entrada = new Date(dataAdmissao);
    const hoje = new Date();
    const anosDeServico = hoje.getFullYear() - entrada.getFullYear();
    const mesDeEntrada = entrada.getMonth();
    const mesAtual = hoje.getMonth();
    if (mesDeEntrada > mesAtual || (mesDeEntrada === mesAtual && entrada.getDate() > hoje.getDate())) {
      return anosDeServico - 1;
    }
    return anosDeServico;
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col items-center justify-center space-y-2">
        <Image
          className="rounded-full bg-muted dark:brightness-[0.8]"
          src={fotoUrl}
          alt={`Funcionário ${funcionario.FUNCIONARIO}`}
          width={96}
          height={96}
          style={{
            maxWidth: "100%",
            height: "auto"
          }}
        />
        <h3 className="text-lg font-semibold text-center">
          {funcionario.FUNCIONARIO || 'Nome não disponível'}
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          Setor: {funcionario.SETOR || 'Setor não disponível'}
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Admissão: {funcionario.ADMISSAO ? new Date(funcionario.ADMISSAO).toLocaleDateString() : 'Data não disponível'}
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Anos na empresa: {calcularAnosNaEmpresa(funcionario.ADMISSAO)}
        </p>
      </div>
    </div>
  );
}

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMonth, setExpandedMonth] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchFuncionarios = async () => {
      try {
        const response = await fetch('/api/funcionarios', {
          signal: controller.signal,
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setFuncionarios(data);
        } else {
          console.error("Dados inválidos recebidos: ", data);
        }
      } catch (error: any) {
        // Ignora erros de abort
        if (error.name === 'AbortError') {
          return;
        }
        console.error("Erro ao buscar funcionários:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionarios();

    // Cancela a requisição se o componente for desmontado
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const mesAtual = new Date().toLocaleString('default', { month: 'long' });
    setExpandedMonth(mesAtual);
  }, []);

  if (loading) {
    return <Loading />;
  }

  const funcionariosPorMesEDia = funcionarios.reduce((acc, funcionario) => {
    const dataAdmissao = new Date(funcionario.ADMISSAO);
    const mesAdmissao = dataAdmissao.toLocaleString('default', { month: 'long' });
    const diaAdmissao = dataAdmissao.getDate();

    if (!acc[mesAdmissao]) {
      acc[mesAdmissao] = [];
    }
    acc[mesAdmissao].push({ ...funcionario, diaAdmissao });
    return acc;
  }, {} as Record<string, Funcionario[]>);

  const ordemMeses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const mesesOrdenados = Object.keys(funcionariosPorMesEDia).sort((a, b) =>
    ordemMeses.indexOf(a.toLowerCase()) - ordemMeses.indexOf(b.toLowerCase())
  );

  mesesOrdenados.forEach(mes => {
    funcionariosPorMesEDia[mes].sort((a, b) => a.diaAdmissao - b.diaAdmissao);
  });

  return (
    <div className="w-full">
      <Accordion
        type="single"
        collapsible
        className="space-y-4"
        value={expandedMonth}
        onValueChange={setExpandedMonth}
      >
        {mesesOrdenados.map((mes) => (
          <AccordionItem key={mes} value={mes} className="rounded-lg border bg-card text-card-foreground shadow-sm px-4">
            <AccordionTrigger>{mes}</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {funcionariosPorMesEDia[mes].map((funcionario, index) => (
                  <FuncionarioCard key={index} funcionario={funcionario} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
