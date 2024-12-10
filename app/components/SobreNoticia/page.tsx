'use client';

import React, { Suspense } from "react";
import SobreNoticiaContent from "@/components/personal/SobreNoticiaContent/page";

export default function SobreANoticia() {
  return (
    <Suspense fallback={<p className="text-center">Carregando...</p>}>
      <SobreNoticiaContent />
    </Suspense>
  );
}
