import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, Container, Breadcrumbs } from "@/components/site-layout";
import { useShop } from "@/context/shop";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — Jain Desi and Pure" },
      { name: "description", content: "Track your Jain Desi and Pure orders from packing to delivery." },
      { property: "og:title", content: "My Orders — Jain Desi and Pure" },
      { property: "og:description", content: "Order history and live delivery timeline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrdersPage,
});

const timeline = ["Order Placed", "Confirmed", "Packed", "Out for Delivery", "Delivered"];

function OrdersPage() {
  const { orders } = useShop();

  return (
    <SiteLayout>
      <Container>
        <Breadcrumbs items={[{ label: "My Orders" }]} />
        <h1 className="text-2xl font-bold sm:text-3xl">My Orders</h1>

        <div className="mt-6 space-y-4">
          {orders.map((o) => {
            const stage = Math.max(timeline.indexOf(o.status), 1);
            return (
              <article key={o.id} className="rounded-2xl border bg-card p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold">Order #{o.id}</p>
                    <p className="text-xs text-muted-foreground">{o.date} · {o.payment}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                    {o.status}
                  </span>
                </div>

                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {o.items.map((i) => (
                    <li key={i.productId}>
                      {i.name} — {i.unit} × {i.qty}
                    </li>
                  ))}
                </ul>

                <ol className="mt-4 grid gap-2 text-[11px] sm:grid-cols-5">
                  {timeline.map((step, i) => (
                    <li
                      key={step}
                      className={`rounded-xl border p-2 text-center ${i <= stage ? "border-primary bg-primary-soft/60 font-semibold text-primary" : "text-muted-foreground"}`}
                    >
                      {step}
                    </li>
                  ))}
                </ol>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-base font-bold">{inr(o.total)}</p>
                  <Link to="/order/$id" params={{ id: o.id }} className="text-sm font-semibold text-primary">
                    View details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </SiteLayout>
  );
}
