'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

interface Funcionario {
  id: string;
  cracha: string;
  imagem: string;
}

export default function Funcionario3x4() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [filteredFuncionarios, setFilteredFuncionarios] = useState<Funcionario[]>([]);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCracha, setNewCracha] = useState('');
  const [newImagem, setNewImagem] = useState<File | null>(null);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const pocketBaseUrl = 'https://pocketbase.flecksteel.com.br/api/files';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const records = await pb.collection('3x4_funcionarios').getFullList<Funcionario>({
          sort: '-created',
        });
        setFuncionarios(records);
        setFilteredFuncionarios(records);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setFilteredFuncionarios(
      funcionarios.filter((f) => f.cracha.includes(value))
    );
  };

  const handleAddFuncionario = async () => {
    if (!newCracha || !newImagem) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('cracha', newCracha);
      formData.append('imagem', newImagem);

      const newRecord = await pb.collection('3x4_funcionarios').create(formData);
      setFuncionarios((prev) => [newRecord, ...prev]);
      setFilteredFuncionarios((prev) => [newRecord, ...prev]);
      alert('Funcionário adicionado com sucesso!');
      setIsAddDialogOpen(false);
      setNewCracha('');
      setNewImagem(null);
    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);
      alert('Erro ao adicionar funcionário.');
    }
  };

  const handleEditFuncionario = async () => {
    if (!selectedFuncionario) return;

    try {
      const { id, cracha } = selectedFuncionario;

      const formData = new FormData();
      formData.append('cracha', cracha);

      if (newImagem) {
        formData.append('imagem', newImagem);
      }

      const updatedRecord = await pb.collection('3x4_funcionarios').update(id, formData);
      setFuncionarios((prev) =>
        prev.map((f) => (f.id === updatedRecord.id ? updatedRecord : f))
      );
      setFilteredFuncionarios((prev) =>
        prev.map((f) => (f.id === updatedRecord.id ? updatedRecord : f))
      );
      alert('Funcionário atualizado com sucesso!');
      setIsDialogOpen(false);
      setSelectedFuncionario(null);
      setNewImagem(null);
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      alert('Erro ao atualizar funcionário.');
    }
  };

  const handleDeleteFuncionario = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;

    try {
      await pb.collection('3x4_funcionarios').delete(id);
      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
      setFilteredFuncionarios((prev) => prev.filter((f) => f.id !== id));
      alert('Funcionário excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      alert('Erro ao excluir funcionário.');
    }
  };

  return isLoading ? (
    <p>Carregando...</p>
  ) : (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-6">Fotos 3x4 de Funcionários</h1>
      <div className="flex justify-between items-center mb-6">
        <Input
          type="text"
          placeholder="Filtrar por crachá..."
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="default" onClick={() => setIsAddDialogOpen(true)}>
          Adicionar
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredFuncionarios.map((funcionario) => (
          <Card key={funcionario.id} className="relative overflow-hidden">
            <div className="relative aspect-[3/4]">
              <Image
                src={`${pocketBaseUrl}/3x4_funcionarios/${funcionario.id}/${funcionario.imagem}`}
                alt={`Foto 3x4 do crachá ${funcionario.cracha}`}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="p-2 text-center">
              <p className="text-sm font-semibold">Crachá: {funcionario.cracha}</p>
              <div className="mt-2 flex justify-around">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFuncionario(funcionario);
                    setIsDialogOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteFuncionario(funcionario.id)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Dialog para Adicionar */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Funcionário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="newCracha" className="block font-semibold">
                Crachá:
              </label>
              <Input
                id="newCracha"
                value={newCracha}
                onChange={(e) => setNewCracha(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <label htmlFor="newImagem" className="block font-semibold">
                Foto 3x4:
              </label>
              <Input
                id="newImagem"
                type="file"
                accept="image/*"
                onChange={(e) => setNewImagem(e.target.files?.[0] || null)}
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddFuncionario}>Adicionar</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
          </DialogHeader>
          {selectedFuncionario && (
            <div className="space-y-4">
              <div>
                <label htmlFor="editCracha" className="block font-semibold">
                  Crachá:
                </label>
                <Input
                  id="editCracha"
                  value={selectedFuncionario.cracha}
                  onChange={(e) =>
                    setSelectedFuncionario((prev) =>
                      prev ? { ...prev, cracha: e.target.value } : null
                    )
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <label htmlFor="editImagem" className="block font-semibold">
                  Alterar Foto 3x4:
                </label>
                <Input
                  id="editImagem"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImagem(e.target.files?.[0] || null)}
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditFuncionario}>Salvar</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
