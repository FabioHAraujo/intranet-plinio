'use client'

import { useEffect, useState } from 'react';
import Image from "next/image";
import imagem from '@/assets/teste.jpeg';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Aniversario {
  CRACHA: number;
  FUNCIONARIO: string;
  SETOR: string;
  DIA_ANIVERSARIO: string;
  MES_ANIVERSARIO: string;
}

export default function Aniversariantes() {
  const [aniversarios, setAniversarios] = useState<Aniversario[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMonth, setExpandedMonth] = useState<string>("");

  useEffect(() => {
    const fetchAniversarios = async () => {
      try {
        const response = await fetch('/api/aniversarios');
        const data = await response.json();

        if (Array.isArray(data)) {
          setAniversarios(data);
        } else {
          console.error("Dados inválidos recebidos: ", data);
        }
      } catch (error) {
        console.error("Erro ao buscar aniversários:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAniversarios();
  }, []);

  useEffect(() => {
    const mesAtual = new Date().toLocaleString('default', { month: 'long' });
    setExpandedMonth(mesAtual);
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  const aniversariosPorMesEDia = aniversarios.reduce((acc, aniversario) => {
    const mesAniversario = new Date(`2023-${aniversario.MES_ANIVERSARIO}-${aniversario.DIA_ANIVERSARIO}`).toLocaleString('default', { month: 'long' });
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

  // Ordenar aniversariantes dentro de cada mês pelo dia de aniversário
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
            <AccordionTrigger>
              {mes}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {aniversariosPorMesEDia[mes].map((aniversario, index) => (
                  <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-col items-center justify-center space-y-2">
                      <Image
                        className="rounded-full bg-muted dark:brightness-[0.8]"
                        src={imagem}
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
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
