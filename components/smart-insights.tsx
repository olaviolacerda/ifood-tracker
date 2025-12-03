"use client";

import { X } from "lucide-react";
import { Purchase } from "@/types/purchase";
import { generateInsights, getInsightColor, Insight } from "@/lib/insights";
import { useCategories } from "@/hooks/useCategories";

interface SmartInsightsProps {
  purchases: Purchase[];
}

export function SmartInsights({ purchases }: SmartInsightsProps) {
  const { categories } = useCategories();
  const insights = generateInsights(purchases, categories);

  if (insights.length === 0) {
    return null;
  }

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-foreground">💡 Insights</h2>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </section>
  );
}

interface InsightCardProps {
  insight: Insight;
}

function InsightCard({ insight }: InsightCardProps) {
  const colors = getInsightColor(insight.type);

  return (
    <div
      className={`${colors.bg} ${colors.border} border rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300`}
    >
      <div
        className={`${colors.iconBg} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
      >
        <span className="text-xl">{insight.emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold text-sm ${colors.text} mb-1`}>
          {insight.title}
        </h3>
        <p className={`text-sm ${colors.text} opacity-90`}>{insight.message}</p>
      </div>
    </div>
  );
}
