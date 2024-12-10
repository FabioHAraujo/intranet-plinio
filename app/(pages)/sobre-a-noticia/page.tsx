import React, { Suspense } from "react";

const SobreNoticia = React.lazy(() => import("@/app/components/SobreNoticia/page"));

export default function NoticiasPage() {
  return (
    <Suspense fallback={<p>Carregando notícia...</p>}>
      <SobreNoticia />
    </Suspense>
  );
}
