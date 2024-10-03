'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
interface Ramal {
  id: number;
  nome: string;
  ramal: string;
  setor: string;
}

export default function RamalList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ramais, setRamais] = useState<Ramal[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar dados dos ramais ao carregar o componente
  useEffect(() => {
    const fetchRamais = async () => {
      try {
        const response = await fetch('/api/ramais');
        const data = await response.json();
        setRamais(data);  // Certifique-se de que 'data' seja um array
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar ramais:', error);
        setLoading(false);
      }
    };
  
    fetchRamais();
  }, []);

  const filteredRamals = Array.isArray(ramais) ? ramais.filter((ramal) =>
    ramal.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ramal.ramal.toString().includes(searchTerm) ||
    ramal.setor.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Lista de Ramais</h1>
      <Input
        type="search"
        placeholder="Pesquisar por nome, número ou setor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Ramal</TableHead>
              <TableHead>Setor</TableHead>
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
                  <TableCell>{ramal.nome}</TableCell>
                  <TableCell>{ramal.ramal}</TableCell>
                  <TableCell>{ramal.setor}</TableCell>
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
