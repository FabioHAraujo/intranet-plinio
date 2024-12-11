"use client";

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
  const [recipient, setRecipient] = useState('allusers@flecksteel.com.br');
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
        'data-placeholder': 'Digite aqui...',
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

  const sendNotification = async (id: string) => {
    const payload = {
      recipient,
      subject: title,
      message: `Uma nova notícia foi postada: <br/><br/>Clique aqui: <a href='https://intranet.flecksteel.com.br/sobre-a-noticia?id=${id}'>link</a><br/><br/>Ou acesse: https://intranet.flecksteel.com.br/sobre-a-noticia?id=${id}`,
    };

    try {
      const response = await fetch('/api/envia_email_noticias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar notificação.');
      }

      console.log('Notificação enviada:', await response.json());
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
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

      const id = response.id;
      await sendNotification(id);

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
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da notícia"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

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

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Destinatário</label>
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="allusers@flecksteel.com.br">All Users</option>
            <option value="fabio-araujo@flecksteel.com.br">Fábio</option>
            <option value="angela-flores@flecksteel.com.br">Angela</option>
          </select>
        </div>

        <div>
          <Toolbar editor={editor} />
          <div className="border p-4 rounded-md shadow-sm">
            <EditorContent editor={editor} />
          </div>
        </div>

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
