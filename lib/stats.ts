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
  subMonths,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export type TimePeriod = "weekly" | "monthly" | "quarterly" | "yearly";

function getPeriodRange(period: TimePeriod) {
  const now = new Date();
  let start: Date;
  let end: Date;

  switch (period) {
    case "weekly":
      start = startOfWeek(now, { locale: ptBR });
      end = endOfWeek(now, { locale: ptBR });
      break;
    case "monthly":
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
    case "quarterly":
      start = startOfQuarter(now);
      end = endOfQuarter(now);
      break;
    case "yearly":
      start = startOfYear(now);
      end = endOfYear(now);
      break;
  }

  return { start, end };
}

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

export function getYearlyPurchasesByPeriod(purchases: Purchase[]) {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear(), 11, 31);

  const yearlyPurchases = purchases.filter((p) => {
    const purchaseDate = new Date(p.date);
    return isWithinInterval(purchaseDate, { start: yearStart, end: yearEnd });
  });

  const periods = {
    morning: 0, // 5h-12h
    afternoon: 0, // 12h-18h
    night: 0, // 18h-5h
  };

  yearlyPurchases.forEach((p) => {
    const hour = parseInt(p.time.split(":")[0]);

    if (hour >= 5 && hour < 12) {
      periods.morning++;
    } else if (hour >= 12 && hour < 18) {
      periods.afternoon++;
    } else {
      periods.night++;
    }
  });

  return [
    { name: "Manhã", value: periods.morning, emoji: "☀️", color: "#f59e0b" },
    { name: "Tarde", value: periods.afternoon, emoji: "🌤️", color: "#f97316" },
    { name: "Noite", value: periods.night, emoji: "🌙", color: "#6366f1" },
  ].filter((period) => period.value > 0);
}

export function getYearlyPurchasesByWeekday(purchases: Purchase[]) {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear(), 11, 31);

  const yearlyPurchases = purchases.filter((p) => {
    const purchaseDate = new Date(p.date);
    return isWithinInterval(purchaseDate, { start: yearStart, end: yearEnd });
  });

  const weekdays = {
    0: { name: "Dom", value: 0, fullName: "Domingo" },
    1: { name: "Seg", value: 0, fullName: "Segunda" },
    2: { name: "Ter", value: 0, fullName: "Terça" },
    3: { name: "Qua", value: 0, fullName: "Quarta" },
    4: { name: "Qui", value: 0, fullName: "Quinta" },
    5: { name: "Sex", value: 0, fullName: "Sexta" },
    6: { name: "Sáb", value: 0, fullName: "Sábado" },
  };

  yearlyPurchases.forEach((p) => {
    const purchaseDate = new Date(p.date);
    const dayOfWeek = purchaseDate.getDay();
    weekdays[dayOfWeek as keyof typeof weekdays].value++;
  });

  return Object.values(weekdays);
}

export function getPurchasesByPeriod(
  purchases: Purchase[],
  period: TimePeriod
) {
  const { start, end } = getPeriodRange(period);

  const filteredPurchases = purchases.filter((p) => {
    const purchaseDate = new Date(p.date);
    return isWithinInterval(purchaseDate, { start, end });
  });

  const periods = {
    morning: 0,
    afternoon: 0,
    night: 0,
  };

  filteredPurchases.forEach((p) => {
    const hour = parseInt(p.time.split(":")[0]);

    if (hour >= 5 && hour < 12) {
      periods.morning++;
    } else if (hour >= 12 && hour < 18) {
      periods.afternoon++;
    } else {
      periods.night++;
    }
  });

  return [
    { name: "Manhã", value: periods.morning, emoji: "☀️", color: "#f59e0b" },
    { name: "Tarde", value: periods.afternoon, emoji: "🌤️", color: "#f97316" },
    { name: "Noite", value: periods.night, emoji: "🌙", color: "#6366f1" },
  ].filter((period) => period.value > 0);
}

export function getPurchasesByWeekday(
  purchases: Purchase[],
  period: TimePeriod
) {
  const { start, end } = getPeriodRange(period);

  const filteredPurchases = purchases.filter((p) => {
    const purchaseDate = new Date(p.date);
    return isWithinInterval(purchaseDate, { start, end });
  });

  const weekdays = {
    0: { name: "Dom", value: 0, fullName: "Domingo" },
    1: { name: "Seg", value: 0, fullName: "Segunda" },
    2: { name: "Ter", value: 0, fullName: "Terça" },
    3: { name: "Qua", value: 0, fullName: "Quarta" },
    4: { name: "Qui", value: 0, fullName: "Quinta" },
    5: { name: "Sex", value: 0, fullName: "Sexta" },
    6: { name: "Sáb", value: 0, fullName: "Sábado" },
  };

  filteredPurchases.forEach((p) => {
    const purchaseDate = new Date(p.date);
    const dayOfWeek = purchaseDate.getDay();
    weekdays[dayOfWeek as keyof typeof weekdays].value++;
  });

  return Object.values(weekdays);
}

export function getFilteredPurchases(
  purchases: Purchase[],
  period: TimePeriod
): Purchase[] {
  const { start, end } = getPeriodRange(period);

  return purchases.filter((p) => {
    const purchaseDate = new Date(p.date);
    return isWithinInterval(purchaseDate, { start, end });
  });
}

export function countAloneOrders(
  purchases: Purchase[],
  period?: TimePeriod
): number {
  const filtered = period ? getFilteredPurchases(purchases, period) : purchases;
  return filtered.filter((p) => !!p.isAlone).length;
}

export function getPeriodLabel(period: TimePeriod): string {
  const now = new Date();

  switch (period) {
    case "weekly":
      const weekStart = startOfWeek(now, { locale: ptBR });
      const weekEnd = endOfWeek(now, { locale: ptBR });
      return `${format(weekStart, "dd/MM", { locale: ptBR })} - ${format(
        weekEnd,
        "dd/MM",
        { locale: ptBR }
      )}`;
    case "monthly":
      return format(now, "MMMM 'de' yyyy", { locale: ptBR });
    case "quarterly":
      const quarter = Math.floor(now.getMonth() / 3) + 1;
      return `${quarter}º Trimestre de ${now.getFullYear()}`;
    case "yearly":
      return `${now.getFullYear()}`;
  }
}
