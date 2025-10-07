'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import imagem from '@/assets/teste.jpeg';
import PocketBase from "pocketbase";
import Loading from '@/components/personal/Loading/page';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");

interface Aniversario {
  CRACHA: number;
  FUNCIONARIO: string;
  SETOR: string;
  DIA_ANIVERSARIO: string;
  MES_ANIVERSARIO: string;
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

// Subcomponente responsável por exibir aniversariantes
function AniversarianteCard({ aniversario }: { aniversario: Aniversario }) {
  const [fotoUrl, setFotoUrl] = useState<string>(imagem);

  useEffect(() => {
    const fetchFoto = async () => {
      const url = await getFoto(aniversario.CRACHA.toString());
      setFotoUrl(url);
    };
    fetchFoto();
  }, [aniversario.CRACHA]);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col items-center justify-center space-y-2">
        <Image
          className="rounded-full bg-muted dark:brightness-[0.8]"
          src={fotoUrl}
          alt={`Funcionário ${aniversario.FUNCIONARIO}`}
          width={96}
          height={96}
          style={{
            maxWidth: "100%",
            height: "auto"
          }}
        />
        <h3 className="text-lg font-semibold text-center">
          {aniversario.FUNCIONARIO || 'Nome não disponível'}
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          Setor: {aniversario.SETOR || 'Setor não disponível'}
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Aniversário: {aniversario.DIA_ANIVERSARIO}/{aniversario.MES_ANIVERSARIO}
        </p>
      </div>
    </div>
  );
}

export default function Aniversariantes() {
  const [aniversarios, setAniversarios] = useState<Aniversario[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMonth, setExpandedMonth] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchAniversarios = async () => {
      try {
        const response = await fetch('/api/aniversarios', {
          signal: controller.signal,
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setAniversarios(data);
        } else {
          console.error("Dados inválidos recebidos: ", data);
        }
      } catch (error: any) {
        // Ignora erros de abort
        if (error.name === 'AbortError') {
          return;
        }
        console.error("Erro ao buscar aniversários:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAniversarios();

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

  const aniversariosPorMesEDia = aniversarios.reduce((acc, aniversario) => {
    const mesAniversario = new Date(2023, Number(aniversario.MES_ANIVERSARIO) - 1, Number(aniversario.DIA_ANIVERSARIO))
      .toLocaleString('default', { month: 'long' });
    const diaAniversario = Number(aniversario.DIA_ANIVERSARIO);

    if (!acc[mesAniversario]) {
      acc[mesAniversario] = [];
    }
    acc[mesAniversario].push({ ...aniversario, diaAniversario });
    return acc;
  }, {} as Record<string, Aniversario[]>);

  const ordemMeses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const mesesOrdenados = Object.keys(aniversariosPorMesEDia).sort((a, b) =>
    ordemMeses.indexOf(a.toLowerCase()) - ordemMeses.indexOf(b.toLowerCase())
  );

  mesesOrdenados.forEach(mes => {
    aniversariosPorMesEDia[mes].sort((a, b) => a.diaAniversario - b.diaAniversario);
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
                {aniversariosPorMesEDia[mes].map((aniversario, index) => (
                  <AniversarianteCard key={index} aniversario={aniversario} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
