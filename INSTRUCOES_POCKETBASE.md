# Instruções para Configuração do PocketBase

## Tabelas a serem criadas:

### 1. **salas_reuniao**
Armazena as salas de reunião disponíveis.

**Campos:**
- `id` (text) - ID automático
- `nome` (text) - Nome da sala (ex: "Sala de Reuniões RH", "Auditório")
- `created` (date) - Data de criação automática
- `updated` (date) - Data de atualização automática

---

### 2. **agendamento_salas_reuniao**
Armazena os agendamentos de salas.

**Campos:**
- `id` (text) - ID automático
- `sala` (relation) - Relação com `salas_reuniao` (single)
- `titulo` (text) - Título da reunião
- `data` (text) - Data do agendamento (formato: YYYY-MM-DD)
- `hora_inicio` (text) - Horário de início (formato: HH:MM)
- `hora_fim` (text) - Horário de término (formato: HH:MM)
- `criador_email` (text) - E-mail de quem criou o agendamento
- `participantes` (json) - Array de e-mails dos participantes
- `created` (date) - Data de criação automática
- `updated` (date) - Data de atualização automática

**Índices/Regras:**
- Adicionar validação para evitar conflitos de horário (pode ser feita na API)

---

### 3. **otp_reuniao**
Armazena códigos OTP para verificação de agendamentos.

**Campos:**
- `id` (text) - ID automático
- `email` (email) - E-mail para qual o OTP foi enviado
- `codigo` (text) - Código OTP de 6 dígitos
- `expira_em` (date) - Data/hora de expiração do código
- `usado` (bool) - Se o código já foi utilizado (padrão: false)
- `created` (date) - Data de criação automática
- `updated` (date) - Data de atualização automática

**Configurações:**
- Tempo de validade: 5 minutos
- Após uso, marcar como `usado = true`

---

## Exemplo de Dados Iniciais

### Salas de Reunião (salas_reuniao):
```json
[
  {
    "nome": "Sala de Reuniões RH"
  },
  {
    "nome": "Auditório"
  },
  {
    "nome": "Sala de Treinamento"
  },
  {
    "nome": "Sala Executiva"
  }
]
```

### Agendamento de Exemplo (agendamento_salas_reuniao):
```json
{
  "sala": "<ID_DA_SALA>",
  "titulo": "Reunião de Planejamento",
  "data": "2025-10-15",
  "hora_inicio": "14:00",
  "hora_fim": "16:00",
  "criador_email": "usuario@empresa.com",
  "participantes": ["participante1@empresa.com", "participante2@empresa.com"]
}
```

---

## Configuração de Permissões no PocketBase

### salas_reuniao:
- **Listar/Ver:** Público (qualquer um pode ver as salas disponíveis)
- **Criar/Editar/Deletar:** Apenas Admin

### agendamento_salas_reuniao:
- **Listar/Ver:** Público (qualquer um pode ver os agendamentos)
- **Criar:** Através da API (via validação OTP)
- **Editar/Deletar:** Apenas criador ou Admin

### otp_reuniao:
- **Todas operações:** Apenas via API (não expor diretamente)

---

## Variáveis de Ambiente Necessárias

Certifique-se de ter a variável `WEBHOOK_NOTICIAS` configurada no seu arquivo `.env` ou `.env.local`:

```env
WEBHOOK_NOTICIAS=https://seu-webhook-para-envio-de-emails.com
```

---

## Fluxo de Agendamento

1. Usuário preenche o formulário de nova reunião
2. Sistema envia OTP para o e-mail do criador
3. OTP é salvo na tabela `otp_reuniao` com expiração de 5 minutos
4. Usuário digita o código OTP recebido
5. Sistema valida o OTP:
   - Verifica se existe
   - Verifica se não expirou
   - Verifica se não foi usado
   - Verifica conflitos de horário
6. Se válido, cria o agendamento na tabela `agendamento_salas_reuniao`
7. Marca o OTP como usado
8. Envia e-mails de confirmação:
   - Para o criador: confirmação do agendamento com anexo ICS
   - Para participantes: convite para reunião com anexo ICS
9. Atualiza o calendário

---

## Recursos Implementados

✅ Sistema de autenticação via OTP (código válido por 5 minutos)
✅ Validação de conflitos de horário
✅ Adição de múltiplos participantes
✅ Envio de e-mails com anexo ICS (adicionar à agenda)
✅ Integração com PocketBase
✅ Interface responsiva e intuitiva
✅ Atualização automática do calendário após agendamento

---

## Próximos Passos

1. Criar as tabelas no PocketBase seguindo as especificações acima
2. Adicionar algumas salas de reunião iniciais
3. Testar o fluxo de agendamento
4. Ajustar permissões conforme necessário
