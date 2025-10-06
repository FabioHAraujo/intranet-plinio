# 🚀 GUIA RÁPIDO - Configuração PocketBase

## Passo 1️⃣: Criar Collection `salas_reuniao`

```bash
Nome da Collection: salas_reuniao
Type: Base Collection
```

### Campos:
| Nome | Tipo | Obrigatório | Configurações |
|------|------|-------------|---------------|
| id | text | ✓ (auto) | Auto-gerado |
| nome | text | ✓ | - |
| created | date | ✓ (auto) | Auto-gerado |
| updated | date | ✓ (auto) | Auto-gerado |

### Regras de API:
- **List/View:** `@request.auth.id != ""`
- **Create/Update/Delete:** (vazio - apenas admin)

---

## Passo 2️⃣: Criar Collection `agendamento_salas_reuniao`

```bash
Nome da Collection: agendamento_salas_reuniao
Type: Base Collection
```

### Campos:
| Nome | Tipo | Obrigatório | Configurações |
|------|------|-------------|---------------|
| id | text | ✓ (auto) | Auto-gerado |
| sala | relation | ✓ | Collection: `salas_reuniao`, Type: Single |
| titulo | text | ✓ | - |
| data | text | ✓ | Pattern: YYYY-MM-DD |
| hora_inicio | text | ✓ | Pattern: HH:MM |
| hora_fim | text | ✓ | Pattern: HH:MM |
| criador_email | email | ✓ | - |
| participantes | json | ✗ | - |
| created | date | ✓ (auto) | Auto-gerado |
| updated | date | ✓ (auto) | Auto-gerado |

### Configuração da Relação `sala`:
- **Collection:** salas_reuniao
- **Type:** Single relation
- **Cascade delete:** ☐ (unchecked)
- **Required:** ☑ (checked)

### Regras de API:
- **List/View:** `@request.auth.id != ""`
- **Create:** (vazio - via API)
- **Update:** `@request.auth.id != "" && criador_email = @request.auth.email`
- **Delete:** `@request.auth.id != "" && criador_email = @request.auth.email`

---

## Passo 3️⃣: Criar Collection `otp_reuniao`

```bash
Nome da Collection: otp_reuniao
Type: Base Collection
```

### Campos:
| Nome | Tipo | Obrigatório | Configurações |
|------|------|-------------|---------------|
| id | text | ✓ (auto) | Auto-gerado |
| email | email | ✓ | - |
| codigo | text | ✓ | Min: 6, Max: 6 |
| expira_em | date | ✓ | - |
| usado | bool | ✓ | Default: false |
| created | date | ✓ (auto) | Auto-gerado |
| updated | date | ✓ (auto) | Auto-gerado |

### Regras de API:
- **List/View:** (vazio - apenas API)
- **Create:** (vazio - apenas API)
- **Update:** (vazio - apenas API)
- **Delete:** (vazio - apenas API)

---

## Passo 4️⃣: Adicionar Dados Iniciais

### Salas de Reunião:

No PocketBase Admin, vá em `salas_reuniao` → New Record:

1. **Sala 1:**
   - nome: `Sala de Reuniões RH`

2. **Sala 2:**
   - nome: `Auditório`

3. **Sala 3:**
   - nome: `Sala de Treinamento`

4. **Sala 4:**
   - nome: `Sala Executiva`

---

## Passo 5️⃣: Verificar Variável de Ambiente

Arquivo: `.env.local`

```env
WEBHOOK_NOTICIAS=https://seu-webhook-aqui.com
```

---

## Passo 6️⃣: Testar!

1. Acesse: `http://localhost:3000/calendario-salas`
2. Clique em "Nova Reunião"
3. Preencha os dados
4. Receba o OTP no e-mail
5. Confirme a reunião

---

## 🎯 Checklist de Configuração

- [ ] Collection `salas_reuniao` criada
- [ ] Collection `agendamento_salas_reuniao` criada
- [ ] Collection `otp_reuniao` criada
- [ ] Relação `sala` configurada corretamente
- [ ] Regras de API definidas
- [ ] 4 salas adicionadas
- [ ] Variável `WEBHOOK_NOTICIAS` configurada
- [ ] Testado o fluxo completo

---

## 📸 Screenshots das Configurações

### Como criar um campo Relation:

1. Clique em "New field"
2. Selecione "Relation"
3. Field name: `sala`
4. Collection: `salas_reuniao`
5. Relation type: `Single relation`
6. ☑ Required
7. Save

### Como criar um campo JSON:

1. Clique em "New field"
2. Selecione "JSON"
3. Field name: `participantes`
4. ☐ Required (não obrigatório)
5. Save

### Como definir regras de API:

1. Vá em "API Rules" na collection
2. Para cada operação (List, View, Create, Update, Delete)
3. Cole a regra correspondente ou deixe vazio
4. Save

---

## ⚡ Comandos Úteis

### Reiniciar o servidor Next.js:
```bash
npm run dev
```

### Ver logs do PocketBase:
Acesse: `https://pocketbase.flecksteel.com.br/_/`

### Testar API manualmente:
```bash
# Listar salas
curl https://pocketbase.flecksteel.com.br/api/collections/salas_reuniao/records

# Listar agendamentos
curl https://pocketbase.flecksteel.com.br/api/collections/agendamento_salas_reuniao/records
```

---

## 🆘 Suporte

Se algo não funcionar:

1. ✅ Verifique se todas as 3 collections foram criadas
2. ✅ Confirme que a relação `sala` está configurada
3. ✅ Veja se as regras de API estão corretas
4. ✅ Teste se o webhook de e-mail funciona
5. ✅ Verifique o console do navegador (F12)
6. ✅ Veja os logs da API no terminal

---

**Tempo estimado de configuração:** 10-15 minutos ⏱️

**Boa sorte! 🚀**
