'use client'

import { useState } from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { X } from "lucide-react"

// Imagens Temporárias
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
  

  return (
    <div>
      <section className="w-full h-[60vh] px-4">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ 
            clickable: true,
           }}
          loop
          className="w-full h-full rounded-lg flex"

        >
          {carouselData.map((slide, index) => (
            <SwiperSlide key={index} className="!flex !flex-row items-center relative">
              {/* Retângulos com as cores da bandeira do RS */}
              <div className="absolute left-0 top-0 h-full flex">
                <div className="bg-green-300 w-2"></div> {/* Verde */}
                <div className="bg-yellow-300 w-2"></div> {/* Amarelo */}
                <div className="bg-red-500 w-2"></div> {/* Vermelho */}
                <div className="bg-gray-400 w-2"></div> {/* Vermelho */}
              </div>
              <div className="w-2/4 p-6 ml-4"> {/* Margem adicionada para compensar os retângulos */}
                <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
                <p className="text-lg text-justify">{slide.description}</p>
              </div>
              <div className="w-2/4 relative h-full">
                <Image
                  src={slide.imageUrl}
                  alt={`Slide image ${index + 1}`}
                  fill={true}
                  className="object-cover rounded-xl"
                  onClick={() => {
                    setIsModalOpen(true);
                    setCurrentSlide(index);
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>



      <Cardapio />

      <div className='p-4'>
        <EditorDeTexto 
          value={content}
          onChange={(updatedContent: string) => {
            setContent(updatedContent)
            console.log(content)}} // Função onChange passada corretamente
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-0 absolute rounded-lg">
          <div className="w-full h-full">
            <Image
              src={carouselData[currentSlide].imageUrl}
              alt={carouselData[currentSlide].title}
              sizes="100vw 100vh"
              className='rounded-lg'
              style={{
                objectFit: "contain"
              }} />
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
  );
}