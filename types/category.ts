export interface Category {
  id: string;
  label: string;
  emoji: string;
  color: string;
  order: number;
  isDefault: boolean;
  createdAt: number;
}

export interface CategoryInput {
  label: string;
  emoji: string;
  color: string;
  order?: number;
}
