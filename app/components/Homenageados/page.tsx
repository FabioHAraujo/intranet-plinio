import { useState, useEffect } from 'react';
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'; // Ajuste o caminho conforme necessário
import img1 from '@/assets/imagem1.jpg';
import img2 from '@/assets/imagem2.jpg';
import img3 from '@/assets/imagem3.jpg';
import img4 from '@/assets/imagem4.jpg';

// Dados de exemplo
const heroImages = [img1, img2, img3];

const photoList = [
  { name: 'João Silvaaaaaaaaaaa', image: img1 },
  { name: 'Maria Santos', image: img2 },
  { name: 'Pedro Oliveira', image: img3 },
  { name: 'Ana Rodrigues', image: img4 },
];

export default function HeroWithPhotoList() {
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Para armazenar a imagem clicada

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full h-[60vh]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          className="w-full h-full rounded-lg"
        >
          {heroImages.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image}
                alt={`Hero image ${index + 1}`}
                fill={true}
                style={{
                  objectFit:"cover",
                }} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Últimas Homenagens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {photoList.map((item, index) => (
            <Dialog key={index} onOpenChange={(open) => !open && setSelectedImage(null)}>
              <DialogTrigger asChild>
                <div
                  className="flex flex-col items-center group cursor-pointer"
                  onClick={() => setSelectedImage(item.image)} // Define a imagem clicada
                >
                  <div className="w-full h-96 relative overflow-hidden rounded-lg">
                    <div className="absolute bottom-0 left-0 p-4 z-20 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                      <h3 className="text-white text-xl font-semibold">
                        {item.name}
                      </h3>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70 z-10" />
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="transition-transform duration-300 ease-in-out transform hover:scale-110"
                      fill={true}
                      style={{
                        objectFit: "cover"
                      }} />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="w-[80vw] h-[80vh]" aria-describedby='Modal'>
                <DialogHeader>
                  <DialogTitle>{item.name}</DialogTitle>
                </DialogHeader>
                {selectedImage && (
                  <div className="relative w-full h-full">
                    <Image
                      src={selectedImage}
                      alt={item.name}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        objectFit: "contain"
                      }} />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </section>
    </div>
  );
}
