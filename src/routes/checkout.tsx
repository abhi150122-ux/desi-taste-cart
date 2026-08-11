import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteLayout, Container, Breadcrumbs } from "@/components/site-layout";
import { useShop, type Address } from "@/context/shop";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Jain Desi and Pure" },
      { name: "description", content: "Enter your delivery address, pick a payment method and place your order." },
      { property: "og:title", content: "Checkout — Jain Desi and Pure" },
      { property: "og:description", content: "Fast, secure checkout for pure desi groceries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

const payments = ["Cash on Delivery", "UPI", "Credit/Debit Card", "Net Banking"];
const empty = {
  fullName: "",
  mobile: "",
  house: "",
  street: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
};

function CheckoutPage() {
  const { cartItems, totals, addresses, addAddress, placeOrder } = useShop();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(addresses[0]?.id ?? "");
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [form, setForm] = useState(empty);
  const [payment, setPayment] = useState(payments[0]!);
  const [placing, setPlacing] = useState(false);

  if (cartItems.length === 0) {
    return (
      <SiteLayout>
        <Container>
          <div className="mx-auto max-w-md rounded-3xl border bg-card p-10 text-center">
            <h1 className="text-xl font-bold">Nothing to checkout</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your cart is empty right now.</p>
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

  const saveAddress = () => {
    if (!form.fullName || !form.mobile || !form.house || !form.city || !form.pincode) {
      toast.error("Please fill name, mobile, house, city and pincode");
      return;
    }
    if (!/^\d{10}$/.test(form.mobile)) {
      toast.error("Enter a valid 10 digit mobile number");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error("Enter a valid 6 digit pincode");
      return;
    }
    const saved = addAddress(form);
    setSelected(saved.id);
    setShowForm(false);
    setForm(empty);
    toast.success("Address saved");
  };

  const submit = () => {
    const address: Address | undefined = addresses.find((a) => a.id === selected);
    if (!address) {
      toast.error("Please select a delivery address");
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      const order = placeOrder(payment, address);
      toast.success("Payment successful");
      navigate({ to: "/order/$id", params: { id: order.id } });
    }, 800);
  };

  return (
    <SiteLayout>
      <Container>
        <Breadcrumbs items={[{ label: "Cart" }, { label: "Checkout" }]} />
        <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <section className="rounded-2xl border bg-card p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <h2 className="text-base font-bold">Delivery Address</h2>
                <button
                  type="button"
                  onClick={() => setShowForm((s) => !s)}
                  className="shrink-0 rounded-full border border-primary/40 px-3 py-1.5 text-xs font-semibold text-primary"
                >
                  {showForm ? "Cancel" : "Add New Address"}
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-sm ${selected === a.id ? "border-primary bg-primary-soft/50" : ""}`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selected === a.id}
                      onChange={() => setSelected(a.id)}
                      className="mt-1 accent-[var(--primary)]"
                    />
                    <span>
                      <span className="block font-semibold">
                        {a.fullName} · {a.mobile}
                      </span>
                      <span className="block text-muted-foreground">
                        {a.house}, {a.street}, {a.landmark}, {a.city}, {a.state} — {a.pincode}
                      </span>
                    </span>
                  </label>
                ))}
              </div>

              {showForm && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["fullName", "Full Name"],
                      ["mobile", "Mobile Number"],
                      ["house", "House / Flat / Building"],
                      ["street", "Street / Area"],
                      ["landmark", "Landmark"],
                      ["city", "City"],
                      ["state", "State"],
                      ["pincode", "Pincode"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="text-xs font-medium">
                      {label}
                      <input
                        value={form[key]}
                        maxLength={80}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={saveAddress}
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground sm:col-span-2"
                  >
                    Save Address
                  </button>
                </div>
              )}
            </section>

            <section className="rounded-2xl border bg-card p-5">
              <h2 className="text-base font-bold">Delivery Option</h2>
              <div className="mt-3 flex items-center justify-between rounded-xl border border-primary bg-primary-soft/50 px-4 py-3 text-sm">
                <span className="font-semibold">Standard Delivery</span>
                <span className="text-muted-foreground">Arrives tomorrow, 10 AM - 1 PM</span>
              </div>
            </section>

            <section className="rounded-2xl border bg-card p-5">
              <h2 className="text-base font-bold">Payment Method</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {payments.map((p) => (
                  <label
                    key={p}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm ${payment === p ? "border-primary bg-primary-soft/50 font-semibold" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === p}
                      onChange={() => setPayment(p)}
                      className="accent-[var(--primary)]"
                    />
                    {p}
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl border bg-card p-5 lg:sticky lg:top-40">
            <h2 className="text-base font-bold">Order Summary</h2>
            <ul className="space-y-2 text-sm">
              {cartItems.map(({ product, qty }) => (
                <li key={product.id} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate text-muted-foreground">
                    {product.name} × {qty}
                  </span>
                  <span className="shrink-0 font-medium">{inr(product.price * qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t pt-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{inr(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Coupon</dt>
                <dd className="text-primary">-{inr(totals.couponDiscount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd>{totals.delivery === 0 ? "FREE" : inr(totals.delivery)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax</dt>
                <dd>{inr(totals.tax)}</dd>
              </div>
              <div className="flex justify-between border-t pt-3 text-base font-bold">
                <dt>Total</dt>
                <dd>{inr(totals.total)}</dd>
              </div>
            </dl>
            <button
              type="button"
              disabled={placing}
              onClick={submit}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {placing ? "Processing payment…" : "Place Order"}
            </button>
          </aside>
        </div>
      </Container>
    </SiteLayout>
  );
}
