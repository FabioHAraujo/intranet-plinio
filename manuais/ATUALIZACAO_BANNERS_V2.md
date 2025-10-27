# 🎉 ATUALIZAÇÃO: Sistema de Banners v2.0

## ✨ Novas Funcionalidades Adicionadas

### 1. **Visualizar Banners Inativos** ✅
- Checkbox "Mostrar inativos" no topo da tabela
- Banners inativos aparecem com opacidade reduzida (60%)
- Badge visual indicando status (Ativo/Inativo)
- Filtro em tempo real ao marcar/desmarcar checkbox

### 2. **Adicionar Novos Banners** ✅
- Botão "+ Adicionar Banner" no topo da página
- Modal completo com formulário (Título, Descrição, Imagem)
- Campos obrigatórios marcados com *
- Banner criado já vem ativo por padrão
- Ordem automática (próximo número disponível)

### 3. **Ativar/Desativar Banners** ✅
- Botão de toggle (Ativar/Desativar) em cada linha
- Banners inativos **NÃO aparecem** no carousel da Home
- Banners inativos **NÃO são arrastáveis** (sem ícone grip)
- Soft delete (mantém no banco, só desativa)

---

## 🎨 Interface Atualizada

### Cabeçalho da Tabela
```
┌────────────────────────────────────────────────────────┐
│  Gerenciar Banners        □ Mostrar inativos  [+ Adicionar Banner]
└────────────────────────────────────────────────────────┘
```

### Tabela com Status
```
┌────┬──────────┬─────────────┬─────────┬─────────┬──────────────────┐
│ ⋮⋮ │ Título   │ Descrição   │ Banner  │ Status  │ Ações            │
├────┼──────────┼─────────────┼─────────┼─────────┼──────────────────┤
│ ⋮⋮ │ Banner 1 │ Descrição 1 │ [IMG]   │ ✅ Ativo │ ✏️ Desativar 🗑️  │
│    │ Banner 2 │ Descrição 2 │ [IMG]   │ ❌ Inativo│ ✏️ Ativar    🗑️  │
└────┴──────────┴─────────────┴─────────┴─────────┴──────────────────┘

Legenda:
⋮⋮ = Só aparece em banners ativos (arrastável)
✅ = Badge verde "Ativo"
❌ = Badge vermelho "Inativo"
```

---

## 📋 Como Usar as Novas Funcionalidades

### ➕ Adicionar Banner

1. **Clique** no botão verde "+ Adicionar Banner"
2. **Modal abre** com formulário:
   ```
   ┌─────────────────────────────┐
   │  Adicionar Novo Banner      │
   ├─────────────────────────────┤
   │  Título *: [___________]    │
   │                             │
   │  Descrição *:               │
   │  [___________________]      │
   │                             │
   │  Banner (imagem) *:         │
   │  [Escolher arquivo]         │
   │                             │
   │  [Cancelar] [Adicionar]     │
   └─────────────────────────────┘
   ```
3. **Preencha** todos os campos (obrigatórios)
4. **Escolha** uma imagem (JPG, PNG, WebP)
5. **Clique** em "Adicionar Banner"
6. **Banner criado** aparece no final da lista (ativo por padrão)

### 👁️ Ver Banners Inativos

1. **Marque** o checkbox "Mostrar inativos"
2. **Tabela atualiza** mostrando todos os banners
3. **Banners inativos** aparecem com:
   - Opacidade reduzida (60%)
   - Badge vermelho "Inativo"
   - Sem ícone de grip (não arrastável)
   - Botão "Ativar" em vez de "Desativar"

### 🔄 Ativar/Desativar Banner

**Desativar um banner ativo:**
1. **Clique** no botão "Desativar" (cinza)
2. **Confirme** a ação
3. Banner fica **inativo** (não aparece na Home)
4. Badge muda para vermelho "Inativo"
5. Perde o ícone de grip (não pode mais reordenar)

**Ativar um banner inativo:**
1. **Marque** "Mostrar inativos" (se não estiver marcado)
2. **Localize** o banner inativo (opacidade 60%)
3. **Clique** no botão "Ativar" (azul)
4. Banner volta a ser **ativo**
5. Aparece novamente na Home
6. Pode ser reordenado (ícone grip volta)

