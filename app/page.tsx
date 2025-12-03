"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Shield, BarChart3, Bell } from "lucide-react";

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

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

  if (user) {
    return null; // Will redirect via useEffect
  }

  const features = [
    {
      icon: TrendingUp,
      title: "Controle Total",
      description: "Acompanhe todos os seus gastos com delivery em um só lugar",
    },
    {
      icon: BarChart3,
      title: "Estatísticas Detalhadas",
      description: "Veja gráficos e insights sobre seus hábitos de consumo",
    },
    {
      icon: Shield,
      title: "Seguro e Privado",
      description: "Seus dados ficam protegidos e apenas você tem acesso",
    },
    {
      icon: Bell,
      title: "Insights Inteligentes",
      description: "Receba dicas personalizadas para economizar mais",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="px-4 pt-12 pb-16 text-center">
        <div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">🍔</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          iFood Tracker
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
          Controle seus gastos com delivery de forma simples, organizada e
          inteligente
        </p>
        <button
          onClick={() => setShowAuth(true)}
          className="bg-primary text-primary-foreground font-bold py-4 px-8 rounded-xl text-base active:scale-[0.98] transition-transform"
        >
          Começar Gratuitamente
        </button>
      </div>

      {/* Features Section */}
      <div className="px-4 pb-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          Por que usar o iFood Tracker?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card rounded-2xl p-6 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 pb-16">
        <div className="bg-primary/5 rounded-3xl p-8 text-center max-w-2xl mx-auto border border-primary/20">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-muted-foreground mb-6">
            Crie sua conta gratuita e tenha controle total dos seus gastos com
            delivery
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-primary text-primary-foreground font-bold py-4 px-8 rounded-xl text-base active:scale-[0.98] transition-transform"
          >
            Criar Conta Grátis
          </button>
        </div>
      </div>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
