'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

interface Homenagem {
  id: string;
  nome: string;
  descricao: string;
  thumbnail: string;
}

export default function AnosConosco() {
  const [homenagens, setHomenagens] = useState<Homenagem[]>([]);
  const [selectedHomenagem, setSelectedHomenagem] = useState<Homenagem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);

  const pocketBaseUrl = 'https://pocketbase.flecksteel.com.br/api/files';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const records = await pb.collection('formandos').getFullList<Homenagem>({ sort: '-created' });
        setHomenagens(records);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (homenagem: Homenagem) => {
    setSelectedHomenagem(homenagem);
    setNewThumbnail(null); // Limpa qualquer arquivo previamente carregado
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;

    try {
      await pb.collection('formandos').delete(id);
      setHomenagens((prev) => prev.filter((h) => h.id !== id));
      alert('Registro excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
      alert('Erro ao excluir registro.');
    }
  };

  const handleSave = async () => {
    if (!selectedHomenagem) return;

    try {
      const { id, nome, descricao } = selectedHomenagem;

      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('descricao', descricao);

      if (newThumbnail) {
        formData.append('thumbnail', newThumbnail);
      }

      const updatedRecord = await pb.collection('formandos').update(id, formData);
      setHomenagens((prev) =>
        prev.map((h) => (h.id === updatedRecord.id ? updatedRecord : h))
      );

      alert('Registro atualizado com sucesso!');
      setIsDialogOpen(false);
      setSelectedHomenagem(null);
      setNewThumbnail(null); // Limpa o estado do arquivo
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      alert('Erro ao atualizar registro.');
    }
  };

  return isLoading ? (
    <p>Carregando...</p>
  ) : (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10">Anos Conosco</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {homenagens.map((homenagem) => (
          <Card key={homenagem.id} className="relative overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image
                src={`${pocketBaseUrl}/formandos/${homenagem.id}/${homenagem.thumbnail}`}
                alt={homenagem.nome}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold">{homenagem.nome}</h2>
              <p className="text-sm text-gray-500">{homenagem.descricao}</p>
              <Badge className="mt-2">formandos</Badge>
              <div className="mt-4 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleEdit(homenagem)}>
                  Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(homenagem.id)}>
                  Excluir
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Dialog para edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Registro</DialogTitle>
          </DialogHeader>
          {selectedHomenagem && (
            <div className="space-y-4">
              <div>
                <label htmlFor="nome" className="block font-semibold">
                  Nome:
                </label>
                <Input
                  id="nome"
                  value={selectedHomenagem.nome}
                  onChange={(e) =>
                    setSelectedHomenagem((prev) =>
                      prev ? { ...prev, nome: e.target.value } : null
                    )
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <label htmlFor="descricao" className="block font-semibold">
                  Descrição:
                </label>
                <Textarea
                  id="descricao"
                  value={selectedHomenagem.descricao}
                  onChange={(e) =>
                    setSelectedHomenagem((prev) =>
                      prev ? { ...prev, descricao: e.target.value } : null
                    )
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <label htmlFor="thumbnail" className="block font-semibold">
                  Alterar Thumbnail:
                </label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewThumbnail(e.target.files?.[0] || null)}
                  className="mt-2"
                />
                {selectedHomenagem.thumbnail && (
                  <p className="mt-2 text-sm text-gray-500">
                    Atual: {selectedHomenagem.thumbnail}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>Salvar</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
