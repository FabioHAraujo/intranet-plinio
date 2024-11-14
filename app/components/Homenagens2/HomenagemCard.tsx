'use client'

import { FC, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface HomenagemCardProps {
  image: string;
  name: string;
  subtitle: string;
  badgeText: string;
}

const HomenagemCard: FC<HomenagemCardProps> = ({ image, name, subtitle, badgeText }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Card de Homenagem */}
      <div
        onClick={() => setIsOpen(true)}
        className="relative w-full h-72 overflow-hidden rounded-lg shadow-lg cursor-pointer"
      >
        {/* Imagem de Fundo */}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center"
        />

        {/* Sobreposição com degradê */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent h-2/3" />

        {/* Conteúdo da Homenagem */}
        <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
          <Badge variant="primary">{badgeText}</Badge>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-gray-200">{subtitle}</p>
        </div>
      </div>

      {/* Dialog de Imagem Ampliada */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[80vw] max-h-[80vh] bg-white p-4 rounded-lg shadow-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </DialogHeader>
          <img src={image} alt={name} className="w-full h-full object-contain mt-4" />
          <DialogFooter>
            <DialogClose asChild>
              <button onClick={() => setIsOpen(false)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                Fechar
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HomenagemCard;
