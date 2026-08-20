import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useShop } from "@/context/shop";
import { inr } from "@/lib/format";

export function StickyCartBar() {
  const { cartCount, totals } = useShop();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (cartCount === 0 || pathname.startsWith("/cart") || pathname.startsWith("/checkout")) return null;

  return (
    <div className="fixed inset-x-3 bottom-16 z-50 md:inset-x-auto md:right-6 md:bottom-6">
      <Link
        to="/cart"
        className="flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-primary-foreground shadow-[var(--shadow-lift)] md:min-w-[220px]"
      >
        <span className="text-sm font-semibold">
          {cartCount} {cartCount === 1 ? "item" : "items"} <span className="opacity-70">|</span> {inr(totals.subtotal)}
        </span>
        <span className="flex items-center gap-1 text-sm font-bold">
          View Cart <ArrowRight className="size-4" />
        </span>
      </Link>
    </div>
  );
}
