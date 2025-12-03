"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { signIn, signUp } from "@/lib/auth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    const result = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (result.success) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      onClose();
    } else {
      const errorMessage = result.error || "";
      if (errorMessage.includes("auth/email-already-in-use")) {
        setError("Este email já está em uso");
      } else if (errorMessage.includes("auth/invalid-email")) {
        setError("Email inválido");
      } else if (
        errorMessage.includes("auth/wrong-password") ||
        errorMessage.includes("auth/invalid-credential")
      ) {
        setError("Email ou senha incorretos");
      } else if (errorMessage.includes("auth/user-not-found")) {
        setError("Usuário não encontrado");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            {isSignUp ? "Criar Conta" : "Login"}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-card rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-transparent"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-transparent"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Aguarde..." : isSignUp ? "Criar Conta" : "Entrar"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp
                ? "Já tem uma conta? Faça login"
                : "Não tem conta? Cadastre-se"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
