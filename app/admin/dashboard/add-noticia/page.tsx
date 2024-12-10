'use client';

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Toolbar from './Toolbar';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

const Editor = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [content, setContent] = useState('');
  const [banner, setBanner] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const availableTags = [
    'Anúncios',
    'Eventos Internos',
    'Treinamentos',
    'Novos Colaboradores',
    'Reconhecimentos',
    'Resultados Financeiros',
    'Datas Comemorativas',
    'Natal',
    'Ano Novo',
    'Festas de Fim de Ano',
    'Campanhas Internas',
    'RH',
    'Políticas Internas',
    'Benefícios',
    'Saúde e Bem-Estar',
    'Segurança do Trabalho',
    'Inovações',
    'Projetos Internos',
    'Promoções de Colaboradores',
    'Metas',
    'Conquistas da Empresa',
    'Parcerias',
    'Sustentabilidade',
    'Engajamento',
    'Destaques do Mês',
    'Mudanças Estruturais',
    'Feedbacks e Pesquisas',
    'Comemorações',
    'Lançamentos de Produtos',
    'Ações Sociais',
    'Diversidade e Inclusão',
    'Treinamentos e Cursos',
    'Equipe em Destaque',
    'Boletim Informativo'
  ];

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: '',
    editorProps: {
      attributes: {
        class:
          'ProseMirror flex flex-col px-4 py-3 justify-start border border-gray-400 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-md outline-none',
        'data-placeholder': 'Digite aqui...', // Adiciona placeholder
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleAddTag = () => {
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags((prev) => [...prev, selectedTag]);
      setSelectedTag('');
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setBanner(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('O título é obrigatório.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('titulo', title);
      formData.append('texto', content);
      formData.append('tags', JSON.stringify({ tags }));

      if (banner) {
        formData.append('banner', banner);
      }

      const response = await pb.collection('noticias').create(formData);
      console.log('Notícia criada:', response);

      alert('Notícia criada com sucesso!');
      setTitle('');
      setTags([]);
      setContent('');
      setBanner(null);
      editor?.commands.setContent('');
    } catch (error) {
      console.error('Erro ao criar notícia:', error);
      alert('Erro ao criar a notícia.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Criar Notícia</h1>
      <div className="space-y-4">
        {/* Campo para o título */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da notícia"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        {/* Botão para adicionar banner */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="banner"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300"
          >
            {banner ? 'Alterar Banner' : 'Adicionar Banner'}
          </label>
          <input
            type="file"
            id="banner"
            onChange={handleBannerChange}
            className="hidden"
            accept="image/*"
          />
          {banner && <span className="text-sm text-gray-500">{banner.name}</span>}
        </div>

        {/* Dropdown para adicionar tags */}
        <div className="flex gap-4 items-center">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="" disabled>
              Selecione uma tag
            </option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600"
          >
            Adicionar Tag
          </button>
        </div>

        {/* Exibição das tags selecionadas */}
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Editor de texto */}
        <div>
          <Toolbar editor={editor} />
          <div className="border p-4 rounded-md shadow-sm">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Botão de envio */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full px-4 py-2 rounded-md ${
            loading
              ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
              : 'bg-sky-500 text-white hover:bg-sky-600'
          }`}
        >
          {loading ? 'Salvando...' : 'Salvar Notícia'}
        </button>
      </div>
    </div>
  );
};

export default Editor;