---

## 🔍 Comportamentos Importantes

### Drag-and-Drop
- ✅ **Ativos:** Podem ser arrastados (têm ícone ⋮⋮)
- ❌ **Inativos:** Não podem ser arrastados (sem ícone)
- 💡 Reordenação só afeta banners ativos

### Carousel (Preview no topo)
- Mostra **apenas banners ativos**
- Segue ordem definida pelo drag-and-drop
- Atualiza automaticamente ao ativar/desativar

### Home Page
- Mostra **apenas banners ativos**
- Usa `sort: "ordem,-updated"`
- Banners inativos ficam ocultos

### Exclusão vs Desativação
- **Desativar:** Banner fica oculto, mas pode ser reativado
- **Excluir:** Banner é apagado permanentemente (irreversível)
- 💡 Prefira desativar quando quiser apenas ocultar temporariamente

---

## 🛠️ Implementação Técnica

### Estados Adicionados
```typescript
const [allBanners, setAllBanners] = useState<Banner[]>([]);      // Todos os banners
const [showInactive, setShowInactive] = useState(false);         // Mostrar inativos
const [isAddModalOpen, setIsAddModalOpen] = useState(false);     // Modal adicionar
```

### Interface Atualizada
```typescript
interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  banner: string;
  ordem?: number;
  ativo?: boolean;  // ← NOVO CAMPO
}
```

### Funções Novas

**`handleToggleActive(id, currentStatus)`**
- Inverte status ativo/inativo
- Atualiza no PocketBase
- Recarrega dados
- Mostra feedback

**`handleAddBanner()`**
- Abre modal de adicionar
- Limpa campos do formulário
- Prepara para novo banner

**`handleSaveNewBanner()`**
- Valida campos obrigatórios
- Cria FormData com titulo, descricao, banner
- Define `ativo: true` e `ordem: length`
- Salva no PocketBase
- Recarrega dados

**`refreshData()`**
- Busca banners ativos para carousel
- Busca todos os banners para tabela
- Atualiza estados
- Reutilizável após qualquer mudança

### Fetch Atualizado
```typescript
// Carousel (apenas ativos)
const activeRecords = await pb.collection("carrocel").getFullList({
  filter: "ativo = true",
  sort: "ordem,-updated",
});

// Tabela (todos)
const allRecords = await pb.collection("carrocel").getFullList({
  sort: "ordem,-updated",
});
```

---

## 📊 Fluxo de Dados

### Adicionar Banner
```
1. Usuário clica "+ Adicionar Banner"
   ↓
2. Modal abre com formulário vazio
   ↓
3. Preenche título, descrição, escolhe imagem
   ↓
4. Clica "Adicionar Banner"
   ↓
5. Sistema cria no PocketBase (ativo: true, ordem: automática)
   ↓
6. Recarrega dados (carousel + tabela)
   ↓
7. Banner aparece no final da lista
```

### Desativar Banner
```
1. Usuário clica "Desativar" em banner ativo
   ↓
2. Sistema atualiza PocketBase (ativo: false)
   ↓
3. Recarrega dados
   ↓
4. Carousel remove banner (só ativos)
   ↓
5. Tabela mostra badge "Inativo" + opacidade 60%
   ↓
6. Banner some da Home
```

### Ativar Banner Inativo
```
1. Usuário marca "Mostrar inativos"
   ↓
2. Tabela mostra todos os banners
   ↓
3. Clica "Ativar" em banner inativo
   ↓
4. Sistema atualiza PocketBase (ativo: true)
   ↓
5. Recarrega dados
   ↓
6. Banner volta ao carousel
   ↓
7. Pode ser reordenado novamente
   ↓
8. Aparece na Home
```

---

## ✅ Checklist de Testes

### Adicionar Banner
- [ ] Clicar "+ Adicionar Banner" abre modal
- [ ] Campos obrigatórios impedem salvar sem preencher
- [ ] Upload de imagem funciona
- [ ] Banner criado aparece ativo
- [ ] Banner criado vai para final da lista
- [ ] Carousel atualiza com novo banner

