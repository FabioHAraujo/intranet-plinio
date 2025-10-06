"use client";

import { useEffect, useState, useRef } from "react";
import PocketBase from "pocketbase";
import Image from "next/image";
import { X, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  banner: string;
  ordem?: number;
}

export default function DashboardPage() {
  const [carouselData, setCarouselData] = useState<Banner[]>([]);
  const [allBanners, setAllBanners] = useState<Banner[]>([]);
  const [showInactive, setShowInactive] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        // Buscar apenas ativos para o carousel
        const activeRecords = await pb
          .collection("carrocel")
          .getFullList({
            filter: "ativo = true",
            sort: "ordem,-updated",
          });

        const activeData = activeRecords.map((item: any) => ({
          id: item.id,
          title: item.titulo,
          description: item.descricao,
          imageUrl: `${pb.baseUrl}/api/files/carrocel/${item.id}/${item.banner}`,
          banner: item.banner,
          ordem: item.ordem || 0,
          ativo: item.ativo,
        }));

        setCarouselData(activeData);

        // Buscar todos os banners (ativos e inativos) para a tabela
        const allRecords = await pb
          .collection("carrocel")
          .getFullList({
            sort: "ordem,-updated",
          });

        const allData = allRecords.map((item: any) => ({
          id: item.id,
          title: item.titulo,
          description: item.descricao,
          imageUrl: `${pb.baseUrl}/api/files/carrocel/${item.id}/${item.banner}`,
          banner: item.banner,
          ordem: item.ordem || 0,
          ativo: item.ativo,
        }));

        setAllBanners(allData);
      } catch (error) {
        console.error("Erro ao buscar carrossel:", error);
      }
    };

    fetchCarousel();
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

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newData = [...carouselData];
    const draggedBanner = newData[draggedItem];
    
    newData.splice(draggedItem, 1);
    newData.splice(index, 0, draggedBanner);
    
    setCarouselData(newData);
    setDraggedItem(index);
  };

  const handleDragEnd = async () => {
    if (draggedItem === null) return;

    try {
      const updates = carouselData.map((banner, index) => 
        pb.collection("carrocel").update(banner.id, { ordem: index })
      );
      
      await Promise.all(updates);
      console.log("Ordem atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar ordem:", error);
    }
    
    setDraggedItem(null);
  };

  const handleEditClick = (banner: Banner) => {
    setEditingBanner(banner);
    setEditTitle(banner.title);
    setEditDescription(banner.description);
    setEditImage(null);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBanner) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("titulo", editTitle);
      formData.append("descricao", editDescription);
      
      if (editImage) {
        formData.append("banner", editImage);
      }

      await pb.collection("carrocel").update(editingBanner.id, formData);
      
      setIsEditModalOpen(false);
      setEditingBanner(null);
      
      // Recarregar dados
      const records = await pb.collection("carrocel").getFullList({
        filter: "ativo = true",
        sort: "ordem,-updated",
      });

      const formattedData = records.map((item: any) => ({
        id: item.id,
        title: item.titulo,
        description: item.descricao,
        imageUrl: `${pb.baseUrl}/api/files/carrocel/${item.id}/${item.banner}`,
        banner: item.banner,
        ordem: item.ordem || 0,
      }));

      setCarouselData(formattedData);
    } catch (error) {
      console.error("Erro ao atualizar banner:", error);
      alert("Erro ao atualizar banner!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este banner?")) return;

    try {
      await pb.collection("carrocel").delete(id);
      setCarouselData(prev => prev.filter(b => b.id !== id));
      alert("Banner excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir banner:", error);
      alert("Erro ao excluir banner!");
    }
  };

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
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Gerenciar Banners</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Banner</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carouselData.length > 0 ? (
              carouselData.map((slide, index) => (
                <TableRow 
                  key={slide.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-move ${draggedItem === index ? 'opacity-50' : ''}`}
                >
                  <TableCell>
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </TableCell>
                  <TableCell>{slide.title}</TableCell>
                  <TableCell>{slide.description}</TableCell>
                  <TableCell>
                    <div className="w-32 relative aspect-[16/9]">
                      <Image
                        src={slide.imageUrl}
                        alt={`${slide.title}`}
                        fill={true}
                        className="object-cover rounded-sm"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditClick(slide)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteClick(slide.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Apagar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum banner encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de visualização */}
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

      {/* Modal de edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Banner</DialogTitle>
            <DialogDescription>
              Atualize as informações do banner abaixo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Digite o título do banner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Digite a descrição do banner"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Banner (imagem)</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setEditImage(file);
                }}
              />
              {editImage && (
                <p className="text-sm text-muted-foreground">
                  Arquivo selecionado: {editImage.name}
                </p>
              )}
            </div>

            {editingBanner && (
              <div className="space-y-2">
                <Label>Preview Atual</Label>
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                  <Image
                    src={editingBanner.imageUrl}
                    alt={editingBanner.title}
                    fill={true}
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingBanner(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
