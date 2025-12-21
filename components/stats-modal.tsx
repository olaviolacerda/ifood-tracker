"use client";

import { useState } from "react";
import {
  X,
  TrendingUp,
  TrendingDown,
  Utensils,
  ChevronDown,
} from "lucide-react";
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
  getPurchasesByPeriod,
  getPurchasesByWeekday,
  getPeriodLabel,
  getFilteredPurchases,
  type TimePeriod,
} from "@/lib/stats";
import { useCategories } from "@/hooks/useCategories";
import { User } from "lucide-react";
import { countAloneOrders } from "@/lib/stats";

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  purchases: Purchase[];
}

export function StatsModal({ open, onClose, purchases }: StatsModalProps) {
  const { categories } = useCategories();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("monthly");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  if (!open) return null;

  const monthlyStats = calculateMonthlyStats(purchases);
  const categoryData = calculateCategoryStats(purchases, categories);
  const weeklySpendingData = getWeeklySpendingData(purchases);
  const monthlyEvolutionData = getMonthlyEvolutionData(purchases);
  const periodData = getPurchasesByPeriod(purchases, selectedPeriod);
  const weekdayData = getPurchasesByWeekday(purchases, selectedPeriod);
  const periodLabel = getPeriodLabel(selectedPeriod);

  const totalSpent = monthlyEvolutionData.reduce(
    (acc, item) => acc + item.value,
    0
  );

  const periodOptions: { value: TimePeriod; label: string }[] = [
    { value: "weekly", label: "Semanal" },
    { value: "monthly", label: "Mensal" },
    { value: "quarterly", label: "Trimestral" },
    { value: "yearly", label: "Anual" },
  ];

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

        <div className="flex-1 overflow-auto px-4 py-6 space-y-6">
          {/* ========== RESUMO GERAL ========== */}
          <div>
            <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              📊 Resumo Geral
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
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

            <div className="grid grid-cols-2 gap-3 mb-4">
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

              <div className="bg-card rounded-2xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-600/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Pedidos sozinho
                  </p>
                  <p className="text-foreground font-bold text-lg">
                    {countAloneOrders(purchases, "monthly")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========== INSIGHTS E GRÁFICOS MENSAIS ========== */}
          <div>
            <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              💡 Insights do Mês
            </h2>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary to-[#c4161f] rounded-2xl p-4 text-white">
                <h3 className="font-semibold mb-2">💡 Insight do Mês</h3>
                {monthlyStats.totalOrders > 0 ? (
                  <>
                    <p className="text-sm opacity-90 mb-3">
                      Você fez {monthlyStats.totalOrders} pedidos este mês, com
                      um gasto médio de R${" "}
                      {monthlyStats.avgPerOrder.toFixed(2).replace(".", ",")}{" "}
                      por pedido.
                      {categoryData.length > 0 &&
                        ` Sua categoria favorita é ${categoryData[0].name}.`}
                    </p>
                    {(() => {
                      const MARMITA_PRICE = 21;
                      const difference =
                        monthlyStats.avgPerOrder - MARMITA_PRICE;
                      const percentageMore = (
                        (difference / MARMITA_PRICE) *
                        100
                      ).toFixed(0);
                      const totalMarmitaCost =
                        MARMITA_PRICE * monthlyStats.totalOrders;
                      const savings =
                        monthlyStats.totalSpent - totalMarmitaCost;

                      if (monthlyStats.avgPerOrder <= MARMITA_PRICE) {
                        return (
                          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                            <p className="text-sm font-medium">
                              🎉 Parabéns! Você está gastando em média R${" "}
                              {monthlyStats.avgPerOrder
                                .toFixed(2)
                                .replace(".", ",")}{" "}
                              por pedido, menos ou igual ao preço de uma marmita
                              (R$ 21,00).
                            </p>
                          </div>
                        );
                      } else if (savings > 0) {
                        return (
                          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                            <p className="text-sm font-medium mb-2">
                              💰 Se tivesse comido marmita: você gastaria R${" "}
                              {totalMarmitaCost.toFixed(2).replace(".", ",")} no
                              mês
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
            </div>
          </div>

          {/* ========== ANÁLISE DE DADOS (COM FILTRO) ========== */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                📈 Análise de Dados
              </h2>

              <div className="relative">
                <button
                  onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                  className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2.5 hover:bg-muted transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">
                    {
                      periodOptions.find((p) => p.value === selectedPeriod)
                        ?.label
                    }
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      showPeriodDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showPeriodDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowPeriodDropdown(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-40 bg-popover border border-border rounded-xl shadow-lg z-20 overflow-hidden">
                      {periodOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedPeriod(option.value);
                            setShowPeriodDropdown(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                            selectedPeriod === option.value
                              ? "bg-primary text-primary-foreground font-medium"
                              : "hover:bg-muted text-foreground"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* Card de Valor Total Gasto */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      💰 Total Gasto no Período
                    </p>
                    <p className="text-3xl font-bold text-foreground mb-1">
                      R${" "}
                      {getFilteredPurchases(purchases, selectedPeriod)
                        .reduce((sum, p) => sum + p.valuePaid, 0)
                        .toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getFilteredPurchases(purchases, selectedPeriod).length}{" "}
                      {getFilteredPurchases(purchases, selectedPeriod)
                        .length === 1
                        ? "pedido"
                        : "pedidos"}{" "}
                      • {periodLabel}
                    </p>
                  </div>
                  <div className="bg-green-500/20 rounded-full p-3">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                {(() => {
                  const filteredPurchases = getFilteredPurchases(
                    purchases,
                    selectedPeriod
                  );
                  if (filteredPurchases.length > 0) {
                    const avgPerOrder =
                      filteredPurchases.reduce(
                        (sum, p) => sum + p.valuePaid,
                        0
                      ) / filteredPurchases.length;
                    return (
                      <div className="mt-4 pt-4 border-t border-green-500/20">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Ticket médio
                          </span>
                          <span className="font-semibold text-foreground">
                            R$ {avgPerOrder.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Período do Dia */}
              <div className="bg-card rounded-2xl p-4">
                <h3 className="font-semibold text-foreground mb-1">
                  Período do Dia Mais Pedido
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {periodLabel}
                </p>
                {periodData.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">
                      Nenhum pedido neste período
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-36 h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={periodData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {periodData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2.5">
                      {periodData.map((period) => (
                        <div
                          key={period.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{period.emoji}</span>
                            <span className="text-sm text-foreground">
                              {period.name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {period.value} pedidos
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Evolução de Gastos */}
              <div className="bg-card rounded-2xl p-4">
                <h3 className="font-semibold text-foreground mb-1">
                  Evolução de Gastos
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {periodLabel}
                </p>
                {(() => {
                  const filteredPurchases = getFilteredPurchases(
                    purchases,
                    selectedPeriod
                  );

                  if (filteredPurchases.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground text-sm">
                          Nenhum pedido neste período
                        </p>
                      </div>
                    );
                  }

                  // Agrupar por mês
                  const monthlyData = filteredPurchases.reduce(
                    (acc, purchase) => {
                      const date = new Date(purchase.date);
                      const monthKey = `${date.getFullYear()}-${String(
                        date.getMonth() + 1
                      ).padStart(2, "0")}`;
                      const monthName = date.toLocaleDateString("pt-BR", {
                        month: "short",
                        year: "numeric",
                      });

                      if (!acc[monthKey]) {
                        acc[monthKey] = {
                          name: monthName,
                          value: 0,
                          timestamp: date.getTime(),
                        };
                      }
                      acc[monthKey].value += purchase.valuePaid;
                      return acc;
                    },
                    {} as Record<
                      string,
                      { name: string; value: number; timestamp: number }
                    >
                  );

                  const chartData = Object.values(monthlyData)
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .map(({ name, value }) => ({ name, value }));

                  return (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="name"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                                    <p className="text-sm font-semibold text-foreground">
                                      {payload[0].payload.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      R$ {Number(payload[0].value).toFixed(2)}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#ea1d2c"
                            strokeWidth={2}
                            dot={{ fill: "#ea1d2c", r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })()}
              </div>

              {/* Ticket Médio por Categoria */}
              <div className="bg-card rounded-2xl p-4">
                <h3 className="font-semibold text-foreground mb-1">
                  Ticket Médio por Categoria
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {periodLabel}
                </p>
                {(() => {
                  const filteredPurchases = getFilteredPurchases(
                    purchases,
                    selectedPeriod
                  );

                  if (filteredPurchases.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground text-sm">
                          Nenhum pedido neste período
                        </p>
                      </div>
                    );
                  }

                  // Calcular ticket médio por categoria
                  const categoryStats = filteredPurchases.reduce(
                    (acc, purchase) => {
                      const categoryName = purchase.category || "Sem Categoria";
                      if (!acc[categoryName]) {
                        acc[categoryName] = { total: 0, count: 0 };
                      }
                      acc[categoryName].total += purchase.valuePaid;
                      acc[categoryName].count += 1;
                      return acc;
                    },
                    {} as Record<string, { total: number; count: number }>
                  );

                  const avgData = Object.entries(categoryStats)
                    .map(([name, stats]) => ({
                      name,
                      value: stats.total / stats.count,
                    }))
                    .sort((a, b) => b.value - a.value);

                  return (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={avgData} layout="vertical">
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                            horizontal={false}
                          />
                          <XAxis
                            type="number"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
                          />
                          <YAxis
                            dataKey="name"
                            type="category"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            width={100}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                                    <p className="text-sm font-semibold text-foreground">
                                      {payload[0].payload.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Média: R${" "}
                                      {Number(payload[0].value).toFixed(2)}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar
                            dataKey="value"
                            fill="#10b981"
                            radius={[0, 8, 8, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })()}
              </div>

              {/* Dia da Semana */}
              <div className="bg-card rounded-2xl p-4">
                <h3 className="font-semibold text-foreground mb-1">
                  Dia da Semana Mais Pedido
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {periodLabel}
                </p>
                {weekdayData.every((day) => day.value === 0) ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">
                      Nenhum pedido neste período
                    </p>
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weekdayData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                                  <p className="text-sm font-semibold text-foreground">
                                    {payload[0].payload.fullName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {payload[0].value} pedidos
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#ea1d2c"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}
