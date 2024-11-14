'use client'

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import React from "react"
// Tipo para representar uma notícia
type Noticia = {
  id: number
  titulo: string
  imagemUrl: string
  dataPublicacao: string
  tags: string[]
}

// Dados fictícios de notícias
const noticias: Noticia[] = [
  {
    id: 1,
    titulo: "Nova política de trabalho remoto anunciada",
    imagemUrl: "https://anapincolini.com.br/wp-content/uploads/2022/05/placeholder.gif",
    dataPublicacao: "2023-10-15",
    tags: ["RH", "Política"]
  },
  {
    id: 2,
    titulo: "Lançamento do novo produto previsto para o próximo trimestre",
    imagemUrl: "https://anapincolini.com.br/wp-content/uploads/2022/05/placeholder.gif",
    dataPublicacao: "2023-10-10",
    tags: ["Produto", "Lançamento"]
  },
  {
    id: 3,
    titulo: "Resultados financeiros do Q3 superam expectativas",
    imagemUrl: "https://anapincolini.com.br/wp-content/uploads/2022/05/placeholder.gif",
    dataPublicacao: "2023-10-05",
    tags: ["Finanças", "Relatório"]
  },
  {
    id: 4,
    titulo: "Tá sol e não tá chuva - Dizem as telemetrias do clima",
    imagemUrl: "https://anapincolini.com.br/wp-content/uploads/2022/05/placeholder.gif",
    dataPublicacao: "2024-10-05",
    tags: ["Clima", "Tempo"]
  }
]

export default function Noticias() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Notícias Internas da Empresa</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {noticias.map((noticia) => (
          <Card key={noticia.id} className="overflow-hidden">
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
                {new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR')}
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
    </div>
  )
}