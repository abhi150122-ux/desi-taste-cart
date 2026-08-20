import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, LogOut, MapPin, Package, User } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, Container, Breadcrumbs } from "@/components/site-layout";
import { useShop, type Address } from "@/context/shop";

const emptyAddress: Omit<Address, "id"> = {
  fullName: "",
  mobile: "",
  house: "",
  street: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
};

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Jain Desi and Pure" },
      { name: "description", content: "Manage your profile, orders, addresses and wishlist." },
      { property: "og:title", content: "My Account — Jain Desi and Pure" },
      { property: "og:description", content: "Your Jain Desi and Pure account dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, logout, orders, addresses, wishlist, addAddress } = useShop();
  const navigate = useNavigate();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [savingAddress, setSavingAddress] = useState(false);

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
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <h2 className="font-bold">Saved Addresses</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressForm((visible) => !visible)}
                className="shrink-0 rounded-xl border border-primary/40 px-3 py-2 text-xs font-semibold text-primary"
              >
                {showAddressForm ? "Cancel" : "Add New Address"}
              </button>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {addresses.length > 0 ? addresses.map((a) => (
                <li key={a.id} className="rounded-xl bg-secondary/60 p-3">
                  <span className="font-semibold text-foreground">{a.fullName}</span> · {a.house}, {a.street},{" "}
                  {a.city}, {a.state} — {a.pincode}
                </li>
              )) : <li>No saved addresses yet.</li>}
            </ul>
            {showAddressForm && (
              <form
                className="mt-4 grid gap-3 sm:grid-cols-2"
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (!addressForm.fullName || !addressForm.mobile || !addressForm.house || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
                    toast.error("Please fill all required address fields");
                    return;
                  }
                  if (!/^\d{10}$/.test(addressForm.mobile)) {
                    toast.error("Enter a valid 10 digit mobile number");
                    return;
                  }
                  if (!/^\d{6}$/.test(addressForm.pincode)) {
                    toast.error("Enter a valid 6 digit pincode");
                    return;
                  }

                  try {
                    setSavingAddress(true);
                    await addAddress(addressForm);
                    setAddressForm(emptyAddress);
                    setShowAddressForm(false);
                    toast.success("Address saved");
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Failed to save address");
                  } finally {
                    setSavingAddress(false);
                  }
                }}
              >
                {([
                  ["fullName", "Full name"],
                  ["mobile", "Mobile number"],
                  ["house", "House / flat / street"],
                  ["street", "Area"],
                  ["landmark", "Landmark"],
                  ["city", "City"],
                  ["state", "State"],
                  ["pincode", "Pincode"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="grid gap-1 text-xs font-semibold">
                    {label}{!["landmark"].includes(key) && " *"}
                    <input
                      value={addressForm[key]}
                      onChange={(event) => setAddressForm((current) => ({ ...current, [key]: event.target.value }))}
                      required={key !== "landmark"}
                      inputMode={key === "mobile" || key === "pincode" ? "numeric" : undefined}
                      className="rounded-xl border bg-background px-3 py-2.5 text-sm font-normal outline-none focus:border-primary"
                    />
                  </label>
                ))}
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="sm:col-span-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {savingAddress ? "Saving..." : "Save Address"}
                </button>
              </form>
            )}
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
