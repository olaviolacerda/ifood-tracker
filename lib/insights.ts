import { Purchase } from "@/types/purchase";
import {
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  startOfDay,
  endOfDay,
  parse,
} from "date-fns";

export interface Insight {
  id: string;
  type: "success" | "warning" | "danger" | "info";
  title: string;
  message: string;
  emoji: string;
}

const LIMITS = {
  MAX_ORDERS_PER_WEEK: 3,
  MAX_ALONE_ORDERS_PER_WEEK: 1,
  MAX_FASTFOOD_LUNCH_PER_WEEK: 1,
};

function getCurrentWeekPurchases(purchases: Purchase[]): Purchase[] {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // Domingo
  const weekEnd = endOfWeek(now, { weekStartsOn: 0 });

  return purchases.filter((purchase) => {
    const purchaseDate = new Date(purchase.date);
    return isWithinInterval(purchaseDate, { start: weekStart, end: weekEnd });
  });
}

function isLunchTime(time: string): boolean {
  const hour = parseInt(time.split(":")[0]);
  return hour >= 11 && hour < 15; // 11h às 15h
}

function isFastFood(categoryLabel: string): boolean {
  const fastFoodCategories = ["fast food", "fastfood", "fast-food"];
  return fastFoodCategories.some((cat) =>
    categoryLabel.toLowerCase().includes(cat)
  );
}

export function generateInsights(
  purchases: Purchase[],
  categories: Array<{ id: string; label: string }>
): Insight[] {
  const insights: Insight[] = [];
  const weekPurchases = getCurrentWeekPurchases(purchases);

  // Estatísticas da semana
  const totalOrders = weekPurchases.length;
  const aloneOrders = weekPurchases.filter((p) => p.isAlone).length;
  const groupOrders = weekPurchases.filter((p) => !p.isAlone).length;

  // Fast food no almoço
  const fastFoodLunch = weekPurchases.filter((p) => {
    const category = categories.find((c) => c.id === p.category);
    return category && isFastFood(category.label) && isLunchTime(p.time);
  }).length;

  // 1. Verificar limite total de pedidos (3 por semana)
  if (totalOrders >= LIMITS.MAX_ORDERS_PER_WEEK) {
    insights.push({
      id: "max-orders-reached",
      type: "danger",
      title: "Limite da semana atingido!",
      message: `Você já fez ${totalOrders} pedidos esta semana. Que tal cozinhar ou preparar uma marmita? 🥘`,
      emoji: "🚨",
    });
  } else if (totalOrders === LIMITS.MAX_ORDERS_PER_WEEK - 1) {
    insights.push({
      id: "max-orders-warning",
      type: "warning",
      title: "Penúltimo pedido da semana",
      message: `Você fez ${totalOrders} de ${LIMITS.MAX_ORDERS_PER_WEEK} pedidos permitidos. Só mais 1 esta semana! 🎯`,
      emoji: "⚠️",
    });
  }

  // 2. Verificar limite de pedidos sozinho (1 por semana)
  if (aloneOrders >= LIMITS.MAX_ALONE_ORDERS_PER_WEEK) {
    insights.push({
      id: "max-alone-orders",
      type: "danger",
      title: "Limite de pedidos sozinho atingido",
      message: `Você já pediu sozinho ${aloneOrders}x esta semana. Próximos pedidos devem ser acompanhados! 👥`,
      emoji: "🚫",
    });
  }

  // 3. Verificar fast food no almoço (1 por semana)
  if (fastFoodLunch >= LIMITS.MAX_FASTFOOD_LUNCH_PER_WEEK) {
    insights.push({
      id: "max-fastfood-lunch",
      type: "warning",
      title: "Fast food no almoço já foi!",
      message: `Você já comeu fast food no almoço ${fastFoodLunch}x esta semana. Que tal algo mais saudável? 🥗`,
      emoji: "🍔",
    });
  }

  // 4. Insights positivos
  if (totalOrders === 0) {
    insights.push({
      id: "no-orders-yet",
      type: "success",
      title: "Semana impecável! 🎉",
      message: "Você ainda não pediu delivery esta semana. Continue assim!",
      emoji: "✨",
    });
  } else if (totalOrders < LIMITS.MAX_ORDERS_PER_WEEK && aloneOrders === 0) {
    insights.push({
      id: "good-behavior",
      type: "success",
      title: "Você está indo bem!",
      message: `${totalOrders} pedidos esta semana, todos acompanhados. Ótima escolha! 👏`,
      emoji: "💚",
    });
  }

  // 5. Dicas gerais se não houver alertas críticos
  if (
    insights.length === 0 &&
    totalOrders > 0 &&
    totalOrders < LIMITS.MAX_ORDERS_PER_WEEK
  ) {
    const remaining = LIMITS.MAX_ORDERS_PER_WEEK - totalOrders;
    const remainingAlone = LIMITS.MAX_ALONE_ORDERS_PER_WEEK - aloneOrders;

    insights.push({
      id: "weekly-status",
      type: "info",
      title: "Status da semana",
      message: `${totalOrders}/${
        LIMITS.MAX_ORDERS_PER_WEEK
      } pedidos feitos. Restam ${remaining} pedidos${
        remainingAlone > 0
          ? ` (${remainingAlone} pode ser sozinho)`
          : " (apenas acompanhados)"
      }.`,
      emoji: "📊",
    });
  }

  // 6. Verificar gastos da semana
  const weekTotal = weekPurchases.reduce((sum, p) => sum + p.valuePaid, 0);
  if (weekTotal > 100) {
    insights.push({
      id: "high-spending",
      type: "warning",
      title: "Gastos altos esta semana",
      message: `Você já gastou R$ ${weekTotal
        .toFixed(2)
        .replace(".", ",")} esta semana. Fique de olho! 💰`,
      emoji: "💸",
    });
  }

  return insights;
}

export function getInsightColor(type: Insight["type"]): {
  bg: string;
  border: string;
  text: string;
  iconBg: string;
} {
  switch (type) {
    case "success":
      return {
        bg: "bg-green-50 dark:bg-green-950/20",
        border: "border-green-200 dark:border-green-800",
        text: "text-green-800 dark:text-green-200",
        iconBg: "bg-green-100 dark:bg-green-900/30",
      };
    case "warning":
      return {
        bg: "bg-yellow-50 dark:bg-yellow-950/20",
        border: "border-yellow-200 dark:border-yellow-800",
        text: "text-yellow-800 dark:text-yellow-200",
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      };
    case "danger":
      return {
        bg: "bg-red-50 dark:bg-red-950/20",
        border: "border-red-200 dark:border-red-800",
        text: "text-red-800 dark:text-red-200",
        iconBg: "bg-red-100 dark:bg-red-900/30",
      };
    case "info":
      return {
        bg: "bg-blue-50 dark:bg-blue-950/20",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-800 dark:text-blue-200",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
      };
  }
}
