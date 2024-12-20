"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");
pb.autoCancellation(false); // Desativa o cancelamento automático

export default function CadastroProcedimentos() {
  const [setores, setSetores] = useState([]); // Lista de setores
  const [setorSelecionado, setSetorSelecionado] = useState(""); // Setor selecionado
  const [novoSetor, setNovoSetor] = useState(""); // Novo setor a ser adicionado
  const [titulo, setTitulo] = useState(""); // Título do procedimento
  const [arquivo, setArquivo] = useState<File | null>(null); // Arquivo PDF

  // Carregar setores da tabela "grupos"
  useEffect(() => {
    async function fetchSetores() {
      try {
        const records = await pb.collection("grupos").getFullList({ sort: "grupo_numero" });
        setSetores(records);
      } catch (error) {
        console.error("Erro ao carregar setores:", error);
      }
    }
    fetchSetores();
  }, []);

  // Adicionar novo setor na tabela "grupos"
  const handleAddSetor = async () => {
    if (!novoSetor) {
      alert("Digite um nome para o novo setor.");
      return;
    }

    try {
      // Busca todos os registros da tabela "grupos"
      const grupos = await pb.collection("grupos").getFullList();

      // Calcula o maior valor de grupo_numero (considerando que pode ser string)
      const maxGrupoNumero = grupos.reduce((max, grupo) => {
        const numero = parseInt(grupo.grupo_numero || "0", 10);
        return numero > max ? numero : max;
      }, 0);

      // Incrementa o maior valor para o próximo número
      const nextGrupoNumero = maxGrupoNumero + 1;

      console.log(nextGrupoNumero);

      // Criar novo setor
      const newSetor = await pb.collection("grupos").create({
        descricao: novoSetor,
        grupo_numero: nextGrupoNumero.toString(),
      });

      // Atualizar a lista de setores
      setSetores((prevSetores) => [...prevSetores, newSetor]);
      setSetorSelecionado(newSetor.grupo_numero); // Seleciona automaticamente o novo setor
      setNovoSetor("");
      alert("Setor adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar setor:", error);
      alert("Erro ao adicionar o setor.");
    }
  };

  // Cadastrar o documento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!setorSelecionado) {
      alert("Selecione um setor.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id_grupo", setorSelecionado); // ID do grupo/setor
      formData.append("titulo", titulo); // Título do procedimento
      if (arquivo) formData.append("pdf", arquivo); // Arquivo PDF

      await pb.collection("documentos").create(formData);

      // Resetar o formulário
      // setSetorSelecionado("");
      setTitulo("");
      setArquivo(null);

      alert("Procedimento cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar procedimento:", error);
      alert("Erro ao cadastrar o procedimento.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold text-center mb-6">Cadastro de Procedimentos</h2>

      <div className="space-y-4">
        <Label>Setor de Procedimentos</Label>
        <Select onValueChange={(value) => setSetorSelecionado(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um setor" />
          </SelectTrigger>
          <SelectContent>
            {setores.map((setor) => (
              <SelectItem key={setor.grupo_numero} value={setor.grupo_numero}>
                {setor.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              Adicionar Novo Setor
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <Label htmlFor="novoSetor">Novo Setor</Label>
              <Input
                id="novoSetor"
                value={novoSetor}
                onChange={(e) => setNovoSetor(e.target.value)}
                placeholder="Digite o nome do novo setor"
              />
              <Button onClick={handleAddSetor}>Salvar</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <Label htmlFor="titulo">Título do Procedimento</Label>
        <Input
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Digite o título do procedimento"
          required
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="arquivo">Arquivo PDF</Label>
        <Input
          id="arquivo"
          type="file"
          accept=".pdf"
          onChange={(e) => setArquivo(e.target.files?.[0] || null)}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Cadastrar Procedimento
      </Button>
    </form>
  );
}
