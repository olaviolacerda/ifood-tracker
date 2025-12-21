"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { getCategoryConfig } from "@/lib/categories";

interface Purchase {
  id: string;
  dish: string;
  restaurant: string;
  value: number;
  date: string;
  category: string;
}

interface PurchaseCardProps {
  purchase: Purchase;
  onDelete?: (id: string) => void;
  onEdit?: (purchase: Purchase) => void;
  onView?: (purchase: Purchase) => void;
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

export function PurchaseCard({
  purchase,
  onDelete,
  onEdit,
  onView,
}: PurchaseCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { categories } = useCategories();

  const categoryData = getCategoryConfig(categories, purchase.category);
  const category = {
    label: categoryData.label,
    emoji: categoryData.emoji,
    color: categoryData.textColor,
    bgColor: categoryData.bgColor,
  };

  const time = purchase.date.split(", ")[1] || "12:00";
  const period = getPeriodOfDay(time);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
    setMenuOpen(false);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(purchase.id);
    }
    setShowDeleteConfirm(false);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(purchase);
    }
    setMenuOpen(false);
  };

  const handleCardClick = () => {
    if (onView) {
      onView(purchase);
    }
  };

  return (
    <>
      <div
        className="bg-card rounded-2xl p-4 border border-border hover:border-primary/20 hover:shadow-md transition-all relative cursor-pointer active:scale-[0.99]"
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-base truncate">
              {purchase.dish}
            </h3>
            <p className="text-muted-foreground text-sm">
              {purchase.restaurant}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${category.bgColor} ${category.color}`}
            >
              <span>{category.emoji}</span>
              <span>{category.label}</span>
            </div>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                aria-label="Menu de ações"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-popover border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit();
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2 text-red-600 dark:text-red-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                      <span>Deletar</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">
            R$ {purchase.value.toFixed(2).replace(".", ",")}
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${period.bgColor} ${period.color}`}
            >
              <span>{period.emoji}</span>
              <span>{period.label}</span>
            </div>
            <span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded-md">
              {purchase.date.split(", ")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Confirmar exclusão</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Tem certeza que deseja deletar o pedido de &quot;{purchase.dish}
              &quot;? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors font-medium"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
