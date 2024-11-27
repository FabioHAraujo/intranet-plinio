'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

export default function CadastrarTempoEmpresa() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!nome || !descricao) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('descricao', descricao);
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      // Envia os dados ao PocketBase
      const record = await pb.collection('tempo_empresa').create(formData);

      alert('Registro criado com sucesso!');
      setNome('');
      setDescricao('');
      setThumbnail(null);
    } catch (error) {
      console.error('Erro ao criar registro:', error);
      alert('Erro ao criar registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Cadastrar Tempo de Empresa</h1>

      <div className="space-y-4">
        {/* Campo Nome */}
        <div>
          <Label htmlFor="nome" className="font-semibold">
            Nome:
          </Label>
          <Input
            id="nome"
            placeholder="Digite o nome..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-2"
          />
        </div>

        {/* Campo Descrição */}
        <div>
          <Label htmlFor="descricao" className="font-semibold">
            Descrição:
          </Label>
          <Textarea
            id="descricao"
            placeholder="Digite a descrição..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="mt-2"
          />
        </div>

        {/* Upload de Thumbnail */}
        <div>
          <Label htmlFor="thumbnail" className="font-semibold">
            Thumbnail (opcional):
          </Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
            className="mt-2"
          />
          {thumbnail && (
            <p className="mt-2 text-sm text-gray-500">
              Arquivo selecionado: {thumbnail.name}
            </p>
          )}
        </div>

        {/* Botão de Enviar */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full mt-4"
        >
          {isSubmitting ? 'Enviando...' : 'Cadastrar'}
        </Button>
      </div>
    </div>
  );
}
