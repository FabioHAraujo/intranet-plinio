# 🧪 TESTE RÁPIDO - Anexo ICS

## Como Testar se o Anexo Funciona

### Opção 1: Via API de Teste (RECOMENDADO)

Execute este comando no terminal ou use um cliente REST (Postman, Insomnia):

```bash
curl -X POST http://localhost:3000/api/testar_anexo_ics \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com"}'
```

Ou no navegador, abra o console (F12) e execute:

```javascript
fetch('/api/testar_anexo_ics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'seu@email.com' })
})
.then(r => r.json())
.then(console.log)
```

### Opção 2: Via Interface (quando implementar)

Crie uma página de teste em `/app/admin/dashboard/testar-anexo/page.tsx`:

```tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TestarAnexoPage() {
  const [email, setEmail] = useState('');
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);

  async function testar() {
    setLoading(true);
    try {
      const res = await fetch('/api/testar_anexo_ics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setResultado(JSON.stringify(data, null, 2));
    } catch (error) {
      setResultado('Erro: ' + error);
    }
    setLoading(false);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Testar Anexo ICS</h1>
      <div className="space-y-4 max-w-md">
        <Input 
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Button onClick={testar} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar E-mail de Teste'}
        </Button>
        {resultado && (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {resultado}
          </pre>
        )}
      </div>
    </div>
  );
}
```

---

## ✅ Checklist de Verificação

Depois de enviar o e-mail de teste, verifique:

### Gmail
- [ ] Recebeu o e-mail?
- [ ] Tem anexo `reuniao.ics`?
- [ ] Aparece botão "Adicionar à agenda"?
- [ ] Ao clicar, abre o Google Calendar?
- [ ] Evento aparece no calendário?

### Outlook
- [ ] Recebeu o e-mail?
- [ ] Tem anexo `reuniao.ics`?
- [ ] Ao clicar no anexo, abre opções?
- [ ] Consegue adicionar ao calendário?
- [ ] Evento aparece no Outlook?

### Outlook.com (Web)
- [ ] Recebeu o e-mail?
- [ ] Vê informações do evento?
- [ ] Tem botão "Aceitar" ou similar?
- [ ] Adiciona ao calendário online?

### Apple Mail
- [ ] Recebeu o e-mail?
- [ ] Convite aparece automaticamente?
- [ ] Consegue aceitar/recusar?
- [ ] Adiciona ao iCloud Calendar?

---

## 🔍 Possíveis Resultados

### ✅ SUCESSO
```
✓ E-mail recebido
✓ Anexo reuniao.ics presente
✓ Conseguiu adicionar à agenda
✓ Evento aparece no calendário
```
**→ Sistema funcionando! Pode usar normalmente.**

### ⚠️ E-MAIL SEM ANEXO
```
✓ E-mail recebido
✗ Sem anexo .ics
```
**→ Webhook não suporta anexos. Veja soluções abaixo.**

### ❌ E-MAIL NÃO CHEGA
```
✗ E-mail não recebido
```
**→ Problema no webhook. Verifique WEBHOOK_NOTICIAS.**

---

## 🔧 Soluções Alternativas

### Se webhook NÃO suporta anexos:

#### Solução 1: Modificar Webhook
Ajuste seu webhook/serviço de e-mail para aceitar anexos.

#### Solução 2: Usar Nodemailer
Crie uma rota que envia e-mail direto via SMTP:

```bash
npm install nodemailer
```

```typescript
// pages/api/enviar_email_smtp.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export default async function handler(req, res) {
  const { email, subject, html, icsContent } = req.body;
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html,
    attachments: [{
      filename: 'reuniao.ics',
      content: icsContent,
      contentType: 'text/calendar; charset=utf-8; method=REQUEST'
    }]
  });
  
  res.json({ success: true });
}
```

#### Solução 3: Link de Download
Salve o ICS em storage e envie link:

```typescript
// Salvar ICS em arquivo público
const icsPath = `/public/ics/${uuid}.ics`;
fs.writeFileSync(icsPath, icsContent);

// No e-mail
message: `
  <a href="${process.env.BASE_URL}/ics/${uuid}.ics" download>
    📅 Baixar Convite (.ics)
  </a>
`
```

---

## 📞 Suporte

### Logs para Debug

Se der erro, verifique:

```bash
# Terminal do Next.js
npm run dev

# Procure por:
📤 Enviando e-mail de teste com anexo ICS...
✅ E-mail de teste enviado com sucesso!
# ou
❌ Erro do webhook: ...
```

### Testar Webhook Manualmente

```bash
curl -X POST $WEBHOOK_NOTICIAS \
  -H "Content-Type: application/json" \
  -d '{
    "sendto": "seu@email.com",
    "subject": "Teste",
    "message": "<h1>Teste</h1>",
    "attachment": {
      "filename": "teste.txt",
      "content": "VGVzdGU=",
      "contentType": "text/plain"
    }
  }'
```

---

## 🎯 Próximos Passos

1. **Execute o teste** usando a API `/api/testar_anexo_ics`
2. **Verifique seu e-mail** (pode demorar alguns segundos)
3. **Teste adicionar à agenda**
4. **Me avise o resultado:**
   - ✅ Funcionou? → Sistema OK!
   - ❌ Não funcionou? → Qual erro apareceu?
   - ⚠️ E-mail sem anexo? → Webhook precisa de ajuste

---

**Boa sorte com o teste! 🚀**
