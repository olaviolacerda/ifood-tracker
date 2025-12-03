import { PurchaseCard } from "./purchase-card";
import { Purchase } from "@/types/purchase";
import { formatPurchaseDate } from "@/lib/stats";

interface PurchaseListProps {
  purchases: Purchase[];
  loading: boolean;
  error: string | null;
}

export function PurchaseList({ purchases, loading, error }: PurchaseListProps) {
  if (loading) {
    return (
      <section>
        <h2 className="font-bold text-lg text-foreground mb-4">
          Histórico de Compras
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2 className="font-bold text-lg text-foreground mb-4">
          Histórico de Compras
        </h2>
        <div className="bg-card rounded-xl p-6 text-center">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  if (purchases.length === 0) {
    return (
      <section>
        <h2 className="font-bold text-lg text-foreground mb-4">
          Histórico de Compras
        </h2>
        <div className="bg-card rounded-xl p-6 text-center">
          <p className="text-muted-foreground">
            Nenhuma compra cadastrada ainda.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Clique em "Cadastrar Compra" para adicionar seu primeiro pedido.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="font-bold text-lg text-foreground mb-4">
        Histórico de Compras
      </h2>
      <div className="flex flex-col gap-3">
        {purchases.map((purchase) => (
          <PurchaseCard
            key={purchase.id}
            purchase={{
              id: purchase.id,
              dish: purchase.dish,
              restaurant: purchase.restaurant,
              value: purchase.valuePaid,
              date: formatPurchaseDate(purchase.date, purchase.time),
              category: purchase.category,
            }}
          />
        ))}
      </div>
    </section>
  );
}
