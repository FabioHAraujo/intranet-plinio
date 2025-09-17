"use client"

import * as React from "react"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { Dialog } from "@/components/ui/dialog"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  SearchIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Event {
  id: number
  name: string
  time: string
  datetime: string
  sala: string
}

interface CalendarData {
  day: Date
  events: Event[]
}

interface FullScreenCalendarProps {
  data: CalendarData[]
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
]

export function FullScreenCalendar({ data }: FullScreenCalendarProps) {
  // Salas disponíveis
  const salas = ["RH - Reuniões", "Auditório"]
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = React.useState(today)
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "yyyy-MM", { locale: ptBR }),
  )
  const [modalOpen, setModalOpen] = React.useState(false)
  const [modalNovaOpen, setModalNovaOpen] = React.useState(false)
  const [novaSala, setNovaSala] = React.useState(salas[0])
  const [novaNome, setNovaNome] = React.useState("")
  const [novaHora, setNovaHora] = React.useState("")
  const [novaHoraFim, setNovaHoraFim] = React.useState("")
  const [novaData, setNovaData] = React.useState<Date | null>(selectedDay)
  const [openDatePicker, setOpenDatePicker] = React.useState(false)
  const firstDayCurrentMonth = React.useMemo(() => {
    const [year, month] = currentMonth.split("-").map(Number)
    return new Date(year, month - 1, 1)
  }, [currentMonth])
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { locale: ptBR }),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { locale: ptBR }),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, "yyyy-MM"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "yyyy-MM"))
  }

  function goToToday() {
    setCurrentMonth(format(today, "yyyy-MM"))
  }

  // Estado local para reuniões
  const [reunioes, setReunioes] = React.useState<CalendarData[]>([])
  React.useEffect(() => {
    let base: CalendarData[] = Array.isArray(data) ? JSON.parse(JSON.stringify(data)) : []
    if (typeof document !== 'undefined') {
      const cookie = document.cookie.split('; ').find(row => row.startsWith('reunioes='))
      if (cookie) {
        try {
          const reunioesCookie = JSON.parse(decodeURIComponent(cookie.split('=')[1]))
          if (Array.isArray(reunioesCookie)) {
            reunioesCookie.forEach((r: any) => {
              const idx = base.findIndex((d: CalendarData) => isSameDay(new Date(d.day), new Date(r.day)))
              if (idx >= 0) {
                base[idx].events.push({...r, day: undefined})
              } else {
                base.push({ day: new Date(r.day), events: [{...r, day: undefined}] })
              }
            })
          }
        } catch {}
      }
    }
    setReunioes(base)
  }, [data])

  // ...restante do componente...

  React.useEffect(() => {
    let base: CalendarData[] = Array.isArray(data) ? JSON.parse(JSON.stringify(data)) : []
    if (typeof document !== 'undefined') {
      const cookie = document.cookie.split('; ').find(row => row.startsWith('reunioes='))
      if (cookie) {
        try {
          const reunioesCookie = JSON.parse(decodeURIComponent(cookie.split('=')[1]))
          if (Array.isArray(reunioesCookie)) {
            reunioesCookie.forEach((r: any) => {
              const idx = base.findIndex((d: CalendarData) => isSameDay(new Date(d.day), new Date(r.day)))
              if (idx >= 0) {
                base[idx].events.push({...r, day: undefined})
              } else {
                base.push({ day: new Date(r.day), events: [{...r, day: undefined}] })
              }
            })
          }
        } catch {}
      }
    }
    setReunioes(base)
  }, [data])

  const eventosDoDia = (reunioes ?? []).filter((date: CalendarData) => isSameDay(date.day, selectedDay)).flatMap((date: CalendarData) => date.events)
  // Horários ocupados por sala
  const horariosOcupados: Record<string, string[]> = {};
  salas.forEach(sala => {
    horariosOcupados[sala] = eventosDoDia.filter(ev => ev.sala === sala).map(ev => ev.time)
  })
  // Salvar nova reunião em cookie
  function salvarNovaReuniao() {
    if (!novaNome || !novaHora || !novaSala || !novaData) return;
    // Não permitir conflito
    const diaSelecionado = format(novaData, "yyyy-MM-dd")
    const conflitos = reunioes
      .filter(r => format(r.day, "yyyy-MM-dd") === diaSelecionado)
      .flatMap(r => r.events)
      .filter(ev => ev.sala === novaSala && ev.time === novaHora)
    if (conflitos.length > 0) return alert("Horário já ocupado para esta sala!");
    const nova = {
      id: Math.floor(Math.random() * 1000000),
      name: novaNome,
      time: novaHora,
      datetime: format(novaData, "yyyy-MM-dd") + "T" + novaHora,
      sala: novaSala,
      day: novaData,
    }
    // Salvar no cookie
    const cookie = document.cookie.split('; ').find(row => row.startsWith('reunioes='))
    let reunioesCookie = []
    if (cookie) {
      try {
        reunioesCookie = JSON.parse(decodeURIComponent(cookie.split('=')[1]))
      } catch {}
    }
    reunioesCookie.push({ ...nova, day: novaData.toISOString() })
    document.cookie = `reunioes=${encodeURIComponent(JSON.stringify(reunioesCookie))};path=/;max-age=31536000`
    setModalNovaOpen(false)
    setNovaNome("")
    setNovaHora("")
    setNovaSala(salas[0])
    setNovaData(selectedDay)
    window.location.reload()
  }

  // Tradução dos dias da semana
  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

  return (
    <div className="flex flex-1 flex-col">
      {/* Modal de eventos do dia */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eventos agendados para {format(selectedDay, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</DialogTitle>
            <DialogDescription>
              {eventosDoDia.length === 0 ? (
                <span>Nenhum evento agendado para este dia.</span>
              ) : (
                <ul className="mt-2 space-y-2">
                  {eventosDoDia.map((event: Event) => (
                    <li key={event.id} className="border rounded-lg p-2 bg-muted/50">
                      <div className="font-semibold">{event.name}</div>
                      <div className="text-xs text-muted-foreground">Horário: {event.time}</div>
                    </li>
                  ))}
                </ul>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Cabeçalho do calendário */}
      <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none">
        <div className="flex flex-auto">
          <div className="flex items-center gap-4">
            <div className="hidden w-20 flex-col items-center justify-center rounded-lg border bg-muted p-0.5 md:flex">
              <h1 className="p-1 text-xs uppercase text-muted-foreground">
                {format(today, "MMM", { locale: ptBR })}
              </h1>
              <div className="flex w-full items-center justify-center rounded-lg border bg-background p-0.5 text-lg font-bold">
                <span>{format(today, "d")}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-foreground">
                {format(firstDayCurrentMonth, "MMMM yyyy", { locale: ptBR })}
              </h2>
              <p className="text-sm text-muted-foreground">
                {format(firstDayCurrentMonth, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} - {format(endOfMonth(firstDayCurrentMonth), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Button variant="outline" size="icon" className="hidden lg:flex">
            <SearchIcon size={16} strokeWidth={2} aria-hidden="true" />
          </Button>

          <Separator orientation="vertical" className="hidden h-6 lg:block" />

          <div className="inline-flex w-full -space-x-px rounded-lg shadow-sm shadow-black/5 md:w-auto rtl:space-x-reverse">
            <Button
              onClick={previousMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label="Ir para o mês anterior"
            >
              <ChevronLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button
              onClick={goToToday}
              className="w-full rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 md:w-auto"
              variant="outline"
            >
              Hoje
            </Button>
            <Button
              onClick={nextMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label="Ir para o próximo mês"
            >
              <ChevronRightIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>

          <Separator orientation="vertical" className="hidden h-6 md:block" />
          <Separator
            orientation="horizontal"
            className="block w-full md:hidden"
          />

          <Button className="w-full gap-2 md:w-auto" onClick={() => setModalNovaOpen(true)}>
            <PlusCircleIcon size={16} strokeWidth={2} aria-hidden="true" />
            <span>Nova Reunião</span>
          </Button>
      {/* Modal Nova Reunião */}
      <Dialog open={modalNovaOpen} onOpenChange={setModalNovaOpen}>
        <DialogContent>
          <DialogHeader>
        <DialogTitle>Agendar nova reunião</DialogTitle>
        <DialogDescription>
          <div className="flex flex-col gap-2 mt-2">
            <label>Sala:</label>
            <select value={novaSala} onChange={e => setNovaSala(e.target.value)} className="border rounded p-1 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
          {salas.map(sala => <option key={sala} value={sala}>{sala}</option>)}
            </select>
            <label>Nome da reunião:</label>
            <Input value={novaNome} onChange={e => setNovaNome(e.target.value)} className="border rounded p-1 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" placeholder="" />
            <label>Dia:</label>
            <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
              {novaData ? format(novaData, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Escolha o dia"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={novaData ?? undefined}
              onSelect={date => {
                setNovaData(date ?? null)
                setOpenDatePicker(false)
              }}
              defaultMonth={novaData ?? selectedDay}
              initialFocus
              className="rounded-lg border bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
            />
          </PopoverContent>
            </Popover>
            <div className="flex gap-2">
          <div className="flex flex-col flex-1">
            <label>Horário inicial:</label>
            <select
              value={novaHora}
              onChange={e => setNovaHora(e.target.value)}
              className="border rounded p-1 bg-[hsl(var(--background))] text-[hsl(var(--foreground))] max-h-48 overflow-y-auto"
              size={8}
            >
              <option value="">Selecione...</option>
              {Array.from({ length: 48 }, (_, i) => {
            const hour = Math.floor(i / 2);
            const minute = i % 2 === 0 ? "00" : "30";
            const hora = `${hour.toString().padStart(2, "0")}:${minute}`;
            const indisponivel = reunioes
              .filter(r => format(r.day, "yyyy-MM-dd") === (novaData ? format(novaData, "yyyy-MM-dd") : ""))
              .flatMap(r => r.events)
              .filter(ev => ev.sala === novaSala && ev.time === hora).length > 0;
            return (
              <option key={hora} value={hora} disabled={indisponivel}>
                {hora} {indisponivel ? "(Indisponível)" : ""}
              </option>
            );
              })}
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label>Horário final:</label>
            <select
              value={novaHoraFim}
              onChange={e => setNovaHoraFim(e.target.value)}
              className="border rounded p-1 bg-[hsl(var(--background))] text-[hsl(var(--foreground))] max-h-48 overflow-y-auto"
              size={8}
            >
              <option value="">Selecione...</option>
              {Array.from({ length: 48 }, (_, i) => {
            const hour = Math.floor(i / 2);
            const minute = i % 2 === 0 ? "00" : "30";
            const hora = `${hour.toString().padStart(2, "0")}:${minute}`;
            // Só permite horários após o inicial
            const isAfterStart = novaHora ? hora > novaHora : true;
            // Verifica se está ocupado
            const indisponivel = reunioes
              .filter(r => format(r.day, "yyyy-MM-dd") === (novaData ? format(novaData, "yyyy-MM-dd") : ""))
              .flatMap(r => r.events)
              .filter(ev => ev.sala === novaSala && ev.time === hora).length > 0;
            return (
              <option key={hora} value={hora} disabled={!isAfterStart || indisponivel}>
                {hora} {indisponivel ? "(Indisponível)" : ""}
              </option>
            );
              })}
            </select>
          </div>
            </div>
            <Button onClick={salvarNovaReuniao} className="mt-2">Salvar</Button>
          </div>
        </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
        </div>
      </div>

      {/* Grade do calendário */}
      <div className="lg:flex lg:flex-auto lg:flex-col">
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 border text-center text-xs font-semibold leading-6 lg:flex-none rounded-t-xl">
          {diasSemana.map((dia, idx) => (
            <div key={dia} className={idx < 6 ? "border-r py-2.5" : "py-2.5"}>{dia}</div>
          ))}
        </div>

        {/* Dias do calendário */}
        <div className="flex text-xs leading-6 lg:flex-auto">
          <div className="hidden w-full border-x lg:grid lg:grid-cols-7 lg:grid-rows-5 rounded-b-xl">
            {days.map((day, dayIdx) => (
              <div
                key={dayIdx}
                onClick={() => { setSelectedDay(day); setModalOpen(true); }}
                className={cn(
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "bg-accent/50 text-muted-foreground",
                  "relative flex flex-col border-b border-r hover:bg-muted focus:z-10 cursor-pointer rounded-b-xl",
                  !isEqual(day, selectedDay) && "hover:bg-accent/75",
                )}
              >
                <header className="flex items-center justify-between p-2.5">
                  <button
                    type="button"
                    className={cn(
                      isEqual(day, selectedDay) && "text-primary-foreground",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        "text-foreground",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        "text-muted-foreground",
                      isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "border-none bg-primary",
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        "bg-foreground",
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        "font-semibold",
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs hover:border",
                    )}
                  >
                    <time dateTime={format(day, "yyyy-MM-dd")}> 
                      {format(day, "d")}
                    </time>
                  </button>
                </header>
                <div className="flex-1 p-2.5">
                  {data
                    .filter((event) => isSameDay(event.day, day))
                    .map((day) => (
                      <div key={day.day.toString()} className="space-y-1.5">
                        {day.events.slice(0, 1).map((event) => (
                          <div
                            key={event.id}
                            className="flex flex-col items-start gap-1 rounded-lg border bg-muted/50 p-2 text-xs leading-tight"
                          >
                            <p className="font-medium leading-none">
                              {event.name}
                            </p>
                            <p className="leading-none text-muted-foreground">
                              {event.time}
                            </p>
                          </div>
                        ))}
                        {day.events.length > 1 && (
                          <div className="text-xs text-muted-foreground">
                            + {day.events.length - 1} {day.events.length - 1 === 1 ? "reunião" : "reuniões"}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="isolate grid w-full grid-cols-7 grid-rows-5 border-x lg:hidden">
            {days.map((day, dayIdx) => (
              <button
                onClick={() => { setSelectedDay(day); setModalOpen(true); }}
                key={dayIdx}
                type="button"
                className={cn(
                  isEqual(day, selectedDay) && "text-primary-foreground",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    "text-foreground",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "text-muted-foreground",
                  (isEqual(day, selectedDay) || isToday(day)) &&
                    "font-semibold",
                  "flex h-14 flex-col border-b border-r px-3 py-2 hover:bg-muted focus:z-10 cursor-pointer",
                )}
              >
                <time
                  dateTime={format(day, "yyyy-MM-dd")}
                  className={cn(
                    "ml-auto flex size-6 items-center justify-center rounded-full",
                    isEqual(day, selectedDay) &&
                      isToday(day) &&
                      "bg-primary text-primary-foreground",
                    isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      "bg-primary text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </time>
                {data.filter((date) => isSameDay(date.day, day)).length > 0 && (
                  <div>
                    {data
                      .filter((date) => isSameDay(date.day, day))
                      .map((date) => (
                        <div
                          key={date.day.toString()}
                          className="-mx-0.5 mt-auto flex flex-wrap-reverse"
                        >
                          {date.events.map((event) => (
                            <span
                              key={event.id}
                              className="mx-0.5 mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground"
                            />
                          ))}
                        </div>
                      ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
