# 🚀 GUIA RÁPIDO: Novas Funcionalidades dos Banners

## ⚡ 3 Novidades Principais

### 1️⃣ Adicionar Banner
```
[+ Adicionar Banner] → Preencher formulário → Salvar
```
**Resultado:** Banner criado e ativo na Home!

### 2️⃣ Ver Banners Inativos  
```
□ Mostrar inativos → ☑ Mostrar inativos
```
**Resultado:** Todos os banners aparecem (ativos + inativos)

### 3️⃣ Ativar/Desativar Banner
```
[Desativar] → Banner some da Home (mas fica salvo)
[Ativar] → Banner volta pra Home
```
**Resultado:** Controle total de visibilidade!

---

## ➕ COMO ADICIONAR BANNER

### Passo a passo (30 segundos):

1. **Clique** no botão verde **"+ Adicionar Banner"** (canto superior direito)

2. **Preencha** o formulário:
   - **Título** *: "Black Friday 2025"
   - **Descrição** *: "50% de desconto em toda a loja!"
   - **Banner** *: Escolher arquivo → `promo.jpg`

3. **Clique** em **"Adicionar Banner"**

4. **Pronto!** Banner criado e visível na Home ✅

### Validações:
- ⚠️ Todos os campos são obrigatórios (marcados com *)
- ⚠️ Botão "Adicionar" só ativa quando tudo está preenchido
- ✅ Banner criado já vem **ativo** por padrão
- ✅ Ordem automática (vai pro final da lista)

---

## 👁️ COMO VER BANNERS INATIVOS

### Toggle simples:

**Mostrar APENAS ativos (padrão):**
```
□ Mostrar inativos
```
→ Tabela mostra só banners visíveis na Home

**Mostrar TODOS (ativos + inativos):**
```
☑ Mostrar inativos
```
→ Tabela mostra tudo, inativos em opacidade 60%

### Visual:
```
ANTES (só ativos):          DEPOIS (todos):
┌──────────────────┐        ┌──────────────────┐
│ Banner A ✅ Ativo │        │ Banner A ✅ Ativo │
│ Banner C ✅ Ativo │        │ Banner B ❌ Inativo│ ← Apareceu!
└──────────────────┘        │ Banner C ✅ Ativo │
                            └──────────────────┘
```

---

## 🔄 COMO ATIVAR/DESATIVAR BANNER

### Desativar Banner (ocultar da Home):

1. **Localize** o banner ativo na tabela
2. **Clique** no botão **"Desativar"** (cinza)
3. **Confirme** no diálogo
4. **Banner fica inativo:**
   - Some do carousel (preview)
   - Some da Home (usuários não veem)
   - Badge muda pra ❌ "Inativo"
   - Perde ícone ⋮⋮ (não pode reordenar)

### Ativar Banner (mostrar na Home):

1. **Marque** ☑ "Mostrar inativos" (se não estiver)
2. **Localize** banner inativo (opacidade 60%)
3. **Clique** no botão **"Ativar"** (azul)
4. **Banner volta a ficar ativo:**
   - Aparece no carousel
   - Aparece na Home
   - Badge muda pra ✅ "Ativo"
   - Ganha ícone ⋮⋮ (pode reordenar)

---

## 🎨 INTERFACE VISUAL

### Cabeçalho
```
┌──────────────────────────────────────────────────┐
│  Gerenciar Banners                               │
│                    □ Mostrar inativos  [+ Adicionar Banner] │
└──────────────────────────────────────────────────┘
```

### Tabela - Banner Ativo
```
┌────┬──────────┬────────┬─────────┬──────────────────┐
│ ⋮⋮ │ Promo    │ [IMG]  │ ✅ Ativo │ ✏️ Desativar 🗑️  │
└────┴──────────┴────────┴─────────┴──────────────────┘
        ↑           ↑         ↑            ↑
     Arrastar   Preview   Status     Ações
```

### Tabela - Banner Inativo
```
┌────┬──────────┬────────┬──────────┬──────────────────┐
│    │ Antigo   │ [IMG]  │ ❌ Inativo│ ✏️ Ativar   🗑️  │  (opacidade 60%)
└────┴──────────┴────────┴──────────┴──────────────────┘
   Sem grip    Preview    Status        Ações
```

---

## 💡 CASOS DE USO COMUNS

