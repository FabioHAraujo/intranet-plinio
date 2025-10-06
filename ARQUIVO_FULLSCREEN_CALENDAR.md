# Arquivo fullscreen-calendar.tsx

O arquivo está parcialmente criado. Complete-o adicionando após o conteúdo existente o seguinte código:

## Continuação do arquivo (após o primeiro Dialog):

```tsx
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
                  <Input value={novaTitulo} onChange={e => setNovaTitulo(e.target.value)} placeholder="Ex: Reunião de planejamento" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Sala *</label>
                  <select value={novaSala} onChange={e => setNovaSala(e.target.value)} className="w-full mt-1 border rounded p-2 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
                    {salas.map(sala => <option key={sala.id} value={sala.id}>{sala.nome}</option>)}
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
                      <Calendar mode="single" selected={novaData ?? undefined} onSelect={date => {setNovaData(date ?? null); setOpenDatePicker(false)}} defaultMonth={novaData ?? selectedDay} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Horário de início *</label>
                    <select value={novaHoraInicio} onChange={e => setNovaHoraInicio(e.target.value)} className="w-full mt-1 border rounded p-2 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
                      <option value="">Selecione...</option>
                      {Array.from({ length: 48 }, (_, i) => {const hour = Math.floor(i / 2); const minute = i % 2 === 0 ? "00" : "30"; const hora = `${hour.toString().padStart(2, "0")}:${minute}`; return <option key={hora} value={hora}>{hora}</option>})}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Horário de término *</label>
                    <select value={novaHoraFim} onChange={e => setNovaHoraFim(e.target.value)} className="w-full mt-1 border rounded p-2 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
                      <option value="">Selecione...</option>
                      {Array.from({ length: 48 }, (_, i) => {const hour = Math.floor(i / 2); const minute = i % 2 === 0 ? "00" : "30"; const hora = `${hour.toString().padStart(2, "0")}:${minute}`; return <option key={hora} value={hora}>{hora}</option>})}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Seu e-mail *</label>
                  <Input type="email" value={novoEmail} onChange={e => setNovoEmail(e.target.value)} placeholder="seu.email@empresa.com" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Participantes (opcional)</label>
                  <div className="flex gap-2 mt-1">
                    <Input type="email" value={participanteInput} onChange={e => setParticipanteInput(e.target.value)} placeholder="email@empresa.com" onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), adicionarParticipante())} />
                    <Button type="button" onClick={adicionarParticipante}>Adicionar</Button>
                  </div>
                  {participantes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {participantes.map((p, idx) => <Badge key={idx} variant="secondary" className="flex items-center gap-1">{p}<X size={14} className="cursor-pointer" onClick={() => removerParticipante(p)} /></Badge>)}
                    </div>
                  )}
                </div>
                <Button onClick={solicitarOTP} disabled={loading} className="mt-2">{loading ? "Enviando..." : "Enviar código de verificação"}</Button>
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
                {mensagemErro && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{mensagemErro}</div>}
                <p className="text-sm">Digite o código de 6 dígitos que foi enviado para <strong>{novoEmail}</strong></p>
                <Input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" className="text-center text-2xl tracking-widest" maxLength={6} />
                <p className="text-xs text-muted-foreground">O código expira em 5 minutos. Verifique sua caixa de entrada e spam.</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => {setModalOtpOpen(false); setModalNovaOpen(true)}} className="flex-1">Voltar</Button>
                  <Button onClick={confirmarAgendamento} disabled={loading || otp.length !== 6} className="flex-1">{loading ? "Confirmando..." : "Confirmar agendamento"}</Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

Continua com o cabeçalho do calendário e grid... (verificar arquivo original anexo para estrutura completa)
```

## Instruções:

O arquivo `/root/fabio/intranet-plinio/components/ui/fullscreen-calendar.tsx` foi parcialmente criado.

Para completá-lo, copie TODO o conteúdo do arquivo anexado anteriormente `fullscreen-calendar.tsx` (attachment) ou recrie-o com a estrutura completa incluindo:

1. Todas as importações
2. Interfaces
3. Função FullScreenCalendar com todos os modais
4. Grade do calendário (desktop e mobile)
5. Export da função

O arquivo deve ter aproximadamente 600+ linhas.
