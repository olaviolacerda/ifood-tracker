export interface Purchase {
  id: string;
  dish: string;
  restaurant: string;
  valuePaid: number;
  valueTotal?: number;
  date: string;
  time: string;
  category: string;
  isEvent: boolean;
  isAlone: boolean;
  createdAt: number;
}

export interface PurchaseInput {
  dish: string;
  restaurant: string;
  valuePaid: number;
  valueTotal?: number;
  date: string;
  time: string;
  category: string;
  isEvent: boolean;
  isAlone: boolean;
}

export interface WeeklyStats {
  totalSpent: number;
  orders: number;
  avgPerOrder: number;
  comparison: {
    spent: number;
    orders: number;
    trend: "up" | "down";
  };
  weekRange: string;
}

export interface MonthlyStats {
  totalSpent: number;
  totalOrders: number;
  avgPerOrder: number;
}

export interface CategoryStats {
  name: string;
  value: number;
  color: string;
}
