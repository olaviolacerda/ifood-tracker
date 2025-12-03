"use client";

import { Calendar, TrendingUp, TrendingDown, ShoppingBag } from "lucide-react";
import { Purchase } from "@/types/purchase";
import { calculateWeeklyStats } from "@/lib/stats";

interface WeeklySummaryProps {
  purchases: Purchase[];
}

export function WeeklySummary({ purchases }: WeeklySummaryProps) {
  const weeklyStats = calculateWeeklyStats(purchases);

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-lg text-foreground">Resumo da Semana</h2>
        <span className="text-xs text-muted-foreground ml-auto">
          {weeklyStats.weekRange}
        </span>
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-4 border border-primary/10">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-background/50 backdrop-blur rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Gasto</span>
            </div>
            <p className="text-foreground font-bold text-lg">
              R$ {weeklyStats.totalSpent.toFixed(2).replace(".", ",")}
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              {weeklyStats.comparison.trend === "up" ? (
                <TrendingUp className="w-3 h-3 text-primary" />
              ) : (
                <TrendingDown className="w-3 h-3 text-success" />
              )}
              <span
                className={`text-xs font-medium ${
                  weeklyStats.comparison.trend === "up"
                    ? "text-primary"
                    : "text-success"
                }`}
              >
                {weeklyStats.comparison.spent > 0 ? "+" : ""}
                {weeklyStats.comparison.spent}%
              </span>
            </div>
          </div>

          <div className="bg-background/50 backdrop-blur rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <ShoppingBag className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">Pedidos</span>
            </div>
            <p className="text-foreground font-bold text-lg">
              {weeklyStats.orders}
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              {weeklyStats.comparison.orders >= 0 ? (
                <TrendingUp className="w-3 h-3 text-primary" />
              ) : (
                <TrendingDown className="w-3 h-3 text-success" />
              )}
              <span
                className={`text-xs font-medium ${
                  weeklyStats.comparison.orders >= 0
                    ? "text-primary"
                    : "text-success"
                }`}
              >
                {weeklyStats.comparison.orders > 0 ? "+" : ""}
                {weeklyStats.comparison.orders}
              </span>
            </div>
          </div>

          <div className="bg-background/50 backdrop-blur rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-xs text-muted-foreground">Média</span>
            </div>
            <p className="text-foreground font-bold text-lg">
              R$ {weeklyStats.avgPerOrder.toFixed(2).replace(".", ",")}
            </p>
            <span className="text-xs text-muted-foreground mt-1 block">
              por pedido
            </span>
          </div>
        </div>

        <div className="bg-background/70 backdrop-blur rounded-lg p-2.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-xs text-foreground">
            Você fez{" "}
            <span className="font-semibold">{weeklyStats.orders} pedidos</span>{" "}
            esta semana, gastando em média{" "}
            <span className="font-semibold">
              R$ {weeklyStats.avgPerOrder.toFixed(2).replace(".", ",")}
            </span>{" "}
            por pedido.
          </p>
        </div>
      </div>
    </section>
  );
}
