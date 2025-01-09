'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { X } from "lucide-react";

import Cardapio from '../Cardapio/page';

import PocketBase from "pocketbase";

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");

export default function Home() {
  const [carouselData, setCarouselData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch dados do PocketBase
  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const data = await pb.collection("carrocel").getList(1, 50, {
          filter: 'ativo = true', // Filtra somente os registros onde ativo é true
          sort: "-updated", // Ordena pelos mais recentes
        });        
        // Adiciona a URL base para os banners
        const formattedData = data.items.map((item) => ({
          id: item.id,
          title: item.titulo,
          description: item.descricao,
          imageUrl: `${pb.baseUrl}/api/files/carrocel/${item.id}/${item.banner}`,
        }));
        setCarouselData(formattedData);
      } catch (error) {
        console.error("Erro ao buscar dados do PocketBase:", error);
      }
    };

    fetchCarouselData();
  }, []);

  return (
    <div>
      <section className="w-full h-5/6 px-4">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          loop
          className="w-full h-full rounded-lg flex"
        >
          {carouselData.map((slide, index) => (
            <SwiperSlide key={slide.id} className="!flex !flex-row items-center h-auto relative">
              {/* Retângulos com as cores da bandeira do RS */}
              <div className="absolute left-0 top-0 h-full flex">
                <div className="bg-green-300 w-2"></div> {/* Verde */}
                <div className="bg-yellow-300 w-2"></div> {/* Amarelo */}
                <div className="bg-red-500 w-2"></div> {/* Vermelho */}
                <div className="bg-gray-400 w-2"></div> {/* Cinza */}
              </div>
              <div className="w-2/4 p-6 ml-4 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
                <p className="text-lg text-justify">{slide.description}</p>
              </div>
              <div className="w-2/4 relative h-full aspect-[16/9]">
                <Image
                  src={slide.imageUrl}
                  alt={`Slide image ${index + 1}`}
                  fill={true} // Usa o modo de preenchimento
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
        <DialogContent
          className="p-0 rounded-lg w-full max-w-4xl h-auto"
          style={{
            maxHeight: '90vh', // Limita a altura máxima do modal
          }}
        >
          <div className="relative w-full h-full">
            {carouselData[currentSlide] && (
              <div className="relative h-[80vh] w-full">
                <Image
                  src={carouselData[currentSlide].imageUrl}
                  alt={carouselData[currentSlide].title}
                  fill={true} // Usa o modo de preenchimento
                  className="object-contain rounded-lg"
                />
              </div>
            )}
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
