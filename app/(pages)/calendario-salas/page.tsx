import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";

const reunioes = [
  {
    day: new Date("2025-08-02"),
    events: [
      {
        id: 1,
        name: "Planejamento de Produção",
        time: "08:00",
        datetime: "2025-08-02T08:00",
      },
      {
        id: 2,
        name: "Sincronização de Equipe Industrial",
        time: "14:00",
        datetime: "2025-08-02T14:00",
      },
    ],
  },
  {
    day: new Date("2025-08-10"),
    events: [
      {
        id: 3,
        name: "Revisão de Lançamento de Produto",
        time: "09:00",
        datetime: "2025-08-10T09:00",
      },
      {
        id: 4,
        name: "Reunião de Marketing Industrial",
        time: "11:00",
        datetime: "2025-08-10T11:00",
      },
      {
        id: 5,
        name: "Reunião com Fornecedores",
        time: "16:00",
        datetime: "2025-08-10T16:00",
      },
    ],
  },
  {
    day: new Date("2025-08-18"),
    events: [
      {
        id: 6,
        name: "Workshop de Melhoria de Processos",
        time: "10:00",
        datetime: "2025-08-18T10:00",
      },
    ],
  },
  {
    day: new Date("2025-08-25"),
    events: [
      {
        id: 7,
        name: "Análise de Orçamento Industrial",
        time: "15:00",
        datetime: "2025-08-25T15:00",
      },
      {
        id: 8,
        name: "Planejamento de Sprint Produção",
        time: "09:00",
        datetime: "2025-08-25T09:00",
      },
      {
        id: 9,
        name: "Revisão de Projetos Industriais",
        time: "13:00",
        datetime: "2025-08-25T13:00",
      },
    ],
  },
  {
    day: new Date("2025-08-30"),
    events: [
      {
        id: 10,
        name: "Apresentação para Cliente Industrial",
        time: "10:00",
        datetime: "2025-08-30T10:00",
      },
      {
        id: 11,
        name: "Almoço de Equipe Produção",
        time: "12:30",
        datetime: "2025-08-30T12:30",
      },
      {
        id: 12,
        name: "Atualização de Status de Projeto",
        time: "14:00",
        datetime: "2025-08-30T14:00",
      },
    ],
  },
  // Setembro
  {
    day: new Date("2025-09-05"),
    events: [
      {
        id: 13,
        name: "Reunião de Segurança Industrial",
        time: "08:30",
        datetime: "2025-09-05T08:30",
      },
      {
        id: 14,
        name: "Auditoria de Processos",
        time: "15:00",
        datetime: "2025-09-05T15:00",
      },
    ],
  },
  {
    day: new Date("2025-09-12"),
    events: [
      {
        id: 15,
        name: "Treinamento de Operadores",
        time: "09:00",
        datetime: "2025-09-12T09:00",
      },
      {
        id: 16,
        name: "Reunião de Manutenção Preventiva",
        time: "14:00",
        datetime: "2025-09-12T14:00",
      },
    ],
  },
  {
    day: new Date("2025-09-20"),
    events: [
      {
        id: 17,
        name: "Reunião de Inovação Industrial",
        time: "10:00",
        datetime: "2025-09-20T10:00",
      },
      {
        id: 18,
        name: "Revisão de Indicadores de Produção",
        time: "16:00",
        datetime: "2025-09-20T16:00",
      },
    ],
  },
]

export default function CalendarioSalasPage() {
  return <FullScreenCalendar data={reunioes} />;
}