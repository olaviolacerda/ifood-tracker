"use client";

import { X, TrendingUp, TrendingDown, Utensils } from "lucide-react";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Purchase } from "@/types/purchase";
import {
  calculateMonthlyStats,
  calculateCategoryStats,
  getWeeklySpendingData,
  getMonthlyEvolutionData,
} from "@/lib/stats";
import { useCategories } from "@/hooks/useCategories";

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  purchases: Purchase[];
}

export function StatsModal({ open, onClose, purchases }: StatsModalProps) {
  const { categories } = useCategories();

  if (!open) return null;

  const monthlyStats = calculateMonthlyStats(purchases);
  const categoryData = calculateCategoryStats(purchases, categories);
  const weeklySpendingData = getWeeklySpendingData(purchases);
  const monthlyEvolutionData = getMonthlyEvolutionData(purchases);

  const totalSpent = monthlyEvolutionData.reduce(
    (acc, item) => acc + item.value,
    0
  );

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between px-4 pt-12 pb-4 border-b border-border">
          <h1 className="font-bold text-xl text-foreground">Dashboard</h1>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-card rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </header>

        <div className="flex-1 overflow-auto px-4 py-6 space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-2xl p-4 border-l-4 border-primary">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Gasto Total
              </p>
              <p className="text-foreground font-bold text-2xl mt-1">
                R$ {totalSpent.toFixed(2).replace(".", ",")}
              </p>
              <div className="flex items-center gap-1 mt-2 text-primary">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">últimos 6 meses</span>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4 border-l-4 border-success">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Média/Pedido
              </p>
              <p className="text-foreground font-bold text-2xl mt-1">
                R$ {monthlyStats.avgPerOrder.toFixed(2).replace(".", ",")}
              </p>
              <div className="flex items-center gap-1 mt-2 text-success">
                <TrendingDown className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">este mês</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Utensils className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Pedidos</p>
                <p className="text-foreground font-bold text-lg">
                  {monthlyStats.totalOrders}
                </p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-primary to-[#c4161f] rounded-2xl p-4 text-white">
            <h3 className="font-semibold mb-2">💡 Insight do Mês</h3>
            {monthlyStats.totalOrders > 0 ? (
              <>
                <p className="text-sm opacity-90 mb-3">
                  Você fez {monthlyStats.totalOrders} pedidos este mês, com um
                  gasto médio de R${" "}
                  {monthlyStats.avgPerOrder.toFixed(2).replace(".", ",")} por
                  pedido.
                  {categoryData.length > 0 &&
                    ` Sua categoria favorita é ${categoryData[0].name}.`}
                </p>
                {(() => {
                  const MARMITA_PRICE = 21;
                  const difference = monthlyStats.avgPerOrder - MARMITA_PRICE;
                  const percentageMore = (
                    (difference / MARMITA_PRICE) *
                    100
                  ).toFixed(0);
                  const totalMarmitaCost =
                    MARMITA_PRICE * monthlyStats.totalOrders;
                  const savings = monthlyStats.totalSpent - totalMarmitaCost;

                  if (monthlyStats.avgPerOrder <= MARMITA_PRICE) {
                    return (
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-sm font-medium">
                          🎉 Parabéns! Você está gastando em média R${" "}
                          {monthlyStats.avgPerOrder
                            .toFixed(2)
                            .replace(".", ",")}{" "}
                          por pedido, menos ou igual ao preço de uma marmita (R$
                          21,00).
                        </p>
                      </div>
                    );
                  } else if (savings > 0) {
                    return (
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-sm font-medium mb-2">
                          💰 Se tivesse comido marmita: você gastaria R${" "}
                          {totalMarmitaCost.toFixed(2).replace(".", ",")} no mês
                        </p>
                        <p className="text-sm">
                          Você está gastando{" "}
                          <span className="font-bold">
                            R$ {savings.toFixed(2).replace(".", ",")} a mais
                          </span>{" "}
                          ({percentageMore}%) em delivery. São{" "}
                          <span className="font-bold">
                            {Math.floor(savings / MARMITA_PRICE)} marmitas
                          </span>{" "}
                          extras que você poderia ter pedido!
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}
              </>
            ) : (
              <p className="text-sm opacity-90">
                Comece a registrar seus pedidos para ver insights
                personalizados!
              </p>
            )}
          </div>

          <div className="bg-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">
                Gasto por Semana
              </h3>
              <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                {new Date()
                  .toLocaleDateString("pt-BR", { month: "long" })
                  .charAt(0)
                  .toUpperCase() +
                  new Date()
                    .toLocaleDateString("pt-BR", { month: "long" })
                    .slice(1)}
              </span>
            </div>
            {weeklySpendingData.every((week) => week.value === 0) ? (
              <div className="h-44 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  Nenhum gasto registrado nas últimas semanas
                </p>
              </div>
            ) : (
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklySpendingData} barCategoryGap="25%">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e5e5"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#717171", fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#717171", fontSize: 11 }}
                      tickFormatter={(value) => `R$${value}`}
                      width={50}
                    />
                    <Tooltip
                      formatter={(value: number) => [`R$ ${value}`, "Gasto"]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "none",
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="value" fill="#ea1d2c" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Evolução Mensal</h3>
              <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                {new Date().getFullYear()}
              </span>
            </div>
            {monthlyEvolutionData.every((month) => month.value === 0) ? (
              <div className="h-44 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  Nenhum gasto registrado nos últimos meses
                </p>
              </div>
            ) : (
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyEvolutionData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e5e5"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#717171", fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#717171", fontSize: 11 }}
                      tickFormatter={(value) => `R$${value}`}
                      width={55}
                    />
                    <Tooltip
                      formatter={(value: number) => [`R$ ${value}`, "Total"]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "none",
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#1ea664"
                      strokeWidth={3}
                      dot={{ fill: "#1ea664", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "#1ea664" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl p-4">
            <h3 className="font-semibold text-foreground mb-4">
              Categorias Mais Pedidas
            </h3>
            {categoryData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">
                  Nenhum pedido este mês
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-36 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2.5">
                  {categoryData.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm text-foreground">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {category.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}
