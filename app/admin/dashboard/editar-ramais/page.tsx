"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import PocketBase from "pocketbase";

interface Ramal {
  id: string;
  nome: string;
  ramal: string;
  setor: string;
}

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");

export default function RamalList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ramais, setRamais] = useState<Ramal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRamal, setSelectedRamal] = useState<Ramal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Buscar dados dos ramais ao carregar o componente
  useEffect(() => {
    const fetchRamais = async () => {
      try {
        const records = await pb.collection("ramais").getFullList<Ramal>();
        setRamais(records);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar ramais:", error);
        setLoading(false);
      }
    };

    fetchRamais();
  }, []);

  const handleAddClick = () => {
    setSelectedRamal({ id: "", nome: "", ramal: "", setor: "" });
    setIsAdding(true);
    setIsDialogOpen(true);
  };

  const handleEditClick = (ramal: Ramal) => {
    setSelectedRamal(ramal);
    setIsAdding(false);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await pb.collection("ramais").delete(id);
      setRamais((prev) => prev.filter((ramal) => ramal.id !== id));
    } catch (error) {
      console.error("Erro ao apagar ramal:", error);
    }
  };

  const handleSave = async () => {
    if (!selectedRamal) return;
    try {
      if (isAdding) {
        // Adicionar novo ramal
        const newRamal = await pb.collection("ramais").create({
          nome: selectedRamal.nome,
          ramal: selectedRamal.ramal,
          setor: selectedRamal.setor,
        });
        setRamais((prev) => [...prev, newRamal]);
      } else {
        // Atualizar ramal existente
        const updatedRamal = await pb.collection("ramais").update(selectedRamal.id, {
          nome: selectedRamal.nome,
          ramal: selectedRamal.ramal,
          setor: selectedRamal.setor,
        });
        setRamais((prev) =>
          prev.map((ramal) => (ramal.id === updatedRamal.id ? updatedRamal : ramal))
        );
      }

      setIsDialogOpen(false);
      setSelectedRamal(null);
    } catch (error) {
      console.error("Erro ao salvar ramal:", error);
    }
  };

  const filteredRamais = Array.isArray(ramais)
    ? ramais.filter(
        (ramal) =>
          ramal.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ramal.ramal.toString().includes(searchTerm) ||
          ramal.setor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Lista de Ramais</h1>
      <div className="flex items-center justify-between">
        <Input
          type="search"
          placeholder="Pesquisar por nome, número ou setor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" onClick={handleAddClick}>
          Adicionar Ramal
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Ramal</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredRamais.length > 0 ? (
              filteredRamais.map((ramal) => (
                <TableRow key={ramal.id}>
                  <TableCell>{ramal.nome}</TableCell>
                  <TableCell>{ramal.ramal}</TableCell>
                  <TableCell>{ramal.setor}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(ramal)}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(ramal.id)}>
                      Apagar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum ramal encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog para adicionar/editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAdding ? "Adicionar Ramal" : "Editar Ramal"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label="Nome"
              placeholder="Nome"
              value={selectedRamal?.nome || ""}
              onChange={(e) =>
                setSelectedRamal((prev) => prev && { ...prev, nome: e.target.value })
              }
            />
            <Input
              label="Ramal"
              placeholder="Ramal"
              value={selectedRamal?.ramal || ""}
              onChange={(e) =>
                setSelectedRamal((prev) => prev && { ...prev, ramal: e.target.value })
              }
            />
            <Input
              label="Setor"
              placeholder="Setor"
              value={selectedRamal?.setor || ""}
              onChange={(e) =>
                setSelectedRamal((prev) => prev && { ...prev, setor: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
