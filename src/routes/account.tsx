import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, LogOut, MapPin, Package, Ticket, User } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, Container, Breadcrumbs } from "@/components/site-layout";
import { useShop } from "@/context/shop";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Jain Desi and Pure" },
      { name: "description", content: "Manage your profile, orders, addresses, wishlist and coupons." },
      { property: "og:title", content: "My Account — Jain Desi and Pure" },
      { property: "og:description", content: "Your Jain Desi and Pure account dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, logout, orders, addresses, wishlist } = useShop();
  const navigate = useNavigate();

  if (!user) {
    return (
      <SiteLayout>
        <Container>
          <div className="mx-auto max-w-md rounded-3xl border bg-card p-10 text-center">
            <h1 className="text-xl font-bold">You are not logged in</h1>
            <p className="mt-1 text-sm text-muted-foreground">Login to view your orders and saved addresses.</p>
            <Link
              to="/login"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              Login
            </Link>
          </div>
        </Container>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <Container>
        <Breadcrumbs items={[{ label: "My Account" }]} />
        <h1 className="text-2xl font-bold sm:text-3xl">My Account</h1>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <User className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">+91 {user.mobile}</p>
              </div>
            </div>
          </section>

          <Link to="/orders" className="rounded-2xl border bg-card p-5 hover:border-primary">
            <Package className="size-5 text-primary" />
            <p className="mt-3 font-bold">My Orders</p>
            <p className="text-xs text-muted-foreground">{orders.length} orders placed</p>
          </Link>

          <Link to="/wishlist" className="rounded-2xl border bg-card p-5 hover:border-primary">
            <Heart className="size-5 text-primary" />
            <p className="mt-3 font-bold">Wishlist</p>
            <p className="text-xs text-muted-foreground">{wishlist.length} items saved</p>
          </Link>

          <Link to="/notifications" className="rounded-2xl border bg-card p-5 hover:border-primary">
            <Package className="size-5 text-primary" />
            <p className="mt-3 font-bold">Notifications</p>
            <p className="text-xs text-muted-foreground">Updates from Jain Desi and Pure</p>
          </Link>

          <section className="rounded-2xl border bg-card p-5 lg:col-span-2">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <h2 className="font-bold">Saved Addresses</h2>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {addresses.map((a) => (
                <li key={a.id} className="rounded-xl bg-secondary/60 p-3">
                  <span className="font-semibold text-foreground">{a.fullName}</span> · {a.house}, {a.street},{" "}
                  {a.city}, {a.state} — {a.pincode}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-2">
              <Ticket className="size-4 text-primary" />
              <h2 className="font-bold">Coupons</h2>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="rounded-xl border border-dashed border-primary/50 p-3">
                <p className="font-bold text-primary">JAIN100</p>
                <p className="text-xs text-muted-foreground">₹100 off on orders above ₹999</p>
              </li>
              <li className="rounded-xl border border-dashed border-primary/50 p-3">
                <p className="font-bold text-primary">PURE50</p>
                <p className="text-xs text-muted-foreground">₹50 off on orders above ₹499</p>
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border bg-card p-5 lg:col-span-3">
            <h2 className="font-bold">Help &amp; Support</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              WhatsApp +91 98765 43210 · care@jaindesiandpure.in · Mon–Sat, 8 AM to 9 PM
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border px-3 py-1">Terms &amp; Conditions</span>
              <span className="rounded-full border px-3 py-1">Privacy Policy</span>
              <span className="rounded-full border px-3 py-1">Shipping Policy</span>
              <span className="rounded-full border px-3 py-1">Refund Policy</span>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                toast.success("Logged out");
                navigate({ to: "/" });
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-destructive px-5 py-2.5 text-sm font-semibold text-destructive"
            >
              <LogOut className="size-4" /> Logout
            </button>
          </section>
        </div>
      </Container>
    </SiteLayout>
  );
}
