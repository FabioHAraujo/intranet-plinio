"use client";

import { usePathname } from "next/navigation";
import LayoutPadrao from "@/app/components/LayoutPadrao/page";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Verifica se a rota começa com "/admin"
  const isExcluded = pathname.startsWith("/admin");

  return isExcluded ? <>{children}</> : <LayoutPadrao>{children}</LayoutPadrao>;
}
