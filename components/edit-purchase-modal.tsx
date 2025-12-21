"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, Calendar, Clock } from "lucide-react";
import { Purchase, PurchaseInput } from "@/types/purchase";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useCategories } from "@/hooks/useCategories";

interface EditPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (
    id: string,
    purchaseData: PurchaseInput
  ) => Promise<{ success: boolean }>;
  purchase: Purchase | null;
}

export function EditPurchaseModal({
  open,
  onClose,
  onUpdate,
  purchase,
}: EditPurchaseModalProps) {
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

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Detect mobile device
  const isMobile = useIsMobile();

  // Load categories from database
  const { categories } = useCategories();

  // Load purchase data when modal opens
  useEffect(() => {
    if (open && purchase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDish(purchase.dish);

      setRestaurant(purchase.restaurant);

      setValuePaid(purchase.valuePaid.toString().replace(".", ","));

      setValueTotal(
        purchase.valueTotal
          ? purchase.valueTotal.toString().replace(".", ",")
          : ""
      );

      setDate(purchase.date);

      setTime(purchase.time);

      setCategory(purchase.category);

      setIsEvent(purchase.isEvent);

      setIsAlone(purchase.isAlone);

      setErrors({});
    }
  }, [open, purchase]);

  if (!open || !purchase) return null;

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "dish":
        if (!value.trim()) return "Nome do prato é obrigatório";
        if (value.trim().length < 3)
          return "Nome do prato deve ter no mínimo 3 caracteres";
        return "";
      case "restaurant":
        if (!value.trim()) return "Nome do restaurante é obrigatório";
        if (value.trim().length < 3)
          return "Nome do restaurante deve ter no mínimo 3 caracteres";
        return "";
      case "valuePaid":
        if (!value.trim()) return "Valor pago é obrigatório";
        const paidNum = parseFloat(value.replace(",", "."));
        if (isNaN(paidNum) || paidNum <= 0) return "Valor pago inválido";
        return "";
      case "valueTotal":
        if (value.trim() !== "") {
          const totalNum = parseFloat(value.replace(",", "."));
          if (isNaN(totalNum) || totalNum <= 0) return "Valor total inválido";
          const paidNum = parseFloat(valuePaid.replace(",", "."));
          if (!isNaN(paidNum) && totalNum < paidNum) {
            return "Valor total não pode ser menor que o valor pago";
          }
        }
        return "";
      case "date":
        if (!value) return "Data é obrigatória";
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (selectedDate > today) return "Data não pode ser no futuro";
        return "";
      case "time":
        if (!value) return "Hora é obrigatória";
        return "";
      case "category":
        if (!value) return "Categoria é obrigatória";
        return "";
      default:
        return "";
    }
  };

  const validateAllFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    newErrors.dish = validateField("dish", dish);
    newErrors.restaurant = validateField("restaurant", restaurant);
    newErrors.valuePaid = validateField("valuePaid", valuePaid);
    newErrors.valueTotal = validateField("valueTotal", valueTotal);
    newErrors.date = validateField("date", date);
    newErrors.time = validateField("time", time);
    newErrors.category = validateField("category", category);

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleFieldChange = (field: string, value: string) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }

    switch (field) {
      case "dish":
        setDish(value);
        break;
      case "restaurant":
        setRestaurant(value);
        break;
      case "valuePaid":
        setValuePaid(value);
        break;
      case "valueTotal":
        setValueTotal(value);
        break;
      case "date":
        setDate(value);
        break;
      case "time":
        setTime(value);
        break;
      case "category":
        setCategory(value);
        break;
    }
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);

    const valuePaidNum = parseFloat(valuePaid.replace(",", "."));
    const valueTotalNum =
      valueTotal && valueTotal.trim() !== ""
        ? parseFloat(valueTotal.replace(",", "."))
        : undefined;

    const purchaseData: PurchaseInput = {
      dish: dish.trim(),
      restaurant: restaurant.trim(),
      valuePaid: valuePaidNum,
      date,
      time,
      category,
      isEvent,
      isAlone,
    };

    if (valueTotalNum !== undefined) {
      purchaseData.valueTotal = valueTotalNum;
    }

    const result = await onUpdate(purchase.id, purchaseData);

    if (result.success) {
      onClose();
    } else {
      alert("Erro ao atualizar pedido. Tente novamente.");
    }

    setIsSubmitting(false);
  };

  const selectedCategory = categories.find((c) => c.id === category);

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-12 pb-4 border-b border-border bg-background">
          <div>
            <h1 className="font-bold text-xl text-foreground">Editar Pedido</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Atualize as informações do seu pedido
            </p>
          </div>
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
                onChange={(e) => handleFieldChange("dish", e.target.value)}
                placeholder="Ex: Big Mac + McFritas Grande"
                className={`w-full bg-card rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 border transition-colors ${
                  errors.dish
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-transparent focus:ring-primary focus:border-primary"
                }`}
              />
              {errors.dish && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.dish}
                </p>
              )}
            </div>

            {/* Restaurante */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Restaurante <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={restaurant}
                onChange={(e) =>
                  handleFieldChange("restaurant", e.target.value)
                }
                placeholder="Ex: McDonald's - Shopping Center"
                className={`w-full bg-card rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 border transition-colors ${
                  errors.restaurant
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-transparent focus:ring-primary focus:border-primary"
                }`}
              />
              {errors.restaurant && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.restaurant}
                </p>
              )}
            </div>

            {/* Valores */}
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
                    onChange={(e) =>
                      handleFieldChange("valuePaid", e.target.value)
                    }
                    placeholder="0,00"
                    className={`w-full bg-card rounded-xl pl-11 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 border transition-colors ${
                      errors.valuePaid
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-transparent focus:ring-primary focus:border-primary"
                    }`}
                  />
                </div>
                {errors.valuePaid && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.valuePaid}
                  </p>
                )}
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
                    onChange={(e) =>
                      handleFieldChange("valueTotal", e.target.value)
                    }
                    placeholder="0,00"
                    className={`w-full bg-card rounded-xl pl-11 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 border transition-colors ${
                      errors.valueTotal
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-transparent focus:ring-primary focus:border-primary"
                    }`}
                  />
                </div>
                {errors.valueTotal && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.valueTotal}
                  </p>
                )}
              </div>
            </div>

            {/* Data e Hora - Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-hidden">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Data <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => handleFieldChange("date", e.target.value)}
                    className={`w-full min-w-0 max-w-full bg-card rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:ring-2 border transition-colors ${
                      isMobile ? "" : "appearance-none"
                    } ${
                      errors.date
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-transparent focus:ring-primary focus:border-primary"
                    }`}
                    style={isMobile ? {} : { colorScheme: "dark" }}
                  />
                  {!isMobile && (
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  )}
                </div>
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.date}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Hora <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleFieldChange("time", e.target.value)}
                    className={`w-full min-w-0 max-w-full bg-card rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:ring-2 border transition-colors ${
                      isMobile ? "" : "appearance-none"
                    } ${
                      errors.time
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-transparent focus:ring-primary focus:border-primary"
                    }`}
                    style={isMobile ? {} : { colorScheme: "dark" }}
                  />
                  {!isMobile && (
                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  )}
                </div>
                {errors.time && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.time}
                  </p>
                )}
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Categoria <span className="text-primary">*</span>
              </label>
              <button
                onClick={() => setShowCategories(!showCategories)}
                className={`w-full bg-card rounded-xl px-4 py-3.5 flex items-center justify-between border transition-colors ${
                  errors.category
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-transparent focus:border-primary focus:ring-2 focus:ring-primary"
                }`}
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
              {errors.category && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.category}
                </p>
              )}
              {showCategories && (
                <div className="mt-2 bg-card rounded-xl overflow-hidden border border-border shadow-lg max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleFieldChange("category", cat.id);
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
        <div className="px-4 py-4 border-t border-border bg-background space-y-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl text-base active:scale-[0.98] transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Salvando alterações..." : "Salvar Alterações"}
          </button>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full bg-muted text-foreground font-medium py-3 rounded-xl text-base active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
