'use client';

import React, { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

export default function PdfViewer({ id }: { id: string }) {
  const toolbarPluginInstance = toolbarPlugin();
  // const toolbarSlot = toolbarPluginInstance.Toolbar();

  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const record = await pb.collection('documentos').getFirstListItem(`id='${id}'`, {
          fields: 'id,pdf',
        });
        setSelectedPdf(`https://pocketbase.flecksteel.com.br/api/files/documentos/${record.id}/${record.pdf}`);
      } catch (error) {
        console.error('Erro ao buscar o PDF:', error);
      }
    };

    if (id) fetchPdf();
  }, [id]);

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10">Visualizador de PDF</h1>

      {/* Toolbar personalizada */}
      {/* <div className="mb-4 border rounded-md p-2 bg-gray-100">
        <toolbarSlot>
          {(props) => {
            const { Download, DownloadMenuItem, ...rest } = props; // Remove botões de download
            return (
              <div className="flex gap-2">
                {Object.values(rest).map((ToolbarItem, index) => (
                  <ToolbarItem key={index} />
                ))}
              </div>
            );
          }}
        </toolbarSlot>
      </div> */}

      {/* PDF Viewer */}
      <div className="viewer border rounded-md p-4 bg-gray-50">
        {selectedPdf ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
            <Viewer fileUrl={selectedPdf} plugins={[toolbarPluginInstance]} />
          </Worker>
        ) : (
          <p className="text-gray-500">Carregando PDF...</p>
        )}
      </div>
    </div>
  );
}
