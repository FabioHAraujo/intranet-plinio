'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Ramal {
  id: number;
  nome: string;
  ramal: string;
}

// Função para normalizar string (remove acentos e converte para minúsculo)
function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function AgendaList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ramais, setRamais] = useState<Ramal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRamais = async () => {
      try {
        const response = await fetch('/api/agenda_reduzida');
        const data = await response.json();
        setRamais(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar agenda reduzida:', error);
        setLoading(false);
      }
    };

    fetchRamais();
  }, []);

  const filteredRamals = Array.isArray(ramais)
    ? ramais.filter((ramal) => {
        const termo = normalizar(searchTerm);
        return (
          normalizar(ramal.nome).includes(termo) ||
          ramal.ramal.toString().includes(searchTerm)
        );
      })
    : [];

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Agenda Reduzida</h1>
      <Input
        type="search"
        placeholder="Pesquisar por nome ou número..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ramal</TableHead>
              <TableHead>Nome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Carregando...</TableCell>
              </TableRow>
            ) : filteredRamals.length > 0 ? (
              filteredRamals.map((ramal) => (
                <TableRow key={ramal.id}>
                  <TableCell>*{ramal.ramal}</TableCell>
                  <TableCell>{ramal.nome}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Nenhum ramal encontrado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
