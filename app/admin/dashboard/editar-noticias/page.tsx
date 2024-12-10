'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Toolbar from "./Toolbar";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");

type Noticia = {
  id: string;
  titulo: string;
  imagemUrl: string;
  dataPublicacao: string;
  tags: string[];
  texto: string;
};

const placeholderImage = "/placeholder.jpg"; // Caminho para uma imagem local placeholder.

export default function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editBanner, setEditBanner] = useState<File | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "",
    editorProps: {
      attributes: {
        class:
          "ProseMirror flex flex-col px-4 py-3 justify-start border border-gray-400 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-md outline-none",
        "data-placeholder": "Digite o texto da notícia...",
      },
    },
  });

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await pb.collection("noticias").getList(1, 50);
        const mappedNoticias = response.items.map((item: any) => ({
          id: item.id,
          titulo: item.titulo,
          imagemUrl: item.banner
            ? `https://pocketbase.flecksteel.com.br/api/files/${item.collectionId}/${item.id}/${item.banner}`
            : placeholderImage,
          dataPublicacao: item.created,
          tags: item.tags?.tags || [],
          texto: item.texto,
        }));
        setNoticias(mappedNoticias);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  const handleEditClick = (noticia: Noticia) => {
    setSelectedNoticia(noticia);
    setEditTitle(noticia.titulo);
    setEditTags(noticia.tags);
    editor?.commands.setContent(noticia.texto);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedNoticia) return;

    try {
      const formData = new FormData();
      formData.append("titulo", editTitle);
      formData.append("texto", editor?.getHTML() || "");
      formData.append("tags", JSON.stringify({ tags: editTags }));

      if (editBanner) {
        formData.append("banner", editBanner);
      }

      await pb.collection("noticias").update(selectedNoticia.id, formData);

      setNoticias((prev) =>
        prev.map((n) =>
          n.id === selectedNoticia.id
            ? { ...n, titulo: editTitle, texto: editor?.getHTML() || "", tags: editTags }
            : n
        )
      );

      alert("Notícia atualizada com sucesso!");
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar notícia:", error);
      alert("Erro ao atualizar notícia.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await pb.collection("noticias").delete(id);
      setNoticias((prev) => prev.filter((noticia) => noticia.id !== id));
      alert("Notícia excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir notícia:", error);
      alert("Erro ao excluir notícia.");
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Gerenciar Notícias</h1>
      {loading ? (
        <p className="text-center">Carregando notícias...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <Card key={noticia.id} className="overflow-hidden">
              <Image
                src={noticia.imagemUrl}
                width={640}
                height={310}
                alt={`Banner para ${noticia.titulo}`}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle className="text-xl">{noticia.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Badge className="mr-2">{formatDate(noticia.dataPublicacao)}</Badge>
                  {noticia.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => handleEditClick(noticia)}
                    className="bg-blue-500 text-white"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(noticia.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para Edição */}
      {selectedNoticia && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Notícia</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Título"
                className="w-full border px-4 py-2 rounded"
              />
              <Toolbar editor={editor} />
              <EditorContent editor={editor} />
            </div>
            <DialogFooter>
              <Button onClick={handleSaveEdit}>Salvar</Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
