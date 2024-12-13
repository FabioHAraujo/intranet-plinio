'use client';

import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@radix-ui/react-accordion';
import PocketBase from 'pocketbase';
import { useRouter } from 'next/navigation';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');
pb.autoCancellation(false);

export default function PaginaDocumentos() {
  const [groups, setGroups] = useState<{ grupo_numero: string; descricao: string }[]>([]);
  const [documents, setDocuments] = useState<{ id: string; titulo: string; id_grupo: string }[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchGroupsAndDocuments = async () => {
      try {
        // Fetch groups
        const groupRecords = await pb.collection('grupos').getFullList({
          fields: 'grupo_numero,descricao',
          sort: 'grupo_numero',
        });

        // Fetch documents
        const documentRecords = await pb.collection('documentos').getFullList({
          fields: 'id,titulo,id_grupo',
        });

        setGroups(groupRecords);
        setDocuments(documentRecords);
      } catch (error) {
        console.error('Erro ao buscar grupos ou documentos:', error);
      }
    };

    fetchGroupsAndDocuments();
  }, []);

  const filteredGroups = groups.map((group) => ({
    ...group,
    documents: documents.filter(
      (doc) =>
        doc.id_grupo === group.grupo_numero &&
        (doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
  }));

  const handleDocumentClick = (docId: string) => {
    router.push(`/sobre-documento?id=${docId}`);
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10">Documentos por Grupos</h1>

      {/* Barra de pesquisa */}
      <input
        type="text"
        placeholder="Buscar por título ou grupo"
        className="block w-full px-4 py-2 mb-6 border rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Accordion */}
      <Accordion type="multiple" className="w-full">
        {filteredGroups.map(
          (group) =>
            group.documents.length > 0 && (
              <AccordionItem key={group.grupo_numero} value={group.grupo_numero}>
                <AccordionTrigger className="font-medium text-lg py-2">
                  {group.descricao}
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                  <ul>
                    {group.documents.map((doc) => (
                      <li key={doc.id} className="mb-2">
                        <button
                          onClick={() => handleDocumentClick(doc.id)}
                          className="text-blue-600 hover:underline"
                        >
                          {doc.titulo}
                        </button>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )
        )}
      </Accordion>
    </div>
  );
}
