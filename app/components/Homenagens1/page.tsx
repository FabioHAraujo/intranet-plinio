import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function Homenagens1() {
  const homenagens = [
    {
      nome: "Maria Silva",
      descricao: "10 anos de dedicação",
      imagem: "https://anapincolini.com.br/wp-content/uploads/2022/05/placeholder.gif",
      tipo: "homenagem"
    },
    {
      nome: "João Santos",
      descricao: "Formatura em Engenharia",
      imagem: "https://anapincolini.com.br/wp-content/uploads/2022/05/placeholder.gif",
      tipo: "formatura"
    },
    {
      nome: "Ana Oliveira",
      descricao: "20 anos de excelência",
      imagem: "https://anapincolini.com.br/wp-content/uploads/2022/05/placeholder.gif",
      tipo: "homenagem"
    },
    {
      nome: "Carlos Ferreira",
      descricao: "Prêmio de Inovação",
      imagem: "https://anapincolini.com.br/wp-content/uploads/2022/05/placeholder.gif",
      tipo: "evento"
    },
    {
      nome: "Luísa Mendes",
      descricao: "5 anos de crescimento",
      imagem: "https://anapincolini.com.br/wp-content/uploads/2022/05/placeholder.gif",
      tipo: "homenagem"
    },
    {
      nome: "Pedro Alves",
      descricao: "Formatura em Administração",
      imagem: "https://anapincolini.com.br/wp-content/uploads/2022/05/placeholder.gif",
      tipo: "formatura"
    }
  ]

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10">Nossas Homenagens</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {homenagens.map((homenagem, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image
                src={homenagem.imagem}
                alt={homenagem.nome}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
              <div className="absolute bottom-4 left-4 text-primary-foreground">
                <h2 className="text-xl font-bold">{homenagem.nome}</h2>
                <p className="text-sm">{homenagem.descricao}</p>
              </div>
              <Badge 
                className="absolute bottom-4 right-4 text-xs"
              >
                {homenagem.tipo}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}