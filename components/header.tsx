"use client";

import { LogOut, User, Tag, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onLoginClick: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    setShowMenu(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-primary px-4 pt-12 pb-4">
      <div className="flex items-center justify-between">
        <Link href={user ? "/dashboard" : "/"} className="cursor-pointer">
          <p className="text-primary-foreground/80 text-sm">Olá,</p>
          <h1 className="text-primary-foreground font-bold text-xl">
            {user?.email?.split("@")[0] || "Visitante"}
          </h1>
        </Link>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center"
            >
              <User className="w-5 h-5 text-primary-foreground" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-lg overflow-hidden">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs text-muted-foreground">
                        Logado como
                      </p>
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setShowMenu(false)}
                      className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2"
                    >
                      <Home className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/categories"
                      onClick={() => setShowMenu(false)}
                      className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2"
                    >
                      <Tag className="w-4 h-4" />
                      Categorias
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onLoginClick();
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Fazer Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
