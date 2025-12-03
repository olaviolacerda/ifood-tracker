import { Category } from "@/types/category";

export function getCategoryConfig(categories: Category[], categoryId: string) {
  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    return {
      label: categoryId,
      emoji: "🍽️",
      color: "#717171",
      bgColor: "bg-slate-50 dark:bg-slate-950/30",
      textColor: "text-slate-600",
    };
  }

  // Convert hex color to tailwind-like classes
  const getBgColorClass = (hex: string) => {
    const colorMap: { [key: string]: string } = {
      "#ea1d2c": "bg-orange-50 dark:bg-orange-950/30",
      "#a037f0": "bg-pink-50 dark:bg-pink-950/30",
      "#1ea664": "bg-green-50 dark:bg-green-950/30",
      "#e7a74e": "bg-purple-50 dark:bg-purple-950/30",
      "#3b82f6": "bg-blue-50 dark:bg-blue-950/30",
      "#717171": "bg-slate-50 dark:bg-slate-950/30",
    };
    return colorMap[hex] || "bg-slate-50 dark:bg-slate-950/30";
  };

  const getTextColorClass = (hex: string) => {
    const colorMap: { [key: string]: string } = {
      "#ea1d2c": "text-orange-600",
      "#a037f0": "text-pink-600",
      "#1ea664": "text-green-600",
      "#e7a74e": "text-purple-600",
      "#3b82f6": "text-blue-600",
      "#717171": "text-slate-600",
    };
    return colorMap[hex] || "text-slate-600";
  };

  return {
    label: category.label,
    emoji: category.emoji,
    color: category.color,
    bgColor: getBgColorClass(category.color),
    textColor: getTextColorClass(category.color),
  };
}
