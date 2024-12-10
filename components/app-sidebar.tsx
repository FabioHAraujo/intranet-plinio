"use client";

import React, { useEffect, useState } from "react";
import { PlusCircle, Edit3 } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");

const data = {
  teams: [
    {
      name: "Grupo Plínio Fleck",
      logo: Edit3,
      plan: "Administração",
    },
  ],
  navMain: [
    {
      title: "Editar",
      url: "#",
      icon: Edit3,
      items: [
        { title: "Ramais", url: "/admin/dashboard/editar-ramais" },
        { title: "3x4 Funcionários", url: "/admin/dashboard/3x4-funcionarios" },
        { title: "Tempo de Empresa", url: "/admin/dashboard/editar-anos-conosco" },
        { title: "Formandos", url: "/admin/dashboard/editar-formandos" },
        { title: "Cardápio", url: "/admin/dashboard/editar-cardapio" },
        { title: "Editar Notícias", url: "/admin/dashboard/editar-noticias" },
      ],
    },
    {
      title: "Adicionar",
      url: "#",
      icon: PlusCircle,
      items: [
        { title: "Cardápio", url: "/admin/dashboard/add-cardapio" },
        { title: "Notícia", url: "/admin/dashboard/add-noticia" },
        { title: "Tempo de Empresa", url: "/admin/dashboard/add-anos-conosco" },
        { title: "Formandos", url: "/admin/dashboard/add-formandos" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!pb.authStore.isValid) {
        console.error("Sessão inválida. Usuário não autenticado.");
        return;
      }

      try {
        const record = await pb
          .collection("usuarios_intranet")
          .getFirstListItem(`id="${pb.authStore.model?.id}"`, {
            fields: "username,email,avatar",
          });

        setUser({
          name: record.username,
          email: record.email,
          avatar: record.avatar
            ? `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${record.avatar}`
            : "/default-avatar.png",
        });
      } catch (error) {
        console.error("Erro ao buscar os dados do usuário:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser user={{ name: user.name, email: user.email, avatar: user.avatar }} />
        ) : (
          <p className="text-sm text-gray-500">Carregando usuário...</p>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
