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
  startOfToday,
  startOfWeek,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { Dialog } from "@/components/ui/dialog"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  SearchIcon,
  X,
  AlertCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Badge } from "@/components/ui/badge"

interface Event {
  id: string
  titulo: string
  hora_inicio: string
  hora_fim: string
  sala: string
  sala_nome?: string
  criador_email: string
  participantes: string[]
  recorrente?: boolean
  recorrencia_tipo?: 'diaria' | 'semanal' | 'mensal'
  recorrencia_ate?: string
  evento_pai_id?: string
}

interface CalendarData {
  day: Date
  events: Event[]
}

interface Sala {
  id: string
  nome: string
}

interface FullScreenCalendarProps {
  data: CalendarData[]
  salas: Sala[]
  onReload: () => void
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

export function FullScreenCalendar({ data, salas, onReload }: FullScreenCalendarProps) {
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = React.useState(today)
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "yyyy-MM", { locale: ptBR }),
  )
  const [modalOpen, setModalOpen] = React.useState(false)
  const [modalNovaOpen, setModalNovaOpen] = React.useState(false)
  const [modalOtpOpen, setModalOtpOpen] = React.useState(false)
  const [modalCancelarOpen, setModalCancelarOpen] = React.useState(false)
  const [modalOtpCancelarOpen, setModalOtpCancelarOpen] = React.useState(false)
  const [eventoSelecionado, setEventoSelecionado] = React.useState<Event | null>(null)
  
  // Dados do formulário
  const [novaSala, setNovaSala] = React.useState(salas[0]?.id || "")
  const [novaTitulo, setNovaTitulo] = React.useState("")
  const [novaHoraInicio, setNovaHoraInicio] = React.useState("")
  const [novaHoraFim, setNovaHoraFim] = React.useState("")
  const [novaData, setNovaData] = React.useState<Date | null>(selectedDay)
  const [novoEmail, setNovoEmail] = React.useState("")
  const [participanteInput, setParticipanteInput] = React.useState("")
  const [participantes, setParticipantes] = React.useState<string[]>([])
  const [otp, setOtp] = React.useState("")
  const [otpCancelar, setOtpCancelar] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [openDatePicker, setOpenDatePicker] = React.useState(false)
  const [mensagemErro, setMensagemErro] = React.useState("")
  
  // Campos de recorrência
  const [isRecorrente, setIsRecorrente] = React.useState(false)
  const [recorrenciaTipo, setRecorrenciaTipo] = React.useState<'diaria' | 'semanal' | 'mensal'>('semanal')
  const [recorrenciaAte, setRecorrenciaAte] = React.useState<Date | null>(null)
  const [openRecorrenciaDatePicker, setOpenRecorrenciaDatePicker] = React.useState(false)

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

  const eventosDoDia = data.filter((date) => isSameDay(date.day, selectedDay)).flatMap((date) => date.events)

  // Adicionar participante
  function adicionarParticipante() {
    if (participanteInput && participanteInput.includes("@")) {
      setParticipantes([...participantes, participanteInput])
      setParticipanteInput("")
    }
  }

  // Remover participante
  function removerParticipante(email: string) {
    setParticipantes(participantes.filter(p => p !== email))
  }

  // Solicitar OTP
  async function solicitarOTP() {
    setMensagemErro("")
    
    if (!novaTitulo || !novaSala || !novaData || !novaHoraInicio || !novaHoraFim || !novoEmail) {
      setMensagemErro("Preencha todos os campos obrigatórios")
      return
    }

    if (!novoEmail.includes("@")) {
      setMensagemErro("E-mail inválido")
      return
    }

    if (novaHoraInicio >= novaHoraFim) {
      setMensagemErro("O horário de término deve ser após o horário de início")
      return
    }

    setLoading(true)

    try {
      // Primeiro, verificar se há conflito de horário
      const checkResponse = await fetch("/api/verificar_disponibilidade_sala", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sala_id: novaSala,
          data: novaData ? format(novaData, "yyyy-MM-dd") : "",
          hora_inicio: novaHoraInicio,
          hora_fim: novaHoraFim,
        }),
      })

      const checkResult = await checkResponse.json()

      if (!checkResponse.ok || !checkResult.disponivel) {
        setMensagemErro(checkResult.error || "Horário já ocupado para esta sala")
        setLoading(false)
        return
      }

      // Se não há conflito, enviar OTP
      const response = await fetch("/api/enviar_otp_reuniao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: novoEmail }),
      })

      const result = await response.json()

      if (response.ok) {
        setModalNovaOpen(false)
        setModalOtpOpen(true)
      } else {
        setMensagemErro(result.error || "Erro ao enviar código")
      }
    } catch (error) {
      setMensagemErro("Erro ao verificar disponibilidade")
    } finally {
      setLoading(false)
    }
  }

  // Confirmar agendamento com OTP
  async function confirmarAgendamento() {
    setMensagemErro("")
    
    if (!otp || otp.length !== 6) {
      setMensagemErro("Digite o código de 6 dígitos")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/validar_otp_reuniao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: novoEmail,
          codigo: otp,
          sala_id: novaSala,
          titulo: novaTitulo,
          data: novaData ? format(novaData, "yyyy-MM-dd") : "",
          hora_inicio: novaHoraInicio,
          hora_fim: novaHoraFim,
          participantes,
          recorrente: isRecorrente,
          recorrencia_tipo: isRecorrente ? recorrenciaTipo : undefined,
          recorrencia_ate: isRecorrente && recorrenciaAte ? format(recorrenciaAte, "yyyy-MM-dd") : undefined,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setModalOtpOpen(false)
        resetForm()
        onReload()
      } else {
        setMensagemErro(result.error || "Erro ao confirmar agendamento")
      }
    } catch (error) {
      setMensagemErro("Erro ao confirmar agendamento")
    } finally {
      setLoading(false)
    }
  }

  // Reset do formulário
  function resetForm() {
    setNovaTitulo("")
    setNovaSala(salas[0]?.id || "")
    setNovaData(selectedDay)
    setNovaHoraInicio("")
    setNovaHoraFim("")
    setNovoEmail("")
    setParticipantes([])
    setOtp("")
    setOtpCancelar("")
    setMensagemErro("")
    setIsRecorrente(false)
    setRecorrenciaTipo('semanal')
    setRecorrenciaAte(null)
  }

  // Solicitar OTP para cancelar
  async function solicitarOTPCancelar(event: Event) {
    setEventoSelecionado(event)
    setMensagemErro("")
    setLoading(true)

    try {
      const response = await fetch("/api/enviar_otp_cancelar_reuniao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: event.criador_email,
          evento_id: event.id 
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setModalCancelarOpen(false)
        setModalOtpCancelarOpen(true)
      } else {
        setMensagemErro(result.error || "Erro ao enviar código")
      }
    } catch (error) {
      setMensagemErro("Erro ao enviar código de verificação")
    } finally {
      setLoading(false)
    }
  }

  // Confirmar cancelamento com OTP
  async function confirmarCancelamento() {
    setMensagemErro("")
    
    if (!otpCancelar || otpCancelar.length !== 6) {
      setMensagemErro("Digite o código de 6 dígitos")
      return
    }

    if (!eventoSelecionado) {
      setMensagemErro("Evento não selecionado")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/validar_otp_cancelar_reuniao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: eventoSelecionado.criador_email,
          codigo: otpCancelar,
          evento_id: eventoSelecionado.id,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setModalOtpCancelarOpen(false)
        setModalCancelarOpen(false)
        setModalOpen(false)
        setEventoSelecionado(null)
        setOtpCancelar("")
        onReload()
      } else {
        setMensagemErro(result.error || "Erro ao confirmar cancelamento")
      }
    } catch (error) {
      setMensagemErro("Erro ao confirmar cancelamento")
    } finally {
      setLoading(false)
    }
  }

  const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

  return (
    <div className="flex flex-1 flex-col">
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Eventos agendados para {format(selectedDay, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </DialogTitle>
            <DialogDescription>
              {eventosDoDia.length === 0 ? (
                <span>Nenhum evento agendado para este dia.</span>
              ) : (
                <ul className="mt-2 space-y-2">
                  {eventosDoDia.map((event) => (
                    <li key={event.id} className="border rounded-lg p-3 bg-muted/50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold">{event.titulo}</div>
                          {event.recorrente && (
                            <Badge variant="outline" className="text-xs mt-1">
                              Recorrente ({event.recorrencia_tipo})
                            </Badge>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">
                            {event.sala_nome || event.sala}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Horário: {event.hora_inicio} - {event.hora_fim}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Organizador: {event.criador_email}
                          </div>
                          {event.participantes && event.participantes.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Participantes: {event.participantes.join(", ")}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setEventoSelecionado(event)
                            setModalCancelarOpen(true)
                          }}
                          className="ml-2"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Modal Nova Reunião */}
      <Dialog open={modalNovaOpen} onOpenChange={setModalNovaOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agendar nova reunião</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-4 mt-4">
                {mensagemErro && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {mensagemErro}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Título da reunião *</label>
                  <Input 
                    value={novaTitulo} 
                    onChange={e => setNovaTitulo(e.target.value)} 
                    placeholder="Ex: Reunião de planejamento"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Sala *</label>
                  <select 
                    value={novaSala} 
                    onChange={e => setNovaSala(e.target.value)} 
                    className="w-full mt-1 border rounded p-2 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                  >
                    {salas.map(sala => (
                      <option key={sala.id} value={sala.id}>{sala.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Data *</label>
                  <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start mt-1">
                        {novaData ? format(novaData, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Escolha a data"}
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
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Horário de início *</label>
                    <select
                      value={novaHoraInicio}
                      onChange={e => setNovaHoraInicio(e.target.value)}
                      className="w-full mt-1 border rounded p-2 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                    >
                      <option value="">Selecione...</option>
                      {Array.from({ length: 48 }, (_, i) => {
                        const hour = Math.floor(i / 2)
                        const minute = i % 2 === 0 ? "00" : "30"
                        const hora = `${hour.toString().padStart(2, "0")}:${minute}`
                        return (
                          <option key={hora} value={hora}>{hora}</option>
                        )
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Horário de término *</label>
                    <select
                      value={novaHoraFim}
                      onChange={e => setNovaHoraFim(e.target.value)}
                      className="w-full mt-1 border rounded p-2 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                    >
                      <option value="">Selecione...</option>
                      {Array.from({ length: 48 }, (_, i) => {
                        const hour = Math.floor(i / 2)
                        const minute = i % 2 === 0 ? "00" : "30"
                        const hora = `${hour.toString().padStart(2, "0")}:${minute}`
                        return (
                          <option key={hora} value={hora}>{hora}</option>
                        )
                      })}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Seu e-mail *</label>
                  <Input 
                    type="email"
                    value={novoEmail} 
                    onChange={e => setNovoEmail(e.target.value)} 
                    placeholder="seu.email@empresa.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Participantes (opcional)</label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      type="email"
                      value={participanteInput} 
                      onChange={e => setParticipanteInput(e.target.value)} 
                      placeholder="email@empresa.com"
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), adicionarParticipante())}
                    />
                    <Button type="button" onClick={adicionarParticipante}>Adicionar</Button>
                  </div>
                  {participantes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {participantes.map((p, idx) => (
                        <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                          {p}
                          <X 
                            size={14} 
                            className="cursor-pointer" 
                            onClick={() => removerParticipante(p)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="recorrente"
                      checked={isRecorrente}
                      onChange={(e) => setIsRecorrente(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="recorrente" className="text-sm font-medium">
                      Reunião recorrente
                    </label>
                  </div>

                  {isRecorrente && (
                    <>
                      <div>
                        <label className="text-sm font-medium">Tipo de recorrência *</label>
                        <select
                          value={recorrenciaTipo}
                          onChange={e => setRecorrenciaTipo(e.target.value as 'diaria' | 'semanal' | 'mensal')}
                          className="w-full mt-1 border rounded p-2 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                        >
                          <option value="diaria">Diariamente</option>
                          <option value="semanal">Semanalmente</option>
                          <option value="mensal">Mensalmente</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Repetir até *</label>
                        <Popover open={openRecorrenciaDatePicker} onOpenChange={setOpenRecorrenciaDatePicker}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start mt-1">
                              {recorrenciaAte ? format(recorrenciaAte, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Escolha a data final"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={recorrenciaAte ?? undefined}
                              onSelect={date => {
                                setRecorrenciaAte(date ?? null)
                                setOpenRecorrenciaDatePicker(false)
                              }}
                              defaultMonth={recorrenciaAte ?? novaData ?? selectedDay}
                              disabled={(date) => date < (novaData ?? selectedDay)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <p className="text-xs text-muted-foreground mt-1">
                          As reuniões serão criadas automaticamente até esta data
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <Button 
                  onClick={solicitarOTP} 
                  disabled={loading || (isRecorrente && !recorrenciaAte)}
                  className="mt-2"
                >
                  {loading ? "Enviando..." : "Enviar código de verificação"}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Modal OTP */}
      <Dialog open={modalOtpOpen} onOpenChange={setModalOtpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirme seu código</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-4 mt-4">
                {mensagemErro && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {mensagemErro}
                  </div>
                )}

                <p className="text-sm">
                  Digite o código de 6 dígitos que foi enviado para <strong>{novoEmail}</strong>
                </p>

                <Input 
                  type="text"
                  value={otp} 
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />

                <p className="text-xs text-muted-foreground">
                  O código expira em 5 minutos. Verifique sua caixa de entrada e spam.
                </p>

                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setModalOtpOpen(false)
                      setModalNovaOpen(true)
                    }}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={confirmarAgendamento} 
                    disabled={loading || otp.length !== 6}
                    className="flex-1"
                  >
                    {loading ? "Confirmando..." : "Confirmar agendamento"}
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Modal Confirmar Cancelamento */}
      <Dialog open={modalCancelarOpen} onOpenChange={setModalCancelarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Reunião</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-4 mt-4">
                {mensagemErro && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {mensagemErro}
                  </div>
                )}

                {eventoSelecionado && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="font-semibold text-lg mb-2">{eventoSelecionado.titulo}</div>
                    <div className="text-sm space-y-1">
                      <p><strong>Sala:</strong> {eventoSelecionado.sala_nome || eventoSelecionado.sala}</p>
                      <p><strong>Data:</strong> {format(selectedDay, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                      <p><strong>Horário:</strong> {eventoSelecionado.hora_inicio} - {eventoSelecionado.hora_fim}</p>
                      <p><strong>Organizador:</strong> {eventoSelecionado.criador_email}</p>
                      {eventoSelecionado.recorrente && (
                        <Badge variant="outline" className="mt-2">
                          Reunião Recorrente ({eventoSelecionado.recorrencia_tipo})
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 dark:text-amber-300 text-sm">
                    Um código de verificação será enviado para o e-mail do organizador: <strong>{eventoSelecionado?.criador_email}</strong>
                  </AlertDescription>
                </Alert>

                {eventoSelecionado?.recorrente && (
                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-300 text-sm">
                      <strong>Atenção:</strong> Esta é uma reunião recorrente. Apenas esta ocorrência será cancelada.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setModalCancelarOpen(false)
                      setEventoSelecionado(null)
                      setMensagemErro("")
                    }}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => solicitarOTPCancelar(eventoSelecionado!)} 
                    disabled={loading || !eventoSelecionado}
                    className="flex-1"
                  >
                    {loading ? "Enviando..." : "Enviar código"}
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Modal OTP Cancelamento */}
      <Dialog open={modalOtpCancelarOpen} onOpenChange={setModalOtpCancelarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirme o Cancelamento</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-4 mt-4">
                {mensagemErro && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {mensagemErro}
                  </div>
                )}

                <p className="text-sm">
                  Digite o código de 6 dígitos que foi enviado para <strong>{eventoSelecionado?.criador_email}</strong>
                </p>

                <Input 
                  type="text"
                  value={otpCancelar} 
                  onChange={e => setOtpCancelar(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />

                <p className="text-xs text-muted-foreground">
                  O código expira em 5 minutos. Verifique sua caixa de entrada e spam.
                </p>

                <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-300 text-sm">
                    <strong>Atenção:</strong> Esta ação não pode ser desfeita. A reunião será permanentemente cancelada.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setModalOtpCancelarOpen(false)
                      setModalCancelarOpen(true)
                      setOtpCancelar("")
                    }}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={confirmarCancelamento} 
                    disabled={loading || otpCancelar.length !== 6}
                    className="flex-1"
                  >
                    {loading ? "Cancelando..." : "Confirmar cancelamento"}
                  </Button>
                </div>
              </div>
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
                {format(firstDayCurrentMonth, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} -{" "}
                {format(endOfMonth(firstDayCurrentMonth), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
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
          <Separator orientation="horizontal" className="block w-full md:hidden" />

          <Button className="w-full gap-2 md:w-auto" onClick={() => setModalNovaOpen(true)}>
            <PlusCircleIcon size={16} strokeWidth={2} aria-hidden="true" />
            <span>Nova Reunião</span>
          </Button>
        </div>
      </div>

      {/* Grade do calendário */}
      <div className="lg:flex lg:flex-auto lg:flex-col">
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 border text-center text-xs font-semibold leading-6 lg:flex-none rounded-t-xl">
          {diasSemana.map((dia, idx) => (
            <div key={dia} className={idx < 6 ? "border-r py-2.5" : "py-2.5"}>
              {dia}
            </div>
          ))}
        </div>

        {/* Dias do calendário */}
        <div className="flex text-xs leading-6 lg:flex-auto">
          <div className="hidden w-full border-x lg:grid lg:grid-cols-7 lg:grid-rows-5 rounded-b-xl">
            {days.map((day, dayIdx) => (
              <div
                key={dayIdx}
                onClick={() => {
                  setSelectedDay(day)
                  setModalOpen(true)
                }}
                className={cn(
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "bg-accent/50 text-muted-foreground",
                  "relative flex flex-col border-b border-r hover:bg-muted focus:z-10 cursor-pointer",
                  !isEqual(day, selectedDay) && "hover:bg-accent/75"
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
                      isEqual(day, selectedDay) && isToday(day) && "border-none bg-primary",
                      isEqual(day, selectedDay) && !isToday(day) && "bg-foreground",
                      (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs hover:border"
                    )}
                  >
                    <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
                  </button>
                </header>
                <div className="flex-1 p-2.5">
                  {data
                    .filter((event) => isSameDay(event.day, day))
                    .map((day) => (
                      <div key={day.day.toString()} className="space-y-1.5">
                        {day.events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="flex flex-col items-start gap-1 rounded-lg border bg-muted/50 p-2 text-xs leading-tight"
                          >
                            <p className="font-medium leading-none">{event.titulo}</p>
                            <p className="leading-none text-muted-foreground">
                              {event.hora_inicio}
                            </p>
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            + {day.events.length - 2}{" "}
                            {day.events.length - 2 === 1 ? "reunião" : "reuniões"}
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
                onClick={() => {
                  setSelectedDay(day)
                  setModalOpen(true)
                }}
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
                  (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
                  "flex h-14 flex-col border-b border-r px-3 py-2 hover:bg-muted focus:z-10 cursor-pointer"
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
                      "bg-primary text-primary-foreground"
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

