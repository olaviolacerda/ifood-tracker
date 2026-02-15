# 🍔 iFood Tracker

Um aplicativo moderno para rastrear seus pedidos de delivery e analisar seus gastos.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38bdf8)

## ✨ Funcionalidades

- 📊 **Dashboard Completo**: Visualize estatísticas semanais e mensais
- 💰 **Controle de Gastos**: Acompanhe quanto você gasta com delivery
- 📈 **Gráficos Interativos**: Veja a evolução dos seus gastos
- 🏷️ **Categorização**: Organize seus pedidos por tipo de comida
- 🔥 **Sincronização em Tempo Real**: Dados salvos no Firebase
- 📱 **Design Responsivo**: Interface otimizada para mobile
- 🌓 **Tema Escuro/Claro**: Suporte a temas

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Firebase (gratuita)

### Instalação

1. **Clone o repositório**

```bash
git clone <seu-repositorio>
cd ifood-tracker
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure o Firebase**

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite .env.local com suas credenciais do Firebase
```

> 📖 Siga o guia completo em [QUICKSTART.md](./QUICKSTART.md)

4. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

5. **Abra no navegador**

```
http://localhost:3000
```

## 📚 Documentação

- [**QUICKSTART.md**](./QUICKSTART.md) - Guia rápido de configuração (5 min)
- [**FIREBASE_SETUP.md**](./FIREBASE_SETUP.md) - Setup detalhado do Firebase
- [**CHANGES.md**](./CHANGES.md) - Log de alterações e arquitetura

## 🏗️ Tecnologias

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TailwindCSS 4
- **Banco de Dados**: Firebase Firestore
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Datas**: date-fns
- **Linguagem**: TypeScript

## 📁 Estrutura do Projeto

```
ifood-tracker/
├── app/                    # App Router (Next.js 16)
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout global
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── add-purchase-modal.tsx
│   ├── header.tsx
│   ├── purchase-card.tsx
│   ├── purchase-list.tsx
│   ├── stats-modal.tsx
│   ├── stats-overview.tsx
│   └── weekly-summary.tsx
├── hooks/                 # Custom Hooks
│   └── usePurchases.ts   # Hook para gerenciar compras
├── lib/                   # Utilitários e configurações
│   ├── firebase.ts       # Cliente Firebase
│   └── stats.ts          # Funções de cálculo
├── types/                 # TypeScript types
│   └── purchase.ts       # Interfaces de dados
└── public/               # Arquivos estáticos
```

## 🎯 Como Usar

### Cadastrar uma Compra

1. Clique no botão "Cadastrar Compra"
2. Preencha os dados do pedido:
   - Nome do prato
   - Restaurante
   - Valor pago
   - Data e hora
   - Categoria
3. Clique em "Salvar Pedido"

### Visualizar Estatísticas

1. Clique em "Ver Estatísticas" na seção "Resumo do Mês"
2. Explore os gráficos:
   - Gasto por Semana
   - Evolução Mensal
   - Categorias Mais Pedidas

### Acompanhar Gastos

- **Resumo da Semana**: Veja quanto gastou na semana atual
- **Resumo do Mês**: Total gasto e número de pedidos
- **Histórico**: Lista de todas as suas compras

## 🔐 Segurança

⚠️ **IMPORTANTE**: Este projeto está configurado para desenvolvimento com regras permissivas no Firestore.

Para produção, você deve:

1. Implementar autenticação (Firebase Auth)
2. Configurar regras de segurança apropriadas
3. Validar dados no servidor

Veja [FIREBASE_SETUP.md](./FIREBASE_SETUP.md#6-regras-de-segurança-produção) para mais detalhes.

## 📊 Modelo de Dados

```typescript
interface Purchase {
  id: string;
  dish: string; // Nome do prato
  restaurant: string; // Nome do restaurante
  valuePaid: number; // Valor pago
  valueTotal?: number; // Valor total (opcional)
  date: string; // Data (YYYY-MM-DD)
  time: string; // Hora (HH:MM)
  category: string; // Categoria
  isEvent: boolean; // Pedido em evento?
  isAlone: boolean; // Estava sozinho?
  createdAt: number; // Timestamp
}
```

## 🎨 Categorias

- 🍔 Fast Food
- 🍣 Japonesa
- 🥗 Saudável
- 🍰 Sobremesa
- 🥤 Bebidas
- 🍽️ Outras

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm run start

# Lint
npm run lint
```

## 🐛 Solução de Problemas

### Firebase não conecta

1. Verifique se `.env.local` está configurado corretamente
2. Reinicie o servidor (`npm run dev`)
3. Verifique as regras do Firestore

### Dados não aparecem

1. Verifique o console do navegador (F12)
2. Confirme que há dados no Firestore
3. Verifique a conexão com internet

Para mais detalhes, veja [QUICKSTART.md](./QUICKSTART.md#-solução-de-problemas)

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático! ✨

### Outras plataformas

- Netlify
- Railway
- Render
- Firebase Hosting

> **Importante**: Configure as variáveis de ambiente em cada plataforma

## 📈 Melhorias Futuras

- [ ] Autenticação de usuários
- [ ] Editar compras
- [ ] Deletar compras
- [ ] Filtros avançados
- [ ] Exportar relatórios
- [ ] Notificações
- [ ] Metas de gastos
- [ ] Compartilhar estatísticas

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 📝 Licença

Este projeto é de código aberto para fins educacionais.

## 👤 Autor

Desenvolvido com ❤️ por Olavio Lacerda + Copilot.

---

**Nota**: Este projeto foi criado para fins educacionais e de demonstração.
