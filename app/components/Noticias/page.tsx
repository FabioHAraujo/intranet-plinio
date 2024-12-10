'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import placeholder from '@/assets/teste.jpeg';

type Noticia = {
  id: string;
  titulo: string;
  imagemUrl: string;
  dataPublicacao: string;
  tags: string[];
  texto: string; // Incluído para passar o conteúdo completo
};

export default function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNoticias = async () => {
    try {
      const response = await fetch("https://pocketbase.flecksteel.com.br/api/collections/noticias/records");
      const data = await response.json();

      const mappedNoticias = data.items.map((item: any) => ({
        id: item.id,
        titulo: item.titulo,
        imagemUrl: item.banner
          ? `https://pocketbase.flecksteel.com.br/api/files/${item.collectionId}/${item.id}/${item.banner}`
          : placeholder.src,
        dataPublicacao: item.created,
        tags: item.tags?.tags || [],
        texto: item.texto, // Incluído o texto da notícia
      }));

      setNoticias(mappedNoticias);
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCardClick = (noticia: Noticia) => {
    router.push(`/sobre-a-noticia?id=${noticia.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Últimas Notícias</h1>
      {loading ? (
        <p className="text-center">Carregando notícias...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <Card
              key={noticia.id}
              className="overflow-hidden cursor-pointer"
              onClick={() => handleCardClick(noticia)}
            >
              <Image
                src={noticia.imagemUrl}
                width={640}
                height={310}
                alt={`Banner para ${noticia.titulo}`}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle className="text-xl">{noticia.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDate(noticia.dataPublicacao)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {noticia.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
