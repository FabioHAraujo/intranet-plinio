'use client';

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function SobreANoticia() {
  const searchParams = useSearchParams();
  const noticiaId = searchParams.get("id");

  const [noticia, setNoticia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const response = await fetch(
          `https://pocketbase.flecksteel.com.br/api/collections/noticias/records/${noticiaId}`
        );
        const data = await response.json();
        setNoticia(data);
      } catch (error) {
        console.error("Erro ao buscar notícia:", error);
      } finally {
        setLoading(false);
      }
    };

    if (noticiaId) fetchNoticia();
  }, [noticiaId]);

  if (loading) {
    return <p className="text-center">Carregando...</p>;
  }

  if (!noticia) {
    return <p className="text-center">Notícia não encontrada.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{noticia.titulo}</h1>
      <div className="mb-4 flex justify-center">
        <Image
          src={`https://pocketbase.flecksteel.com.br/api/files/${noticia.collectionId}/${noticia.id}/${noticia.banner}`}
          alt={noticia.titulo}
          width={800}
          height={400}
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {noticia.tags?.tags.map((tag: string) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: noticia.texto }}
      />
    </div>
  );
}
