"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export function FirebaseTest() {
  const [status, setStatus] = useState<"testing" | "success" | "error">(
    "testing"
  );
  const [message, setMessage] = useState("Testando conexão com Firebase...");

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to read from Firestore
        const querySnapshot = await getDocs(collection(db, "purchases"));
        setStatus("success");
        setMessage(
          `✅ Conexão com Firebase OK! ${querySnapshot.size} compras encontradas.`
        );
      } catch (error: any) {
        setStatus("error");
        setMessage(`❌ Erro ao conectar: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-sm ${
        status === "success"
          ? "bg-green-100 text-green-800 border border-green-200"
          : status === "error"
          ? "bg-red-100 text-red-800 border border-red-200"
          : "bg-blue-100 text-blue-800 border border-blue-200"
      }`}
    >
      <p className="text-sm font-medium">{message}</p>
      {status === "error" && (
        <p className="text-xs mt-2">
          Verifique o arquivo .env.local e reinicie o servidor
        </p>
      )}
    </div>
  );
}
