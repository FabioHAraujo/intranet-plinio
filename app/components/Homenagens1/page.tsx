'use client'

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

import Loading from "@/components/personal/Loading/page";

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
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black dark:from-gray-400 to-transparent h-1/3" />
              <div className="absolute bottom-4 left-4 text-primary-foreground">
                <h2 className="text-xl font-bold text-white">{homenagem.nome}</h2>
                <p className="text-sm pr-4 text-justify text-white">{homenagem.descricao}</p>
                <Badge className="relative text-xs mt-2 text-white">{tipo}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>) : ( 
     <Loading />
    )
  );
}
