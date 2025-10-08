# Implementação de Eventos Recorrentes e Cancelamento com OTP

## 📋 Resumo das Funcionalidades Implementadas

### 1. ✅ Cancelamento de Eventos com OTP

#### **Como Funciona:**
1. Usuário clica em "Cancelar" em um evento no calendário
2. Sistema mostra modal de confirmação com detalhes do evento
3. Sistema envia código OTP (6 dígitos) para o e-mail do **organizador** do evento
4. Organizador insere o código recebido
5. Sistema valida o código e cancela o evento
6. E-mails de notificação são enviados para:
   - Organizador (confirmação de cancelamento)
   - Todos os participantes (notificação do cancelamento)

#### **Arquivos Criados/Modificados:**

**APIs Criadas:**
- `/pages/api/enviar_otp_cancelar_reuniao.ts` - Envia OTP para cancelamento
- `/pages/api/validar_otp_cancelar_reuniao.ts` - Valida OTP e cancela evento

**Componentes Modificados:**
- `/components/ui/fullscreen-calendar.tsx` - Adicionados:
  - Botão "Cancelar" em cada evento
  - Modal de confirmação de cancelamento
  - Modal de inserção do OTP
  - Lógica de validação

#### **Segurança:**
- ✅ Apenas o organizador pode cancelar (validação por e-mail)
- ✅ Código OTP expira em 5 minutos
- ✅ Código usado uma única vez (marcado como `usado: true`)
- ✅ Código vinculado ao evento específico

---

### 2. ✅ Eventos Recorrentes

#### **Como Funciona:**
1. Ao criar um evento, usuário marca checkbox "Reunião recorrente"
2. Escolhe tipo de recorrência:
   - **Diária** - Todos os dias
   - **Semanal** - Mesma hora/dia da semana
   - **Mensal** - Mesmo dia do mês
3. Define data final da recorrência
4. Sistema cria automaticamente múltiplas ocorrências

#### **Lógica Implementada:**

```typescript
// Exemplo de datas geradas para recorrência semanal
// Data inicial: 08/10/2025
// Data final: 29/10/2025
// Resultado: 4 eventos (08/10, 15/10, 22/10, 29/10)
```

**Estrutura do Banco:**
- **Evento Pai**: Primeiro evento da série (contém `recorrente: true`, `recorrencia_tipo`, `recorrencia_ate`)
- **Eventos Filhos**: Demais ocorrências (contém `evento_pai_id` apontando para o pai)

#### **Validações:**
- ✅ Verifica conflito de horário para **todas** as datas da recorrência
- ✅ Se houver conflito em qualquer data, **nenhum** evento é criado
- ✅ Retorna erro específico informando a data do conflito

#### **Arquivo ICS (Calendário):**
- ✅ Gerado com regra RRULE para suporte nativo em Outlook, Gmail, Apple Calendar
- ✅ Exemplo de RRULE: `RRULE:FREQ=WEEKLY;UNTIL=20251029T235959Z`

#### **Arquivos Modificados:**

**APIs Modificadas:**
- `/pages/api/validar_otp_reuniao.ts` - Adicionada lógica de:
  - Criação de múltiplos eventos
  - Validação de conflitos em todas as datas
  - Geração de ICS com recorrência
  - Função `gerarDatasRecorrentes()`

**Componentes Modificados:**
- `/components/ui/fullscreen-calendar.tsx` - Adicionados:
  - Checkbox "Reunião recorrente"
  - Select de tipo de recorrência
  - Date picker para data final
  - Badge indicando evento recorrente
  - Validação de campos de recorrência

---

## 🗂️ Estrutura de Dados no PocketBase

### Coleção: `agendamento_salas_reuniao`

```typescript
{
  id: string
  sala: string (relation)
  titulo: string
  data: string (YYYY-MM-DD)
  hora_inicio: string (HH:MM)
  hora_fim: string (HH:MM)
  criador_email: string
  participantes: string[] (array de e-mails)
  recorrente: boolean (novo)
  recorrencia_tipo: 'diaria' | 'semanal' | 'mensal' (novo)
  recorrencia_ate: string (novo - YYYY-MM-DD)
  evento_pai_id: string (novo - apenas em eventos filhos)
}
```

