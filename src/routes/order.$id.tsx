import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteLayout, Container } from "@/components/site-layout";
import { useShop } from "@/context/shop";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/order/$id")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Jain Desi and Pure" },
      { name: "description", content: "Your pure desi grocery order is confirmed and on its way." },
      { property: "og:title", content: "Order Confirmed — Jain Desi and Pure" },
      { property: "og:description", content: "Thank you for shopping pure and traditional." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

const timeline = ["Order Placed", "Confirmed", "Packed", "Out for Delivery", "Delivered"];

function OrderPage() {
  const { id } = Route.useParams();
  const { orders } = useShop();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <SiteLayout>
        <Container>
          <div className="mx-auto max-w-md rounded-3xl border bg-card p-10 text-center">
            <h1 className="text-xl font-bold">Order not found</h1>
            <Link to="/orders" className="mt-4 inline-flex text-sm font-semibold text-primary">
              View all orders
            </Link>
          </div>
        </Container>
      </SiteLayout>
    );
  }

  const stage = timeline.indexOf(order.status);

  return (
    <SiteLayout>
      <Container className="py-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-accent/25 bg-card p-6 text-center sm:p-10">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-8" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">Order Placed Successfully!</h1>
          <p className="mt-1 text-sm text-muted-foreground">Order #{order.id}</p>

          <dl className="mt-6 grid gap-3 text-left sm:grid-cols-2">
            <Info label="Order Amount" value={inr(order.total)} />
            <Info label="Payment Method" value={order.payment} />
            <Info label="Estimated Delivery" value={order.eta} />
            <Info
              label="Delivery Address"
              value={`${order.address.house}, ${order.address.street}, ${order.address.city} — ${order.address.pincode}`}
            />
          </dl>

          <ol className="mt-6 grid gap-2 text-left text-xs sm:grid-cols-5">
            {timeline.map((step, i) => (
              <li key={step} className={`rounded-xl border p-2 ${i <= Math.max(stage, 1) ? "border-primary bg-primary-soft/60 font-semibold text-primary" : "text-muted-foreground"}`}>
                {step}
              </li>
            ))}
          </ol>

          <ul className="mt-6 space-y-2 text-left text-sm">
            {order.items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-3 rounded-xl bg-secondary/60 px-3 py-2">
                <span className="min-w-0 truncate">
                  {i.name} — {i.unit} × {i.qty}
                </span>
                <span className="shrink-0 font-semibold">{inr(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/orders" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
              View Order
            </Link>
            <Link to="/" className="rounded-full border px-6 py-3 text-sm font-semibold">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Container>
    </SiteLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/60 p-3">
      <dt className="text-[11px] text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}