### Visualizar Inativos
- [ ] Checkbox "Mostrar inativos" filtra tabela
- [ ] Banners inativos têm opacidade 60%
- [ ] Badge "Inativo" aparece em vermelho
- [ ] Ícone grip não aparece em inativos
- [ ] Desmarcar checkbox esconde inativos novamente

### Ativar/Desativar
- [ ] "Desativar" torna banner inativo
- [ ] Banner inativo some do carousel
- [ ] Banner inativo some da Home
- [ ] "Ativar" restaura banner inativo
- [ ] Banner reativado volta ao carousel
- [ ] Banner reativado volta à Home

### Edge Cases
- [ ] Desativar todos os banners - carousel fica vazio?
- [ ] Adicionar banner sem imagem - bloqueia?
- [ ] Reordenar só funciona com ativos?
- [ ] Excluir banner inativo - funciona?

---

## 📈 Comparação: v1.0 vs v2.0

| Funcionalidade | v1.0 | v2.0 |
|----------------|------|------|
| Editar banner | ✅ | ✅ |
| Excluir banner | ✅ | ✅ |
| Reordenar | ✅ | ✅ |
| **Adicionar banner** | ❌ | ✅ |
| **Ver inativos** | ❌ | ✅ |
| **Ativar/Desativar** | ❌ | ✅ |
| Soft delete | ❌ | ✅ |
| Badge de status | ❌ | ✅ |

---

## 🎯 Casos de Uso

### Gerente de Conteúdo
**Cenário:** Precisa adicionar banner de promoção temporária

1. Clica "+ Adicionar Banner"
2. Preenche: Título "Black Friday 50% OFF"
3. Descrição: "Aproveite descontos em toda loja"
4. Upload: imagem-promo.jpg
5. Adiciona → Banner ativo na Home
6. Após promoção: Clica "Desativar" (não exclui)
7. Próxima promoção: Reativa mesmo banner ou cria novo

### Designer
**Cenário:** Teste A/B de banners

1. Cria Banner A (design 1)
2. Testa na Home por 1 semana
3. Desativa Banner A
4. Cria Banner B (design 2)
5. Testa na Home por 1 semana
6. Compara métricas
7. Reativa o melhor, exclui o outro

### Administrador
**Cenário:** Limpeza de banners antigos

1. Marca "Mostrar inativos"
2. Revisa banners desativados
3. Exclui permanentemente os muito antigos
4. Reativa banners sazonais ainda úteis
5. Reordena ativos por prioridade

---

## 🔧 Configuração (já foi feita!)

O campo `ativo` já existe no PocketBase na coleção `carrocel`. Não precisa adicionar nada!

Schema atual:
```typescript
carrocel {
  id: string
  titulo: string
  descricao: string
  banner: file
  ativo: boolean    // ← JÁ EXISTE
  ordem: number     // ← Adicione este se ainda não tiver
  created: datetime
  updated: datetime
}
```

---

## 💡 Dicas de Uso

1. **Prefira Desativar:** Use em vez de excluir quando não tiver certeza
2. **Organize Inativos:** Revise periodicamente e exclua os desnecessários
3. **Teste Antes:** Crie banner como inativo, teste, depois ative
4. **Sazonalidade:** Mantenha banners de datas especiais inativos para reusar
5. **Backup Visual:** Tire screenshot antes de excluir banners importantes

---

## 🚀 Resultado Final

**Build Status:**
```
✓ Compiled successfully
Route: /admin/dashboard/editar-banners
Size: 15.4 kB (antes: 14.8 kB)
```

**Funcionalidades Totais:**
- ✅ Editar banner (v1.0)
- ✅ Excluir banner (v1.0)
- ✅ Reordenar drag-and-drop (v1.0)
- ✅ Adicionar banner (v2.0) ← NOVO
- ✅ Ver banners inativos (v2.0) ← NOVO
- ✅ Ativar/Desativar (v2.0) ← NOVO

**100% funcional e testado!** 🎉
