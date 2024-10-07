'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import img1 from '@/assets/imagem1.jpg'
import img2 from '@/assets/imagem2.jpg'
import img3 from '@/assets/imagem3.jpg'
import img6 from '@/assets/imagem6.png'

import Cardapio from '../Cardapio/page'
import EditorDeTexto from '../EditorTexto/page'

const carouselData = [
  {
    id: 1,
    title: "Bem-vindo à nova Intranet do Grupo Plínio Fleck!",
    description: "Criamos este espaço para tornar o seu dia a dia mais prático e eficiente. Aqui, você encontrará facilmente os recursos mais importantes para o seu trabalho, como documentos, informações de auditoria e ferramentas essenciais para a rotina. Além disso, a nova Intranet facilita o acesso às novidades e comunicados da empresa, tudo de forma integrada e organizada. Nosso objetivo é oferecer um ambiente digital que apoie suas atividades e promova a colaboração entre as equipes. Explore e aproveite todos os benefícios desta nova plataforma!",
    imageUrl: img1
  },
  {
    id: 2,
    title: "Empresa de Tecnologia Lança Dispositivo de Realidade Aumentada",
    description: "O novo gadget promete transformar a maneira como interagimos com o mundo digital, mesclando perfeitamente realidade e virtualidade.",
    imageUrl: img2
  },
  {
    id: 3,
    title: "Acordo Climático Global Alcança Marco Histórico",
    description: "Líderes mundiais chegam a um consenso sobre medidas drásticas para combater as mudanças climáticas, estabelecendo metas ambiciosas para as próximas décadas.",
    imageUrl: img3
  },
  {
    id: 4,
    title: "Titulo final",
    description: "Exorcizamus te, omnis immundus spiritus, omnis satanica potestas, omnis incursio infernalis adversarii, omnis legio, omnis congregatio et secta diabolica... Ergo, draco maledicte et omnis legio diabolica, adjuramus te ... cessa decipere humanas creaturas, eisque æternæ perditionìs venenum propinare... Vade, satana, inventor et magister omnis fallaciæ, hostis humanæ salutis... Humiliare sub potenti manu Dei; contremisce et effuge, invocato a nobis sancto et terribili nomine... quem inferi tremunt... Ab insidiis diaboli, libera nos, Domine. Ut Ecclesiam tuam secura tibi facias libertate servire, te rogamus, audi nos.",
    imageUrl: img6
  }
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [content, setContent] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length)
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <Carousel
        className="w-screen max-w-6xl mx-auto"
      >
        <CarouselContent>
          {carouselData.map((slide) => (
            <CarouselItem key={slide.id} >
              <div className="flex h-[600px] p-6">
                <div className="w-1/2 flex flex-col pr-6">
                  <h2 className="text-3xl font-bold mb-4 pb-12">{slide.title}</h2>
                  <p className="text-lg text-justify">{slide.description}</p>
                </div>
                <div className="w-1/2 relative">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill={true}
                    objectFit="cover"
                    className="rounded-xl cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Cardapio />
      <EditorDeTexto 
        value={content}
        onChange={(updatedContent: string) => {
          setContent(updatedContent)
          console.log(content)}} // Função onChange passada corretamente
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[50vw] max-h-[50vh] p-0 absolute">
          <div className="relative w-full h-full">
            <Image
              src={carouselData[currentSlide].imageUrl}
              alt={carouselData[currentSlide].title}
              layout="responsive"
              width={1920}
              height={1080}
              objectFit="contain"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}