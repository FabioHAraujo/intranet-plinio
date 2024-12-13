'use client';

import React, { useEffect, useState } from 'react';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

export default function PdfViewer({ id }: { id: string }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  // Fetch the PDF URL based on the provided ID
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
      <div className="viewer border rounded-md p-4 bg-gray-50">
        {selectedPdf ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
            <Viewer fileUrl={selectedPdf} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        ) : (
          <p className="text-gray-500">Carregando PDF...</p>
        )}
      </div>
    </div>
  );
}
