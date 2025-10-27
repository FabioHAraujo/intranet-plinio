# 🗄️ Setup do PocketBase - Calendário de Salas

## ⚠️ IMPORTANTE: Configurar antes de usar o sistema

---

## 1️⃣ Criar Coleção: `otp_cancelar_reuniao`

### Passo a passo:

1. Acesse: https://pocketbase.flecksteel.com.br/_/
2. Faça login como administrador
3. Vá em **Collections** > **New collection**
4. Nome da coleção: `otp_cancelar_reuniao`
5. Tipo: **Base collection**

### Campos a criar:

| Nome do Campo | Tipo | Configurações |
|--------------|------|---------------|
| `email` | **Text** | Required ✓ |
| `codigo` | **Text** | Required ✓, Min: 6, Max: 6 |
| `evento_id` | **Text** | Required ✓ |
| `expira_em` | **Date** | Required ✓ |
| `usado` | **Bool** | Default: `false` |

### API Rules (Permissões):

```javascript
// List/Search Rule
@request.auth.id != ""

// View Rule  
@request.auth.id != ""

// Create Rule
@request.auth.id != ""

// Update Rule
@request.auth.id != ""

// Delete Rule
@request.auth.id != ""
```

**OU deixe todas as regras vazias para acesso público (mais simples para testar)**

---

## 2️⃣ Atualizar Coleção: `agendamento_salas_reuniao`

### Adicionar novos campos:

1. Acesse a coleção `agendamento_salas_reuniao`
2. Clique em **Edit collection**
3. Adicione os seguintes campos:

| Nome do Campo | Tipo | Configurações |
|--------------|------|---------------|
| `recorrente` | **Bool** | Optional, Default: `false` |
| `recorrencia_tipo` | **Select** | Optional, Values: `diaria`, `semanal`, `mensal` |
| `recorrencia_ate` | **Text** | Optional (formato: YYYY-MM-DD) |
| `evento_pai_id` | **Relation** | Optional, Collection: `agendamento_salas_reuniao`, Single |

---

## 3️⃣ Verificar Coleção: `otp_reuniao`

Certifique-se de que esta coleção já existe com os campos:

| Nome do Campo | Tipo | Configurações |
|--------------|------|---------------|
| `email` | **Text** | Required ✓ |
| `codigo` | **Text** | Required ✓ |
| `expira_em` | **Date** | Required ✓ |
| `usado` | **Bool** | Default: `false` |

---

## 4️⃣ Verificar Coleção: `salas_reuniao`

Certifique-se de que existe:

| Nome do Campo | Tipo | Configurações |
|--------------|------|---------------|
| `nome` | **Text** | Required ✓, Unique ✓ |

---

## 📋 Checklist de Configuração

- [ ] Coleção `otp_cancelar_reuniao` criada
- [ ] Campos da `otp_cancelar_reuniao` configurados
- [ ] Permissões da `otp_cancelar_reuniao` definidas
- [ ] Campo `recorrente` adicionado em `agendamento_salas_reuniao`
- [ ] Campo `recorrencia_tipo` adicionado em `agendamento_salas_reuniao`
- [ ] Campo `recorrencia_ate` adicionado em `agendamento_salas_reuniao`
- [ ] Campo `evento_pai_id` adicionado em `agendamento_salas_reuniao`
- [ ] Coleção `otp_reuniao` verificada
- [ ] Coleção `salas_reuniao` verificada

---

## 🧪 Testar Configuração

### Teste 1: Verificar se a coleção existe

Execute no console do navegador (F12) na página do PocketBase:

```javascript
// Substituir pela sua URL do PocketBase
const pb = new PocketBase('https://pocketbase.flecksteel.com.br');

// Tentar buscar registros
pb.collection('otp_cancelar_reuniao').getList(1, 1)
  .then(() => console.log('✅ Coleção existe!'))
  .catch(err => console.error('❌ Erro:', err));
```

### Teste 2: Criar um registro de teste

```javascript
pb.collection('otp_cancelar_reuniao').create({
  email: 'teste@exemplo.com',
  codigo: '123456',
  evento_id: 'test123',
  expira_em: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  usado: false
}).then(() => console.log('✅ Registro criado!'))
  .catch(err => console.error('❌ Erro:', err));
```

---

## 🔧 Script Alternativo (Se preferir criar via código)

Se você tiver acesso ao servidor PocketBase, pode executar este script:

```go
// migrations/1696800000_add_otp_cancelar.go
package migrations

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db)

		collection := &models.Collection{
			Name:       "otp_cancelar_reuniao",
			Type:       models.CollectionTypeBase,
			ListRule:   nil,
			ViewRule:   nil,
			CreateRule: nil,
			UpdateRule: nil,
			DeleteRule: nil,
			Schema: schema.NewSchema(
				&schema.SchemaField{
					Name:     "email",
					Type:     schema.FieldTypeText,
					Required: true,
				},
				&schema.SchemaField{
					Name:     "codigo",
					Type:     schema.FieldTypeText,
					Required: true,
				},
				&schema.SchemaField{
					Name:     "evento_id",
					Type:     schema.FieldTypeText,
					Required: true,
				},
				&schema.SchemaField{
					Name:     "expira_em",
					Type:     schema.FieldTypeDate,
					Required: true,
				},
				&schema.SchemaField{
					Name:    "usado",
					Type:    schema.FieldTypeBool,
					Required: false,
				},
			),
		}

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db)
		collection, _ := dao.FindCollectionByNameOrId("otp_cancelar_reuniao")
		return dao.DeleteCollection(collection)
	})
}
```

---

## ❓ Problemas Comuns

### Erro: "Something went wrong while processing your request"

**Causa:** Coleção não existe ou nome está incorreto

**Solução:** 
1. Verifique o nome exato da coleção no PocketBase
2. Certifique-se de que está escrito `otp_cancelar_reuniao` (com underline, não hífen)

### Erro: "Failed to create record"

**Causa:** Algum campo obrigatório está faltando

**Solução:**
1. Verifique se todos os campos `Required` foram preenchidos
2. Verifique se os tipos de dados estão corretos

### Erro: 403 Forbidden

**Causa:** Permissões da coleção muito restritivas

**Solução:**
1. Vá em **API Rules** da coleção
2. Deixe todos os campos vazios temporariamente (para teste)
3. Ou configure regras apropriadas

---

## 📸 Screenshots de Referência

### Como deve ficar a coleção `otp_cancelar_reuniao`:

```
┌──────────────────────────────────────────────────────────┐
│ otp_cancelar_reuniao                           [Edit]    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ email          Text      Required ✓                      │
│ codigo         Text      Required ✓  (min: 6, max: 6)   │
│ evento_id      Text      Required ✓                      │
│ expira_em      Date      Required ✓                      │
│ usado          Bool      Default: false                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 Após Configurar

Execute este teste para garantir que tudo está funcionando:

1. Vá em: http://localhost:3000/calendario-salas
2. Clique em um evento qualquer
3. Clique em **Cancelar**
4. Verifique se o modal abre
5. Clique em **Enviar código**
6. Verifique seu e-mail
7. Digite o código recebido
8. Confirme o cancelamento

Se tudo estiver OK, você verá:
- ✅ Modal de confirmação
- ✅ E-mail com código OTP
- ✅ Evento cancelado com sucesso
- ✅ Notificação enviada aos participantes

---

**Dúvidas?** Entre em contato ou consulte a documentação do PocketBase: https://pocketbase.io/docs/
