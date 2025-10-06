'use client';

import { useState, useEffect } from 'react';
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";
import PocketBase from "pocketbase";
import { isSameDay } from "date-fns";

const pb = new PocketBase("https://pocketbase.flecksteel.com.br");

interface Agendamento {
  id: string;
  sala: string;
  titulo: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  criador_email: string;
  participantes: string[];
  expand?: {
    sala: {
      id: string;
      nome: string;
    };
  };
}

interface Sala {
  id: string;
  nome: string;
}

export default function CalendarioSalasPage() {
  const [reunioes, setReunioes] = useState<any[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Buscar salas
      const salasData = await pb.collection('salas_reuniao').getFullList<Sala>({
        sort: 'nome',
      });
      setSalas(salasData);

      // Buscar agendamentos do mês atual
      const hoje = new Date();
      const mes = hoje.getMonth() + 1;
      const ano = hoje.getFullYear();
      
      const agendamentos = await pb.collection('agendamento_salas_reuniao').getFullList<Agendamento>({
        expand: 'sala',
        sort: 'data,hora_inicio',
      });

      // Transformar dados para o formato do calendário
      const reunioesAgrupadas: Record<string, any[]> = {};
      
      agendamentos.forEach((agendamento) => {
        const data = agendamento.data;
        if (!reunioesAgrupadas[data]) {
          reunioesAgrupadas[data] = [];
        }
        
        reunioesAgrupadas[data].push({
          id: agendamento.id,
          titulo: agendamento.titulo,
          hora_inicio: agendamento.hora_inicio,
          hora_fim: agendamento.hora_fim,
          sala: agendamento.sala,
          sala_nome: agendamento.expand?.sala?.nome || '',
          criador_email: agendamento.criador_email,
          participantes: agendamento.participantes || [],
        });
      });

      // Converter para formato do calendário
      const reunioesFormatadas = Object.entries(reunioesAgrupadas).map(([data, events]) => ({
        day: new Date(data + 'T00:00:00'),
        events,
      }));

      setReunioes(reunioesFormatadas);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando calendário...</p>
      </div>
    );
  }

  return <FullScreenCalendar data={reunioes} salas={salas} onReload={fetchData} />;
}
