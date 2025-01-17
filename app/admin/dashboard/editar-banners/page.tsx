"use client";

import { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import Image from "next/image";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");

export default function DashboardPage() {
  const [carouselData, setCarouselData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const data = await pb.collection("carrocel").getList(1, 50, {
          filter: "ativo = true",
          sort: "-updated",
        });
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

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="p-0 rounded-lg">
      <section className="w-full h-5/6 rounded-lg px-4">
        <Carousel className="w-full h-full flex rounded-lg" setApi={setApi}>
          <CarouselContent className="rounded-lg space-x-2">
            {carouselData.map((slide, index) => (
              <CarouselItem
                key={slide.id}
                className="!flex !flex-row items-center h-auto relative rounded-lg"
                onClick={() => {
                  setCurrentSlide(index);
                  setIsModalOpen(true);
                }}
              >
                <div className="absolute left-0 top-0 h-full flex px-4">
                  <div className="bg-green-300 w-2 rounded-l-lg"></div>
                  <div className="bg-yellow-300 w-2"></div>
                  <div className="bg-red-500 w-2"></div>
                  <div className="bg-gray-400 w-2"></div>
                </div>
                <div className="w-2/4 p-6 ml-4 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
                  <p className="text-lg text-justify">{slide.description}</p>
                </div>
                <div className="w-2/4 relative h-full aspect-[16/9]">
                  <Image
                    src={slide.imageUrl}
                    alt={`Slide image ${index + 1}`}
                    fill={true}
                    className="object-cover rounded-xl"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-4 z-10 bg-background/50 hover:bg-background/75 rounded-full p-2 text-foreground transition-colors" />
          <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-4 z-10 bg-background/50 hover:bg-background/75 rounded-full p-2 text-foreground transition-colors" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {carouselData.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  current === index ? "bg-blue-500" : "bg-gray-500/50 hover:bg-green-400/75"
                }`}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
        </Carousel>
      </section>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Banner</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carouselData.length > 0 ? (
              carouselData.map((slide) => (
                <TableRow key={slide.id}>
                  <TableCell>{slide.title}</TableCell>
                  <TableCell>{slide.description}</TableCell>
                  <TableCell><div className="w-32 relative aspect-[16/9]">
                    <Image
                      src={slide.imageUrl}
                      alt={`${slide.title}`}
                      fill={true} // Usa o modo de preenchimento
                      className="object-cover ronded-sm"
                    />
                  </div></TableCell>
                  <TableCell className="flex flex-row text-right space-x-2 ">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(slide)}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(slide.id)}>
                      Apagar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum banner encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="p-0 rounded-lg w-full max-w-4xl h-auto"
          style={{ maxHeight: "90vh" }}
        >
          <div className="relative w-full h-full">
            {carouselData[currentSlide] && (
              <div className="relative h-[80vh] w-full">
                <Image
                  src={carouselData[currentSlide].imageUrl}
                  alt={carouselData[currentSlide].title}
                  fill={true}
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

function ChevronLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
