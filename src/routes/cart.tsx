import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, Container, Breadcrumbs } from "@/components/site-layout";
import { useShop } from "@/context/shop";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Jain Desi and Pure" },
      { name: "description", content: "Review your desi grocery cart, apply coupons and checkout in seconds." },
      { property: "og:title", content: "Your Cart — Jain Desi and Pure" },
      { property: "og:description", content: "Pure desi groceries, delivered to your door." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cartItems, setQty, removeFromCart, totals } = useShop();

  if (cartItems.length === 0) {
    return (
      <SiteLayout>
        <Container>
          <Breadcrumbs items={[{ label: "Cart" }]} />
          <div className="mx-auto max-w-md rounded-3xl border bg-card p-10 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary-soft text-primary">
              <ShoppingBag className="size-7" />
            </span>
            <h1 className="mt-4 text-xl font-bold">Your cart is empty</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add some pure and healthy products to get started.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              Start Shopping
            </Link>
          </div>
        </Container>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <Container>
        <Breadcrumbs items={[{ label: "Cart" }]} />
        <h1 className="text-2xl font-bold sm:text-3xl">Your Cart</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-3">
            {cartItems.map(({ product, qty }) => (
              <div key={product.id} className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 rounded-2xl border bg-card p-3">
                <Link to="/product/$slug" params={{ slug: product.slug }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    width={160}
                    height={160}
                    loading="lazy"
                    className="size-20 rounded-xl object-cover"
                  />
                </Link>
                <div className="min-w-0">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                    <Link
                      to="/product/$slug"
                      params={{ slug: product.slug }}
                      className="truncate text-sm font-semibold hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => {
                        removeFromCart(product.id);
                        toast.success(`${product.name} removed`);
                      }}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">{product.unit}</p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3 rounded-xl border px-3 py-1.5">
                      <button type="button" aria-label="Decrease" onClick={() => setQty(product.id, qty - 1)}>
                        <Minus className="size-3.5" />
                      </button>
                      <span className="min-w-5 text-center text-sm font-bold">{qty}</span>
                      <button type="button" aria-label="Increase" onClick={() => setQty(product.id, qty + 1)}>
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{inr(product.price * qty)}</p>
                      {product.mrp > product.price && (
                        <p className="text-xs text-muted-foreground line-through">{inr(product.mrp * qty)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/" className="inline-flex text-sm font-semibold text-primary hover:underline">
              ← Continue Shopping
            </Link>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl border bg-card p-5 lg:sticky lg:top-40">
            <h2 className="text-base font-bold">Order Summary</h2>

            <dl className="space-y-2 border-t pt-4 text-sm">
              <Row label="Subtotal" value={inr(totals.subtotal)} />
              <Row label="Discount" value={`-${inr(totals.discount + totals.couponDiscount)}`} accent />
              <Row label="Delivery Fee" value={totals.delivery === 0 ? "FREE" : inr(totals.delivery)} />
              <Row label="Tax (5%)" value={inr(totals.tax)} />
              <div className="flex justify-between border-t pt-3 text-base font-bold">
                <span>Grand Total</span>
                <span>{inr(totals.total)}</span>
              </div>
            </dl>

            {totals.savings > 0 && (
              <p className="rounded-xl bg-primary-soft px-3 py-2 text-center text-sm font-semibold text-primary">
                You saved {inr(totals.savings)} on this order
              </p>
            )}

            <Link
              to="/checkout"
              className="block rounded-xl bg-primary py-3 text-center text-sm font-bold text-primary-foreground"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      </Container>
    </SiteLayout>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={accent ? "font-semibold text-primary" : "font-medium"}>{value}</dd>
    </div>
  );
}
