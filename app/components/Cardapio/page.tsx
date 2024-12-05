'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PocketBase from "pocketbase";

interface MenuData {
  id: string;
  date: string; // Data do cardápio
  main: string; // Almoço Normal
  special: string; // Almoço Especial
}

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");

const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

// Função para formatar texto com negrito e quebras de linha
function formatText(text: string) {
  const cleanText = text.replace(/\\n/g, '\n'); // Substitui o \n literal por quebra de linha real
  const parts = cleanText.split(/(\*[^*]+\*)/).filter(Boolean); // Divide o texto com base nos asteriscos
  return parts.map((part, index) => {
    if (part === '\n') {
      return <br key={index} />; // Renderiza quebra de linha
    } else if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <strong key={index}>{part.slice(1, -1)}</strong> // Remove os asteriscos e aplica <strong>
      );
    }
    return <span key={index}>{part}</span>; // Texto normal
  });
}

export default function Cardapio() {
  const [menuData, setMenuData] = useState<MenuData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const today = new Date();
        const records = await pb.collection("cardapios").getFullList<MenuData>({
          filter: `date >= "${today.toISOString().split("T")[0]}"`,
          sort: "date", // Ordenar pela data
        });
        setMenuData(records);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar cardápio:", error);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="container p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Cardápio da Semana</h1>
      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {menuData.map((day) => {
            const dayDate = new Date(day.date);
            const dayName = weekDays[dayDate.getDay()];

            return (
              <Card key={day.id}>
                <CardHeader>
                  <CardTitle className="text-center">
                    {dayName} - {dayDate.toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold">Almoço Normal:</p>
                    {/* Formata texto do almoço normal */}
                    <div className="whitespace-pre-wrap text-sm">{formatText(day.main)}</div>
                    <Separator className="my-4" />
                    <p className="font-semibold text-primary">Almoço Especial:</p>
                    {/* Formata texto do almoço especial */}
                    <div className="whitespace-pre-wrap text-sm">{formatText(day.special)}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
