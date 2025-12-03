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
}

const categoryConfig: Record<
  string,
  { label: string; emoji: string; color: string; bgColor: string }
> = {
  "fast-food": {
    label: "Fast Food",
    emoji: "🍔",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  japonês: {
    label: "Japonesa",
    emoji: "🍣",
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
  },
  saudável: {
    label: "Saudável",
    emoji: "🥗",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  doces: {
    label: "Sobremesa",
    emoji: "🍰",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  bebidas: {
    label: "Bebidas",
    emoji: "🥤",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  outras: {
    label: "Outras",
    emoji: "🍽️",
    color: "text-slate-600",
    bgColor: "bg-slate-50 dark:bg-slate-950/30",
  },
};

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

export function PurchaseCard({ purchase }: PurchaseCardProps) {
  const category = categoryConfig[purchase.category] || {
    label: purchase.category,
    emoji: "🍽️",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  };

  const time = purchase.date.split(", ")[1] || "12:00";
  const period = getPeriodOfDay(time);

  return (
    <div className="bg-card rounded-2xl p-4 active:scale-[0.99] transition-transform cursor-pointer border border-border hover:border-primary/20 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-base truncate">
            {purchase.dish}
          </h3>
          <p className="text-muted-foreground text-sm">{purchase.restaurant}</p>
        </div>
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${category.bgColor} ${category.color} ml-2`}
        >
          <span>{category.emoji}</span>
          <span>{category.label}</span>
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
  );
}
