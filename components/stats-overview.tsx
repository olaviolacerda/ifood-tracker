"use client";

import { TrendingUp, ShoppingBag, ChevronRight } from "lucide-react";
import { Purchase } from "@/types/purchase";
import { calculateMonthlyStats } from "@/lib/stats";

interface StatsOverviewProps {
  onViewStats: () => void;
  purchases: Purchase[];
}

export function StatsOverview({ onViewStats, purchases }: StatsOverviewProps) {
  const monthlyStats = calculateMonthlyStats(purchases);

  const stats = [
    {
      label: "Gasto Total",
      value: `R$ ${monthlyStats.totalSpent.toFixed(2).replace(".", ",")}`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Pedidos",
      value: monthlyStats.totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-foreground">Resumo do Mês</h2>
        <button
          onClick={onViewStats}
          className="flex items-center gap-1 text-primary text-sm font-medium"
        >
          Ver Estatísticas
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl p-3 flex flex-col items-center text-center"
          >
            <div
              className={`w-10 h-10 ${stat.bgColor} rounded-full flex items-center justify-center mb-2`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className="text-foreground font-bold text-base">
              {stat.value}
            </span>
            <span className="text-muted-foreground text-xs">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
