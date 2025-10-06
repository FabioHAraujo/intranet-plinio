# 🚀 GUIA RÁPIDO: Banners - Editar e Ordenar

## ⚡ START RÁPIDO (3 passos)

### 1️⃣ Adicionar Campo no PocketBase (OBRIGATÓRIO!)

```
1. Acesse: https://pocketbase.flecksteel.com.br/_/
2. Login → Collections → carrocel → Edit
3. New field:
   - Type: Number
   - Name: ordem
   - Default: 0
   - Required: NÃO
4. Save (2x)
```

### 2️⃣ Acessar Página de Gerenciamento

```
URL: /admin/dashboard/editar-banners
```

### 3️⃣ Usar!

**Editar:** Botão azul "Editar" → Alterar → Salvar  
**Excluir:** Botão vermelho "Apagar" → Confirmar  
**Ordenar:** Arrastar linha (ícone ⋮⋮) → Soltar

---

## 🎨 INTERFACE

```
┌─────────────────────────────────────────────────────┐
│                  PREVIEW CAROUSEL                    │
│  [←]  [Banner atual exibido aqui]  [→]              │
│                  ● ○ ○ ○ ○                          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Gerenciar Banners                                  │
├────┬──────────┬─────────────┬─────────┬────────────┤
│ ⋮⋮ │ Título   │ Descrição   │ Banner  │ Ações      │
├────┼──────────┼─────────────┼─────────┼────────────┤
│ ⋮⋮ │ Banner 1 │ Descrição 1 │ [IMG]   │ ✏️  🗑️     │
│ ⋮⋮ │ Banner 2 │ Descrição 2 │ [IMG]   │ ✏️  🗑️     │
│ ⋮⋮ │ Banner 3 │ Descrição 3 │ [IMG]   │ ✏️  🗑️     │
└────┴──────────┴─────────────┴─────────┴────────────┘

Legenda:
⋮⋮ = Arrastar para reordenar
✏️  = Editar
🗑️  = Apagar
```

---

## ✏️ EDITAR BANNER

### Passo a passo:

1. **Clique** no botão azul "Editar" (ícone lápis)
2. **Modal abre** com formulário:
   ```
   ┌─────────────────────────────┐
   │  Editar Banner              │
   ├─────────────────────────────┤
   │  Título: [_______________]  │
   │                             │
   │  Descrição:                 │
   │  [_____________________]    │
   │  [_____________________]    │
   │                             │
   │  Banner: [Escolher arquivo] │
   │                             │
   │  Preview Atual:             │
   │  [████████████████]         │
   │                             │
   │  [Cancelar] [Salvar]        │
   └─────────────────────────────┘
   ```
3. **Altere** o que quiser (título, descrição, imagem)
4. **Clique** em "Salvar Alterações"
5. **Aguarde** loading (botão fica "Salvando...")
6. **Modal fecha** automaticamente
7. **Mudanças** aparecem no preview do carousel

### Dicas:
- 💡 Trocar imagem é **opcional** - se não enviar, mantém a atual
- 💡 Título e descrição podem ser editados sem trocar imagem
- 💡 Preview mostra a imagem que está salva atualmente

---

## 🗑️ EXCLUIR BANNER

### Passo a passo:

1. **Clique** no botão vermelho "Apagar" (ícone lixeira)
2. **Confirme** no diálogo que aparece:
   ```
   ┌───────────────────────────────┐
   │  Tem certeza que deseja       │
   │  excluir este banner?         │
   │                               │
   │  [Cancelar]  [OK]             │
   └───────────────────────────────┘
   ```
3. **Banner sumiu** da tabela imediatamente
4. **Recarregue** a Home para confirmar

### ⚠️ ATENÇÃO:
- Exclusão é **permanente** (não tem undo!)
- Banner sumirá da Home também
- Certifique-se antes de confirmar

---

## 🔄 REORDENAR BANNERS (Drag-and-Drop)

### Passo a passo:

1. **Localize** o banner que quer mover
2. **Clique e segure** no ícone ⋮⋮ (ou em qualquer parte da linha)
3. **Arraste** para cima ou para baixo
   ```
   ANTES:           ARRASTANDO:        DEPOIS:
   
   Banner A         Banner A           Banner C
   Banner B   →     Banner C (50%)  →  Banner A
   Banner C         Banner B           Banner B
   ```
4. **Solte** na posição desejada
5. **Ordem salva** automaticamente (veja console: "Ordem atualizada!")
6. **Recarregue** Home para ver nova ordem

### Dicas:
- 💡 Linha fica **transparente** (50%) enquanto arrasta
- 💡 Outras linhas se **reorganizam** visualmente em tempo real
- 💡 Salvamento é **automático** ao soltar
- 💡 Ordem **persiste** entre reloads

---

## 🎯 ORDEM DE EXIBIÇÃO NA HOME

### Como funciona:

1. **Admin** define ordem arrastando banners
2. **Sistema** salva números 0, 1, 2, 3... no campo `ordem`
3. **Home** busca com `sort: "ordem,-updated"`
4. **Usuários** veem banners na ordem definida

### Exemplo:

```
Admin arrasta:
  Banner C → posição 1 (ordem = 0)
  Banner A → posição 2 (ordem = 1)  
  Banner B → posição 3 (ordem = 2)

Home mostra:
  [Banner C] → [Banner A] → [Banner B]
```

---

## 🔧 TROUBLESHOOTING

### ❌ Drag não funciona
**Solução:** Adicione campo `ordem` no PocketBase!

### ❌ Ordem não persiste
**Solução:** Verifique console (F12) - veja erros ao soltar

### ❌ Home não respeita ordem
**Solução:** Limpe cache (Ctrl+Shift+R)

### ❌ Edição não salva imagem
**Solução:** Comprima imagem (máx 5MB) ou use JPG/PNG

---

## 📊 RESUMO DAS FUNCIONALIDADES

| Função | Como Fazer | Resultado |
|--------|------------|-----------|
| **Editar** | Botão azul → Alterar → Salvar | Banner atualizado |
| **Excluir** | Botão vermelho → Confirmar | Banner removido |
| **Reordenar** | Arrastar ⋮⋮ → Soltar | Ordem salva |

---

## ✅ CHECKLIST DE USO

### Primeira vez (setup):
- [ ] Adicionar campo `ordem` no PocketBase
- [ ] Acessar `/admin/dashboard/editar-banners`
- [ ] Definir ordem inicial dos banners

### Uso diário:
- [ ] Editar banner quando conteúdo mudar
- [ ] Excluir banners desatualizados  
- [ ] Reordenar conforme prioridade

### Verificação:
- [ ] Recarregar admin - ordem persiste?
- [ ] Acessar Home - ordem correta?
- [ ] Testar em mobile - funciona?

---

## 🚀 ESTÁ PRONTO!

**Tudo implementado e funcionando!**

Única coisa que falta:  
🔴 **Adicionar campo `ordem` no PocketBase**

Depois disso, é só usar! 🎉

---

**Dúvidas?** Veja documentação completa:
- `INSTRUCOES_BANNERS_ORDENACAO.md` - Detalhes técnicos
- `RESUMO_FINAL_BANNERS.md` - Visão geral completa
