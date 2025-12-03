"use client";

import { X } from "lucide-react";
import { Purchase } from "@/types/purchase";
import { useCategories } from "@/hooks/useCategories";
import { getCategoryConfig } from "@/lib/categories";

interface PurchaseDetailsModalProps {
  open: boolean;
  onClose: () => void;
  purchase: Purchase | null;
}

const getPeriodOfDay = (time: string) => {
  const hour = parseInt(time.split(":")[0]);
  if (hour >= 5 && hour < 12) {
    return {
      label: "Manhã",
      emoji: "☀️",
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    };
  } else if (hour >= 12 && hour < 18) {
    return {
      label: "Tarde",
      emoji: "🌤️",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    };
  } else {
    return {
      label: "Noite",
      emoji: "🌙",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    };
  }
};

export function PurchaseDetailsModal({
  open,
  onClose,
  purchase,
}: PurchaseDetailsModalProps) {
  const { categories } = useCategories();

  if (!open || !purchase) return null;

  const categoryData = getCategoryConfig(categories, purchase.category);
  const category = {
    label: categoryData.label,
    emoji: categoryData.emoji,
    color: categoryData.textColor,
    bgColor: categoryData.bgColor,
  };

  const period = getPeriodOfDay(purchase.time);

  // Format date
  const dateObj = new Date(purchase.date);
  const formattedDate = dateObj.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Calculate discount if applicable
  const hasDiscount =
    purchase.valueTotal && purchase.valueTotal > purchase.valuePaid;
  const discountAmount = hasDiscount
    ? purchase.valueTotal! - purchase.valuePaid
    : 0;
  const discountPercentage = hasDiscount
    ? ((discountAmount / purchase.valueTotal!) * 100).toFixed(0)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div
        className="bg-background w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            Detalhes do Pedido
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center active:scale-95 transition-transform hover:bg-muted/80"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
          {/* Main Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {purchase.dish}
                </h3>
                <p className="text-muted-foreground text-base">
                  {purchase.restaurant}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${category.bgColor} ${category.color}`}
              >
                <span className="text-lg">{category.emoji}</span>
                <span>{category.label}</span>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-card rounded-xl p-4 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Valor pago por você
              </span>
              <span className="text-2xl font-bold text-primary">
                R$ {purchase.valuePaid.toFixed(2).replace(".", ",")}
              </span>
            </div>

            {purchase.valueTotal &&
              purchase.valueTotal !== purchase.valuePaid && (
                <>
                  <div className="border-t border-border pt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Valor total do pedido
                      </span>
                      <span className="text-foreground font-medium">
                        R$ {purchase.valueTotal.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    {hasDiscount && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Você economizou
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-bold">
                          R$ {discountAmount.toFixed(2).replace(".", ",")} (
                          {discountPercentage}%)
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📅</span>
                <span className="text-xs text-muted-foreground font-medium">
                  Data
                </span>
              </div>
              <p className="text-sm text-foreground font-medium capitalize">
                {formattedDate}
              </p>
            </div>

            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{period.emoji}</span>
                <span className="text-xs text-muted-foreground font-medium">
                  Horário
                </span>
              </div>
              <p className="text-sm text-foreground font-medium">
                {purchase.time} - {period.label}
              </p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-card rounded-xl p-4 border border-border space-y-3">
            <p className="text-sm font-semibold text-foreground mb-3">
              Informações adicionais
            </p>

            <div className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-lg">🎉</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Evento especial
                </p>
                <p className="text-xs text-muted-foreground">
                  {purchase.isEvent
                    ? "Sim, foi em um evento"
                    : "Não, pedido comum"}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  purchase.isEvent
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {purchase.isEvent ? "Sim" : "Não"}
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Pedido sozinho
                </p>
                <p className="text-xs text-muted-foreground">
                  {purchase.isAlone ? "Sim, pediu sozinho" : "Não, em grupo"}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  purchase.isAlone
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {purchase.isAlone ? "Sim" : "Não"}
              </div>
            </div>
          </div>

          {/* Created At */}
          {purchase.createdAt && (
            <div className="text-center text-xs text-muted-foreground">
              Registrado no sistema em{" "}
              {new Date(purchase.createdAt).toLocaleDateString("pt-BR", {
                timeZone: "America/Sao_Paulo",
              })}{" "}
              às{" "}
              {new Date(purchase.createdAt).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/Sao_Paulo",
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <button
            onClick={onClose}
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl text-base active:scale-[0.98] transition-transform"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
