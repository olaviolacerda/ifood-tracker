# 💡 Sistema de Insights Inteligentes

## Regras Implementadas

O sistema analisa seus pedidos e gera insights baseados nas seguintes regras:

### 📊 Limites por Semana

1. **Limite Total de Pedidos: 3 por semana**

   - Você pode fazer no máximo 3 pedidos por semana
   - Alertas:
     - 🚨 **Crítico**: Quando atingir 3 pedidos
     - ⚠️ **Aviso**: Quando chegar a 2 pedidos (penúltimo)

2. **Limite de Pedidos Sozinho: 1 por semana**

   - Apenas 1 pedido sozinho é permitido por semana
   - Os outros 2 devem ser acompanhados
   - 🚫 Alerta quando o limite for atingido

3. **Limite de Fast Food no Almoço: 1 por semana**
   - Apenas 1 fast food no horário de almoço (11h-15h)
   - 🍔 Aviso quando o limite for atingido

### 💰 Controle de Gastos

- **Alerta de Gastos Altos**
  - 💸 Aviso quando gastar mais de R$ 100,00 na semana

### ✅ Insights Positivos

- **Semana Impecável**: Quando não fez nenhum pedido
- **Comportamento Saudável**: Quando todos os pedidos foram acompanhados
- **Status da Semana**: Resumo de quantos pedidos restam

## Como Funciona

### Cálculo da Semana

- A semana começa no **domingo** e termina no **sábado**
- Os insights são calculados em tempo real

### Categorização

- **Fast Food**: Categorias que contém "fast food", "fastfood" ou "fast-food" no nome
- **Horário de Almoço**: Das 11h às 15h

### Tipos de Insights

1. **Sucesso** (Verde 💚)

   - Comportamento positivo
   - Parabenizações

2. **Info** (Azul 📊)

   - Informações neutras
   - Status da semana

3. **Aviso** (Amarelo ⚠️)

   - Atenção necessária
   - Limite se aproximando

4. **Crítico** (Vermelho 🚨)
   - Limite atingido
   - Ação necessária

## Exemplos de Insights

### 🎉 Positivos

```
✨ Semana impecável!
Você ainda não pediu delivery esta semana. Continue assim!
```

```
💚 Você está indo bem!
2 pedidos esta semana, todos acompanhados. Ótima escolha! 👏
```

### ⚠️ Avisos

```
⚠️ Penúltimo pedido da semana
Você fez 2 de 3 pedidos permitidos. Só mais 1 esta semana! 🎯
```

```
🍔 Fast food no almoço já foi!
Você já comeu fast food no almoço 1x esta semana. Que tal algo mais saudável? 🥗
```

### 🚨 Críticos

```
🚨 Limite da semana atingido!
Você já fez 3 pedidos esta semana. Que tal cozinhar ou preparar uma marmita? 🥘
```

```
🚫 Limite de pedidos sozinho atingido
Você já pediu sozinho 1x esta semana. Próximos pedidos devem ser acompanhados! 👥
```

## Personalização

Para ajustar os limites, edite o arquivo `lib/insights.ts`:

```typescript
const LIMITS = {
  MAX_ORDERS_PER_WEEK: 3, // Total de pedidos
  MAX_ALONE_ORDERS_PER_WEEK: 1, // Pedidos sozinho
  MAX_FASTFOOD_LUNCH_PER_WEEK: 1, // Fast food no almoço
};
```

Para ajustar o limite de gastos ou horário de almoço, edite as funções correspondentes no mesmo arquivo.
