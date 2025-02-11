"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash } from "lucide-react";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");
pb.autoCancellation(false);

export default function ListaProcedimentos() {
  const [procedimentos, setProcedimentos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const procedimentos = await pb.collection("documentos").getFullList({ sort: "titulo" });
        const setores = await pb.collection("grupos").getFullList({ sort: "grupo_numero" });
        setProcedimentos(procedimentos.map(proc => ({
          ...proc,
          setorNome: setores.find(setor => setor.grupo_numero === proc.id_grupo)?.descricao || "Desconhecido"
        })));
        setSetores(setores);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este procedimento?")) {
      try {
        await pb.collection("documentos").delete(id);
        setProcedimentos(procedimentos.filter((proc) => proc.id !== id));
        alert("Procedimento excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir procedimento:", error);
        alert("Erro ao excluir o procedimento.");
      }
    }
  };

  const handleEdit = (proc) => {
    setEditData(proc);
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("titulo", editData.titulo);
      formData.append("id_grupo", editData.id_grupo);
      if (editData.pdf) formData.append("pdf", editData.pdf);

      await pb.collection("documentos").update(editData.id, formData);
      setProcedimentos((prev) => prev.map((p) => (p.id === editData.id ? { ...editData, setorNome: setores.find(setor => setor.grupo_numero === editData.id_grupo)?.descricao || "Desconhecido" } : p)));
      setEditData(null);
      alert("Procedimento atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar procedimento:", error);
      alert("Erro ao atualizar o procedimento.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Procedimentos Cadastrados</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {procedimentos.map((proc) => (
            <TableRow key={proc.id}>
              <TableCell>{proc.titulo}</TableCell>
              <TableCell>{proc.setorNome}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" onClick={() => handleEdit(proc)}>
                      <Pencil size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Procedimento</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Label>Título do Procedimento</Label>
                      <Input value={editData?.titulo || ""} onChange={(e) => setEditData({ ...editData, titulo: e.target.value })} />
                      <Label>Setor</Label>
                      <Select value={editData?.id_grupo || ""} onValueChange={(value) => setEditData({ ...editData, id_grupo: value })}>
                        <SelectTrigger>
                          <SelectValue>{setores.find(setor => setor.grupo_numero === editData?.id_grupo)?.descricao || "Selecione um setor"}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {setores.map((setor) => (
                            <SelectItem key={setor.grupo_numero} value={setor.grupo_numero}>
                              {setor.descricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Label>Alterar PDF</Label>
                      <Input type="file" accept=".pdf" onChange={(e) => setEditData({ ...editData, pdf: e.target.files?.[0] })} />
                      <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" onClick={() => handleDelete(proc.id)}>
                  <Trash size={16} className="text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
