"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Category, CategoryInput } from "@/types/category";

let isSeeding = false;

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "categories"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const categoriesData: Category[] = [];

      querySnapshot.forEach((doc) => {
        categoriesData.push({
          id: doc.id,
          ...doc.data(),
        } as Category);
      });

      // If no categories exist, seed default ones
      if (categoriesData.length === 0 && !isSeeding) {
        isSeeding = true;
        await seedDefaultCategories();
        isSeeding = false;
        return fetchCategories(); // Refetch after seeding
      }

      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Erro ao carregar categorias");
      isSeeding = false;
    } finally {
      setLoading(false);
    }
  }, []);

  const seedDefaultCategories = async () => {
    const defaultCategories = [
      {
        label: "Fast Food",
        emoji: "🍔",
        color: "#ea1d2c",
        order: 1,
        isDefault: true,
        createdAt: Date.now(),
      },
      {
        label: "Japonesa",
        emoji: "🍣",
        color: "#a037f0",
        order: 2,
        isDefault: true,
        createdAt: Date.now(),
      },
      {
        label: "Saudável",
        emoji: "🥗",
        color: "#1ea664",
        order: 3,
        isDefault: true,
        createdAt: Date.now(),
      },
      {
        label: "Sobremesa",
        emoji: "🍰",
        color: "#e7a74e",
        order: 4,
        isDefault: true,
        createdAt: Date.now(),
      },
      {
        label: "Bebidas",
        emoji: "🥤",
        color: "#3b82f6",
        order: 5,
        isDefault: true,
        createdAt: Date.now(),
      },
      {
        label: "Outras",
        emoji: "🍽️",
        color: "#717171",
        order: 6,
        isDefault: true,
        createdAt: Date.now(),
      },
    ];

    try {
      for (const category of defaultCategories) {
        await addDoc(collection(db, "categories"), category);
      }
    } catch (err) {
      console.error("Error seeding categories:", err);
    }
  };

  const addCategory = async (categoryData: CategoryInput) => {
    try {
      const maxOrder =
        categories.length > 0 ? Math.max(...categories.map((c) => c.order)) : 0;

      const dataToSave = {
        label: categoryData.label,
        emoji: categoryData.emoji,
        color: categoryData.color,
        order:
          categoryData.order !== undefined ? categoryData.order : maxOrder + 1,
        isDefault: false,
        createdAt: Date.now(),
      };

      const docRef = await addDoc(collection(db, "categories"), dataToSave);

      const newCategory: Category = {
        id: docRef.id,
        ...dataToSave,
      };

      setCategories((prev) =>
        [...prev, newCategory].sort((a, b) => a.order - b.order)
      );
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Erro ao adicionar categoria");
      return { success: false, error: "Erro ao adicionar categoria" };
    }
  };

  const updateCategory = async (
    id: string,
    categoryData: Partial<CategoryInput>
  ) => {
    try {
      const dataToUpdate: any = {};

      if (categoryData.label !== undefined)
        dataToUpdate.label = categoryData.label;
      if (categoryData.emoji !== undefined)
        dataToUpdate.emoji = categoryData.emoji;
      if (categoryData.color !== undefined)
        dataToUpdate.color = categoryData.color;
      if (categoryData.order !== undefined)
        dataToUpdate.order = categoryData.order;

      await updateDoc(doc(db, "categories", id), dataToUpdate);

      setCategories((prev) =>
        prev
          .map((c) => (c.id === id ? { ...c, ...dataToUpdate } : c))
          .sort((a, b) => a.order - b.order)
      );

      return { success: true };
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Erro ao atualizar categoria");
      return { success: false, error: "Erro ao atualizar categoria" };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      // Check if it's a default category
      const category = categories.find((c) => c.id === id);
      if (category?.isDefault) {
        return {
          success: false,
          error: "Não é possível deletar categorias padrão",
        };
      }

      await deleteDoc(doc(db, "categories", id));
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Erro ao deletar categoria");
      return { success: false, error: "Erro ao deletar categoria" };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}
