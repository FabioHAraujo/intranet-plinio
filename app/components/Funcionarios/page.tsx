import { useEffect, useState } from 'react';
import Image from "next/image";
import imagem from '@/assets/teste.jpeg';

interface Funcionario {
  CRACHA: number;
  FUNCIONARIO: string;
  SETOR: string;
  ADMISSAO: string;
}

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await fetch('/api/funcionarios');
        const data = await response.json();

        console.log("Dados recebidos da API:", data); // Verifique os dados aqui

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

  if (loading) {
    return <p>Carregando...</p>;
  }

  const calcularAnosNaEmpresa = (dataAdmissao) => {
    if (!dataAdmissao) return 'Data não disponível';
    
    const entrada = new Date(dataAdmissao);
    const hoje = new Date();
    const anosDeServico = hoje.getFullYear() - entrada.getFullYear();
    
    // Verifica se a data de entrada já passou este ano
    const mesDeEntrada = entrada.getMonth();
    const mesAtual = hoje.getMonth();
    
    // Se o mês de entrada for maior que o atual, subtrai 1 do total
    if (mesDeEntrada > mesAtual || (mesDeEntrada === mesAtual && entrada.getDate() > hoje.getDate())) {
      return anosDeServico - 1;
    }
  
    return anosDeServico;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {funcionarios.map((funcionario, index) => (
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
            <p className="text-sm text-muted-foreground text-center center">
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
  );
}
