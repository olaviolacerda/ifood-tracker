"use client";

import { useState } from "react";
import { X, Plus, Edit2, Trash2, GripVertical, Save } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/category";

export default function CategoriesPage() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } =
    useCategories();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-primary-foreground font-bold text-xl">
              Categorias
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              Gerencie suas categorias de pedidos
            </p>
          </div>
          <a
            href="/"
            className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </a>
        </div>
      </header>

      <main className="px-4 py-6 pb-24">
        {/* Categories List */}
        <div className="space-y-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={() => setEditingCategory(category)}
              onDelete={async () => {
                if (
                  confirm(
                    `Tem certeza que deseja deletar a categoria "${category.label}"?`
                  )
                ) {
                  const result = await deleteCategory(category.id);
                  if (!result.success) {
                    alert(result.error);
                  }
                }
              }}
            />
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma categoria cadastrada
            </p>
          </div>
        )}
      </main>

      {/* Add Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl text-base active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Categoria
        </button>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingCategory) && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowAddModal(false);
            setEditingCategory(null);
          }}
          onSave={async (data) => {
            if (editingCategory) {
              const result = await updateCategory(editingCategory.id, data);
              if (result.success) {
                setEditingCategory(null);
              } else {
                alert(result.error);
              }
            } else {
              const result = await addCategory(data);
              if (result.success) {
                setShowAddModal(false);
              } else {
                alert(result.error);
              }
            }
          }}
        />
      )}
    </div>
  );
}

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-4">
      <div className="flex items-center gap-3 flex-1">
        <div className="text-3xl">{category.emoji}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{category.label}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-xs text-muted-foreground">
              {category.color}
            </span>
            {category.isDefault && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                Padrão
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          <Edit2 className="w-4 h-4 text-foreground" />
        </button>
        {!category.isDefault && (
          <button
            onClick={onDelete}
            className="w-9 h-9 bg-red-50 dark:bg-red-950/30 rounded-lg flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        )}
      </div>
    </div>
  );
}

interface CategoryModalProps {
  category: Category | null;
  onClose: () => void;
  onSave: (data: {
    label: string;
    emoji: string;
    color: string;
  }) => Promise<void>;
}

function CategoryModal({ category, onClose, onSave }: CategoryModalProps) {
  const [label, setLabel] = useState(category?.label || "");
  const [emoji, setEmoji] = useState(category?.emoji || "🍽️");
  const [color, setColor] = useState(category?.color || "#717171");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commonEmojis = [
    "🍔",
    "🍕",
    "🍣",
    "🍜",
    "🥗",
    "🍰",
    "🥤",
    "☕",
    "🍷",
    "🍝",
    "🌮",
    "🍱",
    "🍛",
    "🥘",
    "🍗",
    "🍟",
    "🌭",
    "🥙",
    "🥪",
    "🍿",
    "🍩",
    "🍪",
    "🎂",
    "🍦",
    "🧁",
    "🍫",
    "🍬",
    "🍭",
    "🍮",
    "🍯",
    "🥛",
    "🧃",
    "🧋",
    "🍶",
    "🍺",
    "🍻",
    "🥂",
    "🍾",
    "🥃",
    "🍽️",
  ];

  const commonColors = [
    "#ea1d2c",
    "#a037f0",
    "#1ea664",
    "#e7a74e",
    "#3b82f6",
    "#ef4444",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#8b5cf6",
    "#ec4899",
    "#717171",
  ];

  const handleSubmit = async () => {
    if (!label.trim()) {
      alert("O nome da categoria é obrigatório");
      return;
    }

    setIsSubmitting(true);
    await onSave({ label: label.trim(), emoji, color });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-background w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            {category ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-6 space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Nome da categoria
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Pizza, Sobremesas..."
              className="w-full bg-card rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-transparent"
            />
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Ícone (Emoji)
            </label>
            <div className="grid grid-cols-8 gap-2 mb-3">
              {commonEmojis.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-full aspect-square rounded-lg text-2xl flex items-center justify-center transition-all ${
                    emoji === e
                      ? "bg-primary text-primary-foreground scale-110"
                      : "bg-card hover:bg-muted"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="Ou digite um emoji personalizado"
              className="w-full bg-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-transparent text-center text-2xl"
            />
          </div>

          {/* Cor */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Cor
            </label>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {commonColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-full aspect-square rounded-lg transition-all ${
                    color === c
                      ? "scale-110 ring-2 ring-offset-2 ring-primary"
                      : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-12 rounded-lg border border-border cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#000000"
                className="flex-1 bg-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-transparent"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm font-semibold text-foreground mb-3">Prévia</p>
            <div className="flex items-center gap-3">
              <div className="text-3xl">{emoji}</div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {label || "Nome da categoria"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-muted-foreground">{color}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 space-y-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !label.trim()}
            className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl text-base active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isSubmitting
              ? "Salvando..."
              : category
              ? "Salvar Alterações"
              : "Criar Categoria"}
          </button>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full bg-muted text-foreground font-medium py-3 rounded-xl text-base active:scale-[0.98] transition-transform"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
