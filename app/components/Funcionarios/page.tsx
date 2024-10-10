import { useEffect, useState } from 'react';
import Image from "next/image";
import imagem from '@/assets/teste.jpeg';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Funcionario {
  CRACHA: number;
  FUNCIONARIO: string;
  SETOR: string;
  ADMISSAO: string;
}

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMonth, setExpandedMonth] = useState<string>("");

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await fetch('/api/funcionarios');
        const data = await response.json();

        if (Array.isArray(data)) {
          setFuncionarios(data);
        } else {
          console.error("Dados inválidos recebidos: ", data);
        }
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionarios();
  }, []);

  useEffect(() => {
    const mesAtual = new Date().toLocaleString('default', { month: 'long' });
    setExpandedMonth(mesAtual);
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

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
  
    return (anosDeServico + 1);
  };

  const funcionariosPorMesEDia = funcionarios.reduce((acc, funcionario) => {
    const dataAdmissao = new Date(funcionario.ADMISSAO);
    const mesAniversario = dataAdmissao.toLocaleString('default', { month: 'long' });
    const diaAniversario = dataAdmissao.getDate();

    if (!acc[mesAniversario]) {
      acc[mesAniversario] = [];
    }
    acc[mesAniversario].push({ ...funcionario, diaAniversario });
    return acc;
  }, {} as Record<string, Funcionario[]>);

  const ordemMeses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const mesesOrdenados = Object.keys(funcionariosPorMesEDia).sort((a, b) => 
    ordemMeses.indexOf(a.toLowerCase()) - ordemMeses.indexOf(b.toLowerCase())
  );

  // Ordenar funcionários dentro de cada mês pelo dia de admissão
  mesesOrdenados.forEach(mes => {
    funcionariosPorMesEDia[mes].sort((a, b) => {
      const diaA = new Date(a.ADMISSAO).getDate();
      const diaB = new Date(b.ADMISSAO).getDate();
      return diaA - diaB;
    });
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
                {funcionariosPorMesEDia[mes].map((funcionario, index) => (
                  <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-col items-center justify-center space-y-2">
                      <Image
                        className="rounded-full bg-muted dark:brightness-[0.8]"
                        src={imagem}
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
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
