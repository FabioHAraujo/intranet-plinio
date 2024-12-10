"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PocketBase from "pocketbase";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import Loading from "@/components/personal/Loading/page";

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!pb.authStore.isValid) {
          // Tenta validar a sessão
          await pb.collection("users").authRefresh();
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Sessão inválida ou expirada. Redirecionando para login.");
        pb.authStore.clear(); // Limpa a sessão
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            </header>
            <main className="flex-col gap-4 p-4 pt-0">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
