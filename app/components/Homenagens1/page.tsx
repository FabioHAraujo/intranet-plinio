import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type HomenagensProps = {
  titulo: string;
  tipo: string;
};

interface Homenagem {
  id: string;
  nome: string;
  descricao: string;
  thumbnail: string;
}

export default function Homenagens1({ titulo, tipo }: HomenagensProps) {
  const [homenagens, setHomenagens] = useState<Homenagem[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    // Consulta a API baseada no tipo fornecido
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/${tipo}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar dados da API");
        }
        const data: Homenagem[] = await response.json();
        setHomenagens(data);
        setCarregado(true);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [tipo]); // Executa a consulta sempre que `tipo` mudar

  return (
    carregado ? (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10">{titulo}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {homenagens.map((homenagem) => (
          <Card key={homenagem.id} className="overflow-hidden">
            <div className="relative aspect-[4/3] group">
              <Image
                src={homenagem.thumbnail}
                alt={homenagem.nome}
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                className="transition-transform duration-300 transform group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black dark:from-white to-transparent h-2/3" />
              <div className="absolute bottom-4 left-4 text-primary-foreground">
                <h2 className="text-xl font-bold">{homenagem.nome}</h2>
                <p className="text-sm pr-4 text-justify">{homenagem.descricao}</p>
                <Badge className="relative text-xs mt-2">{tipo}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>) : ( 
    <div className="flex items-center justify-center min-h-screen" role="status">
      <div role="status">
        <svg aria-hidden="true" className="inline w-40 h-40 text-gray-200 fill-gray-600 animate-spin dark:text-gray-600 dark:fill-white " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
      </div> 
    </div>
    )
  );
}
