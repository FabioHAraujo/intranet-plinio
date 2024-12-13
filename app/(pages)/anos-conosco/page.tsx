'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

import Loading from '@/components/personal/Loading/page';

interface Homenagem {
  id: string;
  nome: string;
  descricao: string;
  thumbnail: string;
}

export default function AnosConosco() {
  const tipo = 'tempo_de_empresa'; // Parâmetro fixo para esta página
  const titulo = 'Tempo de Casa'; // Título fixo para esta página

  const [homenagens, setHomenagens] = useState<Homenagem[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/${tipo}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar dados da API');
        }
        const data: Homenagem[] = await response.json();
        setHomenagens(data);
        setCarregado(true);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [tipo]);

  useEffect(() => {
    if (selectedImageIndex !== null && scrollRef.current) {
      const selectedThumb = scrollRef.current.children[selectedImageIndex] as HTMLElement;
      if (selectedThumb) {
        selectedThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedImageIndex]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeDialog = () => {
    setSelectedImageIndex(null);
  };

  return carregado ? (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10">{titulo}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {homenagens.map((homenagem, index) => (
          <Dialog
            key={homenagem.id}
            open={selectedImageIndex === index}
            onOpenChange={(isOpen) => {
              if (!isOpen) closeDialog();
            }}
          >
            <DialogTrigger asChild>
              <Card
                className="overflow-hidden cursor-pointer"
                onClick={() => handleImageClick(index)}
              >
                <div className="relative aspect-[4/3] group">
                  <Image
                    src={homenagem.thumbnail}
                    alt={homenagem.nome}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="top"
                    className="transition-transform duration-300 transform group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black dark:from-gray-600 to-transparent h-1/3" />
                  <div className="absolute bottom-4 left-4 text-primary-foreground">
                    <h2 className="text-xl font-bold text-white">{homenagem.nome}</h2>
                    <p className="text-sm pr-4 text-justify text-white">{homenagem.descricao}</p>
                    <Badge className="relative text-xs mt-2 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">{tipo}</Badge>
                  </div>
                </div>
              </Card>
            </DialogTrigger>
            {selectedImageIndex === index && (
              <DialogContent
                className="p-4 flex flex-col items-center justify-between max-h-[90vh]"
                style={{ width: 'fit-content', maxWidth: 'calc(100% - 20px)' }}
              >
                <div className="relative max-w-full max-h-[75vh] flex items-start overflow-hidden">
                  <Image
                    src={homenagem.thumbnail}
                    alt={homenagem.nome}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-auto h-full object-cover rounded-md"
                    style={{ objectPosition: 'top' }}
                  />
                </div>
                <div className="w-full mt-4">
                  <ScrollArea className="h-24 w-full">
                    <div className="flex items-center space-x-4 h-full overflow-x-auto overflow-y-hidden">
                      {homenagens.map((homenagem, idx) => (
                        <div
                          key={homenagem.id}
                          className={`w-20 h-20 flex-shrink-0 cursor-pointer rounded-md ${
                            idx === selectedImageIndex ? 'ring-2 ring-primary scale-105' : 'opacity-70 hover:opacity-100'
                          }`}
                          onClick={() => handleImageClick(idx)}
                        >
                          <Image
                            src={homenagem.thumbnail}
                            alt={homenagem.nome}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full rounded-md"
                            style={{ objectPosition: 'top' }}
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            )}
          </Dialog>
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  );
}