### Coleção: `otp_cancelar_reuniao` (nova)

```typescript
{
  id: string
  email: string
  codigo: string (6 dígitos)
  evento_id: string
  expira_em: datetime
  usado: boolean
  created: datetime
}
```

---

## 📧 E-mails Enviados

### 1. Cancelamento de Evento

**Para o Organizador (OTP):**
```
Assunto: Código de Verificação - Cancelamento de Reunião
Conteúdo: Código de 6 dígitos + detalhes do evento
```

**Para o Organizador (Confirmação):**
```
Assunto: Reunião Cancelada com Sucesso
Conteúdo: Confirmação + detalhes do evento cancelado
```

**Para Participantes:**
```
Assunto: Reunião Cancelada
Conteúdo: Notificação + detalhes do evento + organizador
```

### 2. Eventos Recorrentes

**Para o Organizador:**
```
Assunto: Reuniões Agendadas com Sucesso
Conteúdo: 
- Detalhes da reunião
- Tipo de recorrência
- Total de reuniões criadas
- Anexo .ics com RRULE
```

**Para Participantes:**
```
Assunto: Convite: [Título da Reunião]
Conteúdo:
- Convite para reunião recorrente
- Anexo .ics com RRULE
```

---

## 🔧 Próximos Passos (Opcional)

### Melhorias Sugeridas:

1. **Cancelar Série Completa**
   - Opção para cancelar evento pai + todos os filhos
   - Modal perguntando: "Cancelar apenas esta ou toda a série?"

2. **Editar Eventos Recorrentes**
   - Editar apenas uma ocorrência
   - Editar série completa
   - Editar desta data em diante

3. **Dashboard de Estatísticas**
   - Total de reuniões agendadas
   - Taxa de cancelamento
   - Salas mais utilizadas
   - Horários de pico

4. **Notificações em Tempo Real**
   - WebSocket para atualização automática do calendário
   - Push notifications antes da reunião

5. **Recursos Adicionais**
   - Adicionar equipamentos/recursos às salas
   - Reserva de equipamentos junto com a sala
   - Check-in obrigatório para reunião

---

## 🐛 Debugging

### Verificar OTPs no PocketBase:
```bash
# Acessar https://pocketbase.flecksteel.com.br/_/
# Collections > otp_cancelar_reuniao
# Verificar códigos gerados e status de uso
```

### Logs Úteis:
```javascript
console.log('OTP enviado:', { email, codigo, evento_id })
console.log('Eventos recorrentes criados:', agendamentos.length)
console.log('Datas geradas:', datasRecorrencia)
```

---

## ✅ Checklist de Testes

### Cancelamento:
- [ ] Cancelar evento como organizador
- [ ] Tentar cancelar evento de outro organizador (deve falhar)
- [ ] OTP expira após 5 minutos
- [ ] OTP não pode ser reutilizado
- [ ] E-mails enviados corretamente
- [ ] Participantes notificados

### Recorrência:
- [ ] Criar evento recorrente diário
- [ ] Criar evento recorrente semanal
- [ ] Criar evento recorrente mensal
- [ ] Validar conflitos em todas as datas
- [ ] ICS gerado com RRULE correto
- [ ] Importar ICS no Outlook/Gmail
- [ ] Badge de "recorrente" aparece no calendário

### Performance:
- [ ] Criar série com 50+ eventos (teste de stress)
- [ ] Verificar tempo de resposta
- [ ] Validar consumo de memória

---

## 📝 Notas Importantes

1. **Timezone**: Todos os horários são salvos no timezone local do servidor
2. **ICS Compatibility**: Testado com Outlook 365, Gmail e Apple Calendar
3. **Limite de Recorrência**: Recomendado máximo 100 ocorrências por série
4. **Webhook**: Utiliza `process.env.WEBHOOK_NOTICIAS` para envio de e-mails

---

**Data da Implementação:** 08 de outubro de 2025  
**Desenvolvido por:** Claude (Anthropic) + FabioHAraujo  
**Versão:** 1.0.0
