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
import natal from '@/assets/natal.jpeg'

import Cardapio from '../Cardapio/page'

const carouselData = [
  {
    id: 1,
    title: "Bem-vindo à nova Intranet do Grupo Plínio Fleck!",
    description: "Criamos este espaço para tornar o seu dia a dia mais prático e eficiente. Aqui, você encontrará facilmente os recursos mais importantes para o seu trabalho, como documentos, informações de auditoria e ferramentas essenciais para a rotina. Além disso, a nova Intranet facilita o acesso às novidades e comunicados da empresa, tudo de forma integrada e organizada. Nosso objetivo é oferecer um ambiente digital que apoie suas atividades e promova a colaboração entre as equipes. Explore e aproveite todos os benefícios desta nova plataforma!",
    imageUrl: img1
  },
  {
    id: 2,
    title: "Inauguração da Nova Área de Lazer Nayr Anna Fleck",
    description: "Celebramos a inauguração da nova Área de Lazer Nayr Anna Fleck, um espaço projetado para promover momentos de descontração e convivência entre os colaboradores. O local recebe o nome em homenagem à Nayr Anna Fleck, esposa do fundador do Grupo Plínio Fleck, reconhecida por seu legado de apoio e dedicação. Aproveite para conhecer e desfrutar deste ambiente pensado com carinho para todos nós!",
    imageUrl: img2
  },
  {
    id: 3,
    title: "Inauguração do Novo Auditório Plínio Fleck",
    description: "Com grande entusiasmo, anunciamos a inauguração do novo Auditório Plínio Fleck, uma homenagem ao fundador do Grupo, Sr. Plínio Fleck. Este espaço foi cuidadosamente projetado para oferecer conforto e tecnologia audiovisual, sendo ideal para reuniões, eventos e treinamentos que fortalecem a nossa trajetória de sucesso. Venha conhecer e fazer parte deste marco em nossa história!",
    imageUrl: img3
  },
  {
    id: 4,
    title: "Feliz Natal e Próspero Ano Novo!",
    description: "Agradecemos a todos os colaboradores que estiveram conosco ao longo deste ano, contribuindo para o nosso crescimento e sucesso. Desejamos que este Natal seja repleto de alegria, amor e união, e que o ano novo traga novas oportunidades e realizações para todos. Que 2024 seja ainda mais próspero e cheio de conquistas. Boas festas e um feliz ano novo!",
    imageUrl: natal
  }
];



export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)  

  return (
    <div>
      <section className="w-full h-5/6 px-4">
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
            <SwiperSlide key={index} className="!flex !flex-row items-center h-auto relative">
              {/* Retângulos com as cores da bandeira do RS */}
              <div className="absolute left-0 top-0 h-full flex">
                <div className="bg-green-300 w-2"></div> {/* Verde */}
                <div className="bg-yellow-300 w-2"></div> {/* Amarelo */}
                <div className="bg-red-500 w-2"></div> {/* Vermelho */}
                <div className="bg-gray-400 w-2"></div> {/* Vermelho */}
              </div>
              <div className="w-2/4 p-6 ml-4 min-h-full! flex flex-col justify-between"> {/* Adiciona `min-h-full` para garantir altura mínima */}
                <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
                <p className="text-lg text-justify flex-grow">{slide.description}</p> {/* `flex-grow` faz o texto expandir */}
              </div>
              <div className="w-2/4 relative h-full aspect-[16/9]">
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