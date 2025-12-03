"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { WeeklySummary } from "@/components/weekly-summary";
import { SmartInsights } from "@/components/smart-insights";
import { StatsOverview } from "@/components/stats-overview";
import { PurchaseList } from "@/components/purchase-list";
import { StatsModal } from "@/components/stats-modal";
import { AddPurchaseModal } from "@/components/add-purchase-modal";
import { EditPurchaseModal } from "@/components/edit-purchase-modal";
import { PurchaseDetailsModal } from "@/components/purchase-details-modal";
import { AuthModal } from "@/components/auth-modal";
import { usePurchases } from "@/hooks/usePurchases";
import { useAuth } from "@/contexts/AuthContext";
import { Purchase } from "@/types/purchase";

export default function DashboardPage() {
  const [showStats, setShowStats] = useState(false);
  const [showAddPurchase, setShowAddPurchase] = useState(false);
  const [showEditPurchase, setShowEditPurchase] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [purchaseToEdit, setPurchaseToEdit] = useState<Purchase | null>(null);
  const [purchaseToView, setPurchaseToView] = useState<Purchase | null>(null);
  const {
    purchases,
    loading,
    error,
    addPurchase,
    updatePurchase,
    deletePurchase,
  } = usePurchases();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleDelete = async (id: string) => {
    const result = await deletePurchase(id);
    if (!result.success) {
      alert(result.error || "Erro ao deletar pedido");
    }
  };

  const handleEdit = (purchase: Purchase) => {
    setPurchaseToEdit(purchase);
    setShowEditPurchase(true);
  };

  const handleCloseEdit = () => {
    setShowEditPurchase(false);
    setPurchaseToEdit(null);
  };

  const handleViewDetails = (purchase: Purchase) => {
    setPurchaseToView(purchase);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setPurchaseToView(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => setShowAuth(true)} />

      <main className="px-4 pb-24 pt-4">
        <WeeklySummary purchases={purchases} />
        <SmartInsights purchases={purchases} />
        <StatsOverview
          purchases={purchases}
          onViewStats={() => setShowStats(true)}
        />
        <PurchaseList
          purchases={purchases}
          loading={loading}
          error={error}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={handleViewDetails}
        />
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <button
          onClick={() => setShowAddPurchase(true)}
          className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl text-base active:scale-[0.98] transition-transform"
        >
          Cadastrar Pedido
        </button>
      </div>

      <StatsModal
        open={showStats}
        onClose={() => setShowStats(false)}
        purchases={purchases}
      />
      <AddPurchaseModal
        open={showAddPurchase}
        onClose={() => setShowAddPurchase(false)}
        onAdd={addPurchase}
      />
      <EditPurchaseModal
        open={showEditPurchase}
        onClose={handleCloseEdit}
        onUpdate={updatePurchase}
        purchase={purchaseToEdit}
      />
      <PurchaseDetailsModal
        open={showDetailsModal}
        onClose={handleCloseDetails}
        purchase={purchaseToView}
      />
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
