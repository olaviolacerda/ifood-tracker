"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { WeeklySummary } from "@/components/weekly-summary";
import { StatsOverview } from "@/components/stats-overview";
import { PurchaseList } from "@/components/purchase-list";
import { StatsModal } from "@/components/stats-modal";
import { AddPurchaseModal } from "@/components/add-purchase-modal";
import { AuthModal } from "@/components/auth-modal";
import { usePurchases } from "@/hooks/usePurchases";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const [showStats, setShowStats] = useState(false);
  const [showAddPurchase, setShowAddPurchase] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { purchases, loading, error, addPurchase } = usePurchases();
  const { user, loading: authLoading } = useAuth();

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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🍔</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">iFood Tracker</h1>
          <p className="text-muted-foreground">
            Controle seus gastos com delivery de forma simples e organizada
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl text-base active:scale-[0.98] transition-transform"
          >
            Começar Agora
          </button>
        </div>
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => setShowAuth(true)} />

      <main className="px-4 pb-24 pt-4">
        <WeeklySummary purchases={purchases} />
        <StatsOverview
          purchases={purchases}
          onViewStats={() => setShowStats(true)}
        />
        <PurchaseList purchases={purchases} loading={loading} error={error} />
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <button
          onClick={() => setShowAddPurchase(true)}
          className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl text-base active:scale-[0.98] transition-transform"
        >
          Cadastrar Compra
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
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
