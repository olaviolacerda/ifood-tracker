import {
  Purchase,
  WeeklyStats,
  MonthlyStats,
  CategoryStats,
} from "@/types/purchase";
import { Category } from "@/types/category";
import {
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  format,
  startOfMonth,
  endOfMonth,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export function calculateWeeklyStats(purchases: Purchase[]): WeeklyStats {
  const now = new Date();
  const weekStart = startOfWeek(now, { locale: ptBR });
  const weekEnd = endOfWeek(now, { locale: ptBR });

  const lastWeekStart = startOfWeek(subWeeks(now, 1), { locale: ptBR });
  const lastWeekEnd = endOfWeek(subWeeks(now, 1), { locale: ptBR });

  // Filter purchases for current week
  const currentWeekPurchases = purchases.filter((p) => {
    const purchaseDate = new Date(p.date);
    return isWithinInterval(purchaseDate, { start: weekStart, end: weekEnd });
  });

  // Filter purchases for last week
  const lastWeekPurchases = purchases.filter((p) => {
    const purchaseDate = new Date(p.date);
    return isWithinInterval(purchaseDate, {
      start: lastWeekStart,
      end: lastWeekEnd,
    });
  });

  const totalSpent = currentWeekPurchases.reduce(
    (sum, p) => sum + p.valuePaid,
    0
  );
  const orders = currentWeekPurchases.length;
  const avgPerOrder = orders > 0 ? totalSpent / orders : 0;

  const lastWeekSpent = lastWeekPurchases.reduce(
    (sum, p) => sum + p.valuePaid,
    0
  );
  const lastWeekOrders = lastWeekPurchases.length;

  const spentComparison =
    lastWeekSpent > 0
      ? Math.round(((totalSpent - lastWeekSpent) / lastWeekSpent) * 100)
      : 0;
  const ordersComparison = orders - lastWeekOrders;

  return {
    totalSpent,
    orders,
    avgPerOrder,
    comparison: {
      spent: spentComparison,
      orders: ordersComparison,
      trend: spentComparison >= 0 ? "up" : "down",
    },
    weekRange: `${format(weekStart, "dd MMM", { locale: ptBR })} - ${format(
      weekEnd,
      "dd MMM",
      { locale: ptBR }
    )}`,
  };
}

export function calculateMonthlyStats(purchases: Purchase[]): MonthlyStats {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const monthlyPurchases = purchases.filter((p) => {
    const purchaseDate = new Date(p.date);
    return isWithinInterval(purchaseDate, { start: monthStart, end: monthEnd });
  });

  const totalSpent = monthlyPurchases.reduce((sum, p) => sum + p.valuePaid, 0);
  const totalOrders = monthlyPurchases.length;
  const avgPerOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;

  return {
    totalSpent,
    totalOrders,
    avgPerOrder,
  };
}

export function calculateCategoryStats(
  purchases: Purchase[],
  categories: Category[]
): CategoryStats[] {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const monthlyPurchases = purchases.filter((p) => {
    const purchaseDate = new Date(p.date);
    return isWithinInterval(purchaseDate, { start: monthStart, end: monthEnd });
  });

  const categoryCounts: { [key: string]: number } = {};
  monthlyPurchases.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const total = monthlyPurchases.length;
  if (total === 0) return [];

  return categories
    .map((cat) => ({
      name: cat.label,
      value: Math.round(((categoryCounts[cat.id] || 0) / total) * 100),
      color: cat.color,
    }))
    .filter((stat) => stat.value > 0)
    .sort((a, b) => b.value - a.value);
}

export function formatPurchaseDate(date: string, time: string): string {
  const now = new Date();
  const purchaseDate = new Date(date);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const purchaseDateOnly = new Date(
    purchaseDate.getFullYear(),
    purchaseDate.getMonth(),
    purchaseDate.getDate()
  );

  if (purchaseDateOnly.getTime() === today.getTime()) {
    return `Hoje, ${time}`;
  } else if (purchaseDateOnly.getTime() === yesterday.getTime()) {
    return `Ontem, ${time}`;
  } else {
    return `${format(purchaseDate, "dd MMM", { locale: ptBR })}, ${time}`;
  }
}

export function getWeeklySpendingData(purchases: Purchase[]) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const weeks = [];

  // Get all weeks in the current month
  let currentWeekStart = startOfWeek(monthStart, { locale: ptBR });
  let weekNumber = 1;

  while (currentWeekStart <= monthEnd) {
    const currentWeekEnd = endOfWeek(currentWeekStart, { locale: ptBR });

    const weekPurchases = purchases.filter((p) => {
      const purchaseDate = new Date(p.date);
      return isWithinInterval(purchaseDate, {
        start: currentWeekStart,
        end: currentWeekEnd,
      });
    });

    const totalSpent = weekPurchases.reduce((sum, p) => sum + p.valuePaid, 0);

    // Only show if the week overlaps with current month
    if (currentWeekStart <= monthEnd) {
      weeks.push({
        name: `Sem ${weekNumber}`,
        value: Math.round(totalSpent),
      });
      weekNumber++;
    }

    currentWeekStart = new Date(currentWeekEnd);
    currentWeekStart.setDate(currentWeekStart.getDate() + 1);

    // Limit to 5 weeks max to avoid overflow
    if (weekNumber > 5) break;
  }

  return weeks;
}

export function getMonthlyEvolutionData(purchases: Purchase[]) {
  const now = new Date();
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    const monthPurchases = purchases.filter((p) => {
      const purchaseDate = new Date(p.date);
      return isWithinInterval(purchaseDate, {
        start: monthStart,
        end: monthEnd,
      });
    });

    const totalSpent = monthPurchases.reduce((sum, p) => sum + p.valuePaid, 0);

    months.push({
      name: format(monthDate, "MMM", { locale: ptBR }),
      value: Math.round(totalSpent),
    });
  }

  return months;
}