### 📅 Promoção Temporária
```
1. Adicionar banner "Black Friday"
2. Deixar ativo durante promoção
3. Desativar após evento
4. Manter salvo para próximo ano
5. Reativar quando chegar a data
```

### 🧪 Teste A/B
```
1. Criar Banner A (design 1)
2. Ativar → Testar 1 semana
3. Desativar Banner A
4. Criar Banner B (design 2)  
5. Ativar → Testar 1 semana
6. Comparar resultados
7. Manter melhor, excluir outro
```

### 🗓️ Conteúdo Sazonal
```
1. Criar banner "Natal 2025"
2. Desativar (guardar pra dezembro)
3. Em dezembro: Ativar
4. Após natal: Desativar novamente
5. Manter salvo para ano seguinte
```

### 🧹 Limpeza Periódica
```
1. Marcar "Mostrar inativos"
2. Revisar banners antigos
3. Reativar úteis
4. Excluir obsoletos
5. Manter organizado
```

---

## ⚖️ DESATIVAR vs EXCLUIR

### Quando DESATIVAR:
- ✅ Banner sazonal (Natal, Black Friday)
- ✅ Promoção temporária
- ✅ Teste A/B
- ✅ Não tem certeza se vai usar
- ✅ Quer manter como backup

### Quando EXCLUIR:
- ✅ Banner errado/ruim
- ✅ Promoção muito antiga
- ✅ Nunca mais vai usar
- ✅ Já tem versão nova
- ✅ Certeza absoluta

💡 **Dica:** Na dúvida, DESATIVE (pode reverter depois)

---

## 🔄 FLUXOS RÁPIDOS

### Adicionar → Ativar → Desativar → Reativar
```
[+ Adicionar]
     ↓
✅ ATIVO (aparece na Home)
     ↓
[Desativar]
     ↓  
❌ INATIVO (some da Home, mas salvo)
     ↓
[Ativar]
     ↓
✅ ATIVO (volta pra Home)
```

### Filtrar → Gerenciar → Limpar
```
□ Mostrar inativos
     ↓
☑ Mostrar inativos (vê todos)
     ↓
Revisar inativos
     ↓
[Ativar úteis] | [Excluir velhos]
```

---

## ✅ CHECKLIST DE AÇÕES

### Primeira Vez
- [ ] Adicionar primeiro banner de teste
- [ ] Verificar no carousel (preview)
- [ ] Verificar na Home
- [ ] Desativar banner de teste
- [ ] Marcar "Mostrar inativos" pra ver ele
- [ ] Reativar banner de teste

### Uso Diário
- [ ] Adicionar novos banners quando necessário
- [ ] Desativar promoções expiradas
- [ ] Reordenar ativos por prioridade
- [ ] Revisar inativos semanalmente
- [ ] Excluir banners muito antigos

### Manutenção
- [ ] Verificar apenas ativos na Home
- [ ] Testar todos os botões (Editar, Ativar, Excluir)
- [ ] Confirmar drag-and-drop só em ativos
- [ ] Limpar inativos desnecessários mensalmente

---

## 🎯 RESUMO VISUAL

```
┌─────────────────────────────────────────┐
│           AÇÕES DISPONÍVEIS             │
├─────────────────────────────────────────┤
│  [+ Adicionar]  → Criar novo banner     │
│  [✏️ Editar]     → Alterar existente    │
│  [Desativar]    → Ocultar da Home       │
│  [Ativar]       → Mostrar na Home       │
│  [🗑️ Apagar]     → Excluir permanente   │
│  [⋮⋮ Arrastar]   → Reordenar (só ativos)│
│  [☑ Checkbox]   → Ver todos/só ativos   │
└─────────────────────────────────────────┘
```

---

## 🚀 ESTÁ PRONTO!

**3 novas funcionalidades funcionando perfeitamente:**

1. ✅ **Adicionar Banner** - Criar novos facilmente
2. ✅ **Ver Inativos** - Controle total da lista
3. ✅ **Ativar/Desativar** - Soft delete inteligente

**Acesse:** `/admin/dashboard/editar-banners`

**Comece agora:**
1. Clique "+ Adicionar Banner"
2. Crie seu primeiro banner
3. Teste ativar/desativar
4. Veja o resultado na Home!

🎉 **Tudo funcionando!**
