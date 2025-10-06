# Sistema de Edição e Ordenação de Banners

## 🎯 Funcionalidades Implementadas

### 1. Edição de Banners ✅
- Modal de edição com campos para **título**, **descrição** e **imagem**
- Preview da imagem atual durante a edição
- Upload de nova imagem (opcional - se não enviar, mantém a atual)
- Validação e feedback visual

### 2. Exclusão de Banners ✅
- Confirmação antes de excluir
- Remoção imediata da lista após exclusão
- Tratamento de erros

### 3. Ordenação Drag-and-Drop ✅
- **Arraste** as linhas da tabela para cima ou para baixo
- Ícone de "grip" (⋮⋮) indica que a linha é arrastável
- Feedback visual durante o arraste (opacidade 50%)
- Ordem salva automaticamente no PocketBase ao soltar

## 📋 Configuração Necessária no PocketBase

### Adicionar campo `ordem` à coleção `carrocel`

Acesse seu PocketBase Admin em: https://pocketbase.flecksteel.com.br/_/

1. Vá em **Collections** → **carrocel**
2. Clique em **Edit**
3. Adicione um novo campo:
   - **Type:** Number
   - **Name:** `ordem`
   - **Min:** 0
   - **Required:** Não (deixe desmarcado)
   - **Default value:** 0

4. Salve as alterações

### Schema da Coleção (após atualização)

```typescript
carrocel {
  id: string
  titulo: string
  descricao: string
  banner: file
  ativo: boolean
  ordem: number  // ← NOVO CAMPO
  created: datetime
  updated: datetime
}
```

## 🔄 Como Funciona a Ordenação

### Frontend (`editar-banners/page.tsx`)
1. **Fetch inicial:** Busca banners ordenados por `ordem,-updated` (ordem crescente, depois mais recentes)
2. **Drag & Drop:** Usa eventos HTML5 nativos (`onDragStart`, `onDragOver`, `onDragEnd`)
3. **Salvar ordem:** Ao soltar o item, atualiza TODOS os banners com novos valores de `ordem` (0, 1, 2, 3...)

```typescript
// Ordenação atual
sort: "ordem,-updated"

// Ao arrastar e soltar
const updates = carouselData.map((banner, index) => 
  pb.collection("carrocel").update(banner.id, { ordem: index })
);
await Promise.all(updates);
```

### Home Page (`app/components/Home/page.tsx`)
Atualmente usa `-updated` (mais recentes primeiro). **Precisa ser atualizado!**

## ✏️ Atualização Necessária na Home Page

Modifique `/app/components/Home/page.tsx` para usar o campo `ordem`:

```typescript
// ANTES (linha ~39)
const records = await pb.collection("carrocel").getFullList({
  filter: "ativo = true",
  sort: "-updated",  // ← Ordenação antiga
});

// DEPOIS
const records = await pb.collection("carrocel").getFullList({
  filter: "ativo = true",
  sort: "ordem,-updated",  // ← Nova ordenação (ordem definida pelo admin)
});
```

## 🎨 Interface Visual

### Tabela de Gerenciamento
- **Coluna 1:** Ícone de grip (⋮⋮) - indica item arrastável
- **Coluna 2:** Título do banner
- **Coluna 3:** Descrição
- **Coluna 4:** Preview da imagem (miniatura 16:9)
- **Coluna 5:** Botões "Editar" e "Apagar"

### Estados Visuais
- **Normal:** Cursor `move`, linha inteira arrastável
- **Arrastando:** Opacidade 50% no item sendo arrastado
- **Edição:** Modal com formulário completo + preview
- **Exclusão:** Diálogo de confirmação nativo do navegador

## 🔧 Funções Principais

### `handleEditClick(banner)`
Abre modal de edição com dados do banner selecionado

### `handleSaveEdit()`
- Cria FormData com titulo, descricao e banner (se houver)
- Atualiza no PocketBase
- Recarrega lista atualizada
- Fecha modal

### `handleDeleteClick(id)`
- Confirma exclusão
- Remove do PocketBase
- Atualiza estado local (remove da lista)

### `handleDragStart(index)` / `handleDragOver(e, index)` / `handleDragEnd()`
- **DragStart:** Marca índice do item sendo arrastado
- **DragOver:** Reordena array localmente (feedback visual)
- **DragEnd:** Salva nova ordem no PocketBase

## 📊 Fluxo de Dados

```
1. Usuário arrasta banner da posição 3 para posição 1
   ↓
2. handleDragOver reorganiza array local (visual imediato)
   ↓
3. handleDragEnd dispara ao soltar
   ↓
4. Atualiza TODOS os banners com ordem 0,1,2,3... sequencial
   ↓
5. PocketBase salva nova ordem
   ↓
6. Home page mostra banners na ordem definida pelo admin
```

## 🚀 Testando

### 1. Adicione o campo `ordem` no PocketBase (obrigatório!)

### 2. Acesse a página de edição
```
/admin/dashboard/editar-banners
```

### 3. Teste Drag-and-Drop
- Arraste um banner para cima ou para baixo
- Solte e verifique se a ordem se mantém ao recarregar

### 4. Teste Edição
- Clique em "Editar"
- Altere título/descrição
- Envie nova imagem (ou mantenha a atual)
- Salve e verifique mudanças

### 5. Teste Exclusão
- Clique em "Apagar"
- Confirme exclusão
- Verifique se banner sumiu

### 6. Atualize Home e teste ordenação
- Mude `sort` em Home/page.tsx para `"ordem,-updated"`
- Verifique se banners aparecem na ordem definida no admin

## 📝 Notas Importantes

1. **Campo ordem é obrigatório:** Sem ele, a ordenação não funciona
2. **Sort com fallback:** `ordem,-updated` garante que banners sem ordem definida apareçam por data
3. **Ordem numérica sequencial:** 0, 1, 2, 3... (permite inserções futuras entre posições)
4. **Atualização em lote:** Usa `Promise.all()` para salvar todas as ordens simultaneamente
5. **Estado local + PocketBase:** Interface atualiza imediatamente, PocketBase sincroniza depois

## 🐛 Troubleshooting

### Drag não funciona
- Verifique se `draggable` está na `<TableRow>`
- Confirme que eventos `onDrag*` estão configurados

### Ordem não persiste
- Verifique se campo `ordem` existe no PocketBase
- Confira console do navegador para erros de update
- Teste permissões da coleção (admin deve poder atualizar)

### Home não respeita ordem
- Certifique-se de atualizar o `sort` em Home/page.tsx
- Limpe cache do navegador
- Verifique se banners têm valores de `ordem` definidos

## 💡 Melhorias Futuras (opcionais)

- [ ] Biblioteca @dnd-kit para drag-and-drop mais robusto
- [ ] Animações suaves ao reordenar
- [ ] Indicador visual de "drop zone"
- [ ] Undo/Redo para mudanças de ordem
- [ ] Bulk edit (editar múltiplos banners)
- [ ] Botão "Adicionar Novo Banner"
