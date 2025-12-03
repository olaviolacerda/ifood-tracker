"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, Calendar, Clock } from "lucide-react";
import { PurchaseInput } from "@/types/purchase";
import { categories } from "@/lib/stats";

interface AddPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (purchaseData: PurchaseInput) => Promise<{ success: boolean }>;
}

export function AddPurchaseModal({
  open,
  onClose,
  onAdd,
}: AddPurchaseModalProps) {
  const [dish, setDish] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [valuePaid, setValuePaid] = useState("");
  const [valueTotal, setValueTotal] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [isAlone, setIsAlone] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default date and time when modal opens
  useEffect(() => {
    if (open) {
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      const timeStr = now.toTimeString().slice(0, 5);
      setDate(dateStr);
      setTime(timeStr);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!dish || !restaurant || !valuePaid || !date || !time || !category) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const valuePaidNum = parseFloat(valuePaid.replace(",", "."));
    const valueTotalNum =
      valueTotal && valueTotal.trim() !== ""
        ? parseFloat(valueTotal.replace(",", "."))
        : undefined;

    if (isNaN(valuePaidNum)) {
      alert("Valor pago inválido");
      return;
    }

    if (valueTotalNum !== undefined && isNaN(valueTotalNum)) {
      alert("Valor total inválido");
      return;
    }

    setIsSubmitting(true);

    const purchaseData: PurchaseInput = {
      dish,
      restaurant,
      valuePaid: valuePaidNum,
      date,
      time,
      category,
      isEvent,
      isAlone,
    };

    // Only add valueTotal if it has a valid value
    if (valueTotalNum !== undefined) {
      purchaseData.valueTotal = valueTotalNum;
    }

    const result = await onAdd(purchaseData);

    if (result.success) {
      // Reset form
      setDish("");
      setRestaurant("");
      setValuePaid("");
      setValueTotal("");
      setDate("");
      setTime("");
      setCategory("");
      setIsEvent(false);
      setIsAlone(true);
      onClose();
    } else {
      alert("Erro ao salvar pedido. Tente novamente.");
    }

    setIsSubmitting(false);
  };

  const selectedCategory = categories.find((c) => c.id === category);

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-12 pb-4 border-b border-border bg-background">
          <h1 className="font-bold text-xl text-foreground">
            Cadastrar Pedido
          </h1>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-card rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </header>

        {/* Form Content */}
        <div className="flex-1 overflow-auto px-4 py-6">
          <div className="space-y-5">
            {/* Nome do Prato */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Nome do prato <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                placeholder="Ex: Big Mac + McFritas Grande"
                className="w-full bg-card rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary"
              />
            </div>

            {/* Restaurante */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Restaurante <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={restaurant}
                onChange={(e) => setRestaurant(e.target.value)}
                placeholder="Ex: McDonald's - Shopping Center"
                className="w-full bg-card rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary"
              />
            </div>

            {/* Valores - Grid */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Valor pago por você <span className="text-primary">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Quanto você pagou neste pedido
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    R$
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={valuePaid}
                    onChange={(e) => setValuePaid(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-card rounded-xl pl-11 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Valor total do pedido
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Opcional - Preencha se dividiu o pedido ou pagou para outras
                  pessoas
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    R$
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={valueTotal}
                    onChange={(e) => setValueTotal(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-card rounded-xl pl-11 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Data e Hora - Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Data <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-card rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary appearance-none"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Hora <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-card rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary appearance-none"
                  />
                  <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Categoria <span className="text-primary">*</span>
              </label>
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="w-full bg-card rounded-xl px-4 py-3.5 flex items-center justify-between border border-transparent focus:border-primary focus:ring-2 focus:ring-primary"
              >
                <span
                  className={
                    selectedCategory
                      ? "text-foreground flex items-center gap-2"
                      : "text-muted-foreground"
                  }
                >
                  {selectedCategory ? (
                    <>
                      <span>{selectedCategory.emoji}</span>
                      <span>{selectedCategory.label}</span>
                    </>
                  ) : (
                    "Selecione uma categoria"
                  )}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    showCategories ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showCategories && (
                <div className="mt-2 bg-card rounded-xl overflow-hidden border border-border shadow-lg max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategory(cat.id);
                        setShowCategories(false);
                      }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                        category === cat.id
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted active:bg-muted"
                      }`}
                    >
                      <span className="text-lg">{cat.emoji}</span>
                      <span className="font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Checkboxes Section */}
            <div className="bg-card rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground mb-3">
                Detalhes do pedido
              </p>

              {/* Evento Checkbox */}
              <label className="flex items-center justify-between cursor-pointer py-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎉</span>
                  <span className="text-foreground">Evento?</span>
                </div>
                <div
                  onClick={() => setIsEvent(!isEvent)}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    isEvent ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      isEvent ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </label>

              {/* Sozinho Checkbox */}
              <label className="flex items-center justify-between cursor-pointer py-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg">👤</span>
                  <span className="text-foreground">Sozinho?</span>
                </div>
                <div
                  onClick={() => setIsAlone(!isAlone)}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    isAlone ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      isAlone ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="px-4 py-4 border-t border-border bg-background">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl text-base active:scale-[0.98] transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Salvando..." : "Salvar Pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}
