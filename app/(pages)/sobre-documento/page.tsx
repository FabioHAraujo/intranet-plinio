'use client';

import React, { useEffect, useState, Suspense } from "react";

const PdfViewer = React.lazy(() => import('@/app/components/LeitorPdf/page'));

export default function SobreDocumentoPage() {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    // Garante que o código só será executado no lado do cliente
    const searchParams = new URLSearchParams(window.location.search);
    const documentId = searchParams.get("id");
    setId(documentId);
  }, []);

  if (!id) {
    return <p>Carregando documento...</p>;
  }

  return (
    <Suspense fallback={<p>Carregando documento...</p>}>
      <PdfViewer id={id} />
    </Suspense>
  );
}
