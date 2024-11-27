"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PocketBase from "pocketbase";
import Noticias from "@/app/components/Noticias/page";
import Loading from "@/components/personal/Loading/page";

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!pb.authStore.isValid) {
        router.push("/admin/login");
      } else {
        setIsLoading(false);
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
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Noticias />
    </div>
  );
}
