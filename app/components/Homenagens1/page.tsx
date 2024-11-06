import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

type HomenagensProps = {
  titulo: string
};

export default function Homenagens1({titulo}: HomenagensProps) {
  const homenagens = [
    {
      nome: "Maria Silva",
      descricao: "Formatura em Administração",
      imagem: "https://media.istockphoto.com/id/1363637797/pt/foto/foreman-or-worker-hand-holding-checklist-for-writing-and-checking-in-goods-in-container-at.jpg?s=612x612&w=0&k=20&c=Er_Te-P995mhKC7a2ANJgc1E5hId5ln9qx1t7HSG7yM=",
      tipo: "formatura"
    },
    {
      nome: "João Santos",
      descricao: "Formatura em Engenharia",
      imagem: "https://media.istockphoto.com/id/1346124841/pt/foto/successful-construction-site-worker-thinking.jpg?s=612x612&w=0&k=20&c=mrXcKjDUmzHKVctB565RZQqXDKxZSP65E8JCXvutlvs=",
      tipo: "formatura"
    },
    {
      nome: "Ana Oliveira",
      descricao: "Formatura em Ciências Contábeis",
      imagem: "https://media.istockphoto.com/id/1149239358/pt/foto/female-apprentice-using-yoke-machine-in-factory.jpg?s=612x612&w=0&k=20&c=7H2TfFQ4wJlTCZBctq39Ivn3USiRMsq0JO2ZhB7xCkk=",
      tipo: "formatura"
    },
    {
      nome: "Carlos Ferreira",
      descricao: "Formatura em Tecnologia da Informação",
      imagem: "https://media.istockphoto.com/id/1304746031/pt/foto/taking-better-control-with-technology.jpg?s=612x612&w=0&k=20&c=cH1CbR0lAeEhoPWJ5sJzOc4wCZZ6_xkifvIm651uKC0=",
      tipo: "formatura"
    },
    {
      nome: "Luísa Mendes",
      descricao: "Formatura em Economia",
      imagem: "https://media.istockphoto.com/id/1210182430/pt/foto/confident-female-warehouse-worker.jpg?s=612x612&w=0&k=20&c=OqTaQFeLtbe1gAmxzohwwwbbJD4jV0FcKq0cTYCBK2o=",
      tipo: "formatura"
    },
    {
      nome: "Pedro Alves",
      descricao: "Formatura em Solda MIG",
      imagem: "https://media.istockphoto.com/id/666132290/pt/foto/industrial-welder-with-torch.jpg?s=612x612&w=0&k=20&c=m2x3mvkcvVx2mz_LbfNnn1rKErisuZmroaZPdk2Wkus=",
      tipo: "formatura"
    }
  ]

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10">{titulo}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {homenagens.map((homenagem, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative aspect-[4/3] group">
              <Image
                src={homenagem.imagem}
                alt={homenagem.nome}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 transform group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black dark:from-white to-transparent h-2/3" />
              <div className="absolute bottom-4 left-4 text-primary-foreground">
                <h2 className="text-xl font-bold">{homenagem.nome}</h2>
                <p className="text-sm pr-4 text-justify">{homenagem.descricao}</p>
                <Badge className="relative text-xs mt-2">{homenagem.tipo}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}