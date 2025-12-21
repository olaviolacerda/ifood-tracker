"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Purchase, PurchaseInput } from "@/types/purchase";
import { useAuth } from "@/contexts/AuthContext";

export function usePurchases() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = useCallback(async () => {
    if (!user) {
      setPurchases([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(
        collection(db, "purchases"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const purchasesData: Purchase[] = [];

      querySnapshot.forEach((doc) => {
        purchasesData.push({
          id: doc.id,
          ...doc.data(),
        } as Purchase);
      });

      setPurchases(purchasesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setError("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addPurchase = async (purchaseData: PurchaseInput) => {
    if (!user) {
      return { success: false, error: "Usuário não autenticado" };
    }

    try {
      // Remove undefined fields to avoid Firebase error
      const dataToSave: any = {
        userId: user.uid,
        dish: purchaseData.dish,
        restaurant: purchaseData.restaurant,
        valuePaid: purchaseData.valuePaid,
        date: purchaseData.date,
        time: purchaseData.time,
        category: purchaseData.category,
        isEvent: purchaseData.isEvent,
        isAlone: purchaseData.isAlone,
        createdAt: Date.now(),
      };

      // Only add valueTotal if it exists
      if (
        purchaseData.valueTotal !== undefined &&
        purchaseData.valueTotal !== null
      ) {
        dataToSave.valueTotal = purchaseData.valueTotal;
      }

      const docRef = await addDoc(collection(db, "purchases"), dataToSave);

      const newPurchase: Purchase = {
        id: docRef.id,
        ...purchaseData,
        createdAt: Date.now(),
      };

      setPurchases((prev) => [newPurchase, ...prev]);
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error("Error adding purchase:", err);
      setError("Erro ao adicionar pedido");
      return { success: false, error: "Erro ao adicionar pedido" };
    }
  };

  const updatePurchase = async (id: string, purchaseData: PurchaseInput) => {
    if (!user) {
      return { success: false, error: "Usuário não autenticado" };
    }

    try {
      const dataToUpdate: any = {
        dish: purchaseData.dish,
        restaurant: purchaseData.restaurant,
        valuePaid: purchaseData.valuePaid,
        date: purchaseData.date,
        time: purchaseData.time,
        category: purchaseData.category,
        isEvent: purchaseData.isEvent,
        isAlone: purchaseData.isAlone,
      };

      // Only add valueTotal if it exists
      if (
        purchaseData.valueTotal !== undefined &&
        purchaseData.valueTotal !== null
      ) {
        dataToUpdate.valueTotal = purchaseData.valueTotal;
      }

      await updateDoc(doc(db, "purchases", id), dataToUpdate);

      setPurchases((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...purchaseData,
              }
            : p
        )
      );

      return { success: true };
    } catch (err) {
      console.error("Error updating purchase:", err);
      setError("Erro ao atualizar pedido");
      return { success: false, error: "Erro ao atualizar pedido" };
    }
  };

  const deletePurchase = async (id: string) => {
    if (!user) {
      return { success: false, error: "Usuário não autenticado" };
    }

    try {
      await deleteDoc(doc(db, "purchases", id));
      setPurchases((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting purchase:", err);
      setError("Erro ao deletar pedido");
      return { success: false, error: "Erro ao deletar pedido" };
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [user, fetchPurchases]);

  return {
    purchases,
    loading,
    error,
    addPurchase,
    updatePurchase,
    deletePurchase,
    refetch: fetchPurchases,
  };
}
