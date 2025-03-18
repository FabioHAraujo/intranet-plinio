"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import PocketBase from "pocketbase";

interface Contato {
  id: string;
  nome: string;
  ramal: string;
}

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");

export default function ContatoList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchContatos = async () => {
      try {
        const records = await pb.collection("agenda_reduzida").getFullList<Contato>();
        setContatos(records);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar contatos:", error);
        setLoading(false);
      }
    };

    fetchContatos();
  }, []);

  const handleAddClick = () => {
    setSelectedContato({ id: "", nome: "", ramal: "" });
    setIsAdding(true);
    setIsDialogOpen(true);
  };

  const handleEditClick = (contato: Contato) => {
    setSelectedContato(contato);
    setIsAdding(false);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await pb.collection("agenda_reduzida").delete(id);
      setContatos((prev) => prev.filter((contato) => contato.id !== id));
    } catch (error) {
      console.error("Erro ao apagar contato:", error);
    }
  };

  const handleSave = async () => {
    if (!selectedContato) return;
    try {
      if (isAdding) {
        const newContato = await pb.collection("agenda_reduzida").create({
          nome: selectedContato.nome,
          ramal: selectedContato.ramal,
        });
        setContatos((prev) => [...prev, newContato]);
      } else {
        const updatedContato = await pb.collection("agenda_reduzida").update(selectedContato.id, {
          nome: selectedContato.nome,
          ramal: selectedContato.ramal,
        });
        setContatos((prev) =>
          prev.map((contato) => (contato.id === updatedContato.id ? updatedContato : contato))
        );
      }

      setIsDialogOpen(false);
      setSelectedContato(null);
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
    }
  };

  const filteredContatos = contatos.filter(
    (contato) =>
      contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contato.ramal.toString().includes(searchTerm)
  );

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Agenda Reduzida</h1>
      <div className="flex items-center justify-between">
        <Input
          type="search"
          placeholder="Pesquisar por nome ou número..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" onClick={handleAddClick}>
          Adicionar Contato
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Ramal</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredContatos.length > 0 ? (
              filteredContatos.map((contato) => (
                <TableRow key={contato.id}>
                  <TableCell>{contato.nome}</TableCell>
                  <TableCell>{contato.ramal}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(contato)}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(contato.id)}>
                      Apagar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Nenhum contato encontrado.
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
            <DialogTitle>{isAdding ? "Adicionar Contato" : "Editar Contato"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label="Nome"
              placeholder="Nome"
              value={selectedContato?.nome || ""}
              onChange={(e) =>
                setSelectedContato((prev) => prev && { ...prev, nome: e.target.value })
              }
            />
            <Input
              label="Ramal"
              placeholder="Ramal"
              value={selectedContato?.ramal || ""}
              onChange={(e) =>
                setSelectedContato((prev) => prev && { ...prev, ramal: e.target.value })
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
