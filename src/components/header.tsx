import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, MapPin, Menu, ShoppingCart, User, X } from "lucide-react";
import { SearchBar } from "./search-bar";
import { getCategories, type Category } from "@/lib/catalog";
import { useShop, type Address } from "@/context/shop";
import { inr } from "@/lib/format";

const LOCATION_PERMISSION_KEY = "jdp-location-permission-denied";

const formatAddress = (address: Address): string => {
  const locality = [address.city, address.pincode].filter(Boolean).join(" ");
  return [address.house, address.street, locality].filter(Boolean).join(", ");
};

const fetchCurrentLocation = async (): Promise<string | null> => {
  if (typeof window === "undefined" || !navigator.geolocation) return null;
  if (window.localStorage.getItem(LOCATION_PERMISSION_KEY) === "true") return null;

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const query = new URLSearchParams({
            format: "jsonv2",
            lat: String(coords.latitude),
            lon: String(coords.longitude),
          });
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${query.toString()}`);
          if (!response.ok) return resolve(null);
          const data = await response.json() as { address?: Record<string, string> };
          const address = data.address ?? {};
          const locality = address.city || address.town || address.village || address.suburb || address.county;
          const location = [locality, address.postcode].filter(Boolean).join(" ");
          resolve(location || null);
        } catch {
          resolve(null);
        }
      },
      () => {
        window.localStorage.setItem(LOCATION_PERMISSION_KEY, "true");
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  });
};

export function Header() {
  const { cartCount, totals, user, addresses, hydrated } = useShop();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deliveryLocation, setDeliveryLocation] = useState<string | null>(null);
  const topCategories = [...categories]
    .sort((a, b) => (b.products_count ?? 0) - (a.products_count ?? 0))
    .slice(0, 5);

  useEffect(() => {
    getCategories(5).then(setCategories);
  }, []);

  useEffect(() => {
    let active = true;
    if (!hydrated) {
      return () => {
        active = false;
      };
    }

    const savedAddress = addresses[0];

    if (savedAddress) {
      setDeliveryLocation(formatAddress(savedAddress));
      return () => {
        active = false;
      };
    }

    setDeliveryLocation(null);
    fetchCurrentLocation().then((location) => {
      if (active) setDeliveryLocation(location);
    });

    return () => {
      active = false;
    };
  }, [addresses, hydrated]);

  return (
    <header className="sticky top-0 z-50 border-b border-accent/25 bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 md:flex md:gap-6">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img
              src="https://admin.jaindesipure.co.in/media/categories/logo.jpg"
              alt="Jain Desi and Pure"
              className="h-[120px] w-[120px] shrink-0 rounded-2xl object-cover ring-1 ring-black/10"
            />
          </Link>

          {deliveryLocation && (
            <button
              type="button"
              className="hidden shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-left text-xs lg:flex"
            >
              <MapPin className="size-4 text-primary" />
              <span>
                <span className="block font-semibold">Delivering to</span>
                <span className="block text-muted-foreground">{deliveryLocation}</span>
              </span>
              <ChevronDown className="size-3" />
            </button>
          )}

          <div className="hidden min-w-0 flex-1 md:block">
            <SearchBar />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to={user ? "/account" : "/login"}
              className="hidden items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-secondary md:flex"
            >
              <User className="size-4" />
              {user ? user.name.split(" ")[0] : "Login"}
            </Link>
            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <ShoppingCart className="size-4" />
              <span className="hidden sm:inline">{cartCount > 0 ? inr(totals.subtotal) : "Cart"}</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="grid size-10 place-items-center rounded-xl border md:hidden"
            >
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <SearchBar />
        </div>

        <nav className="hidden items-center gap-6 border-t border-accent/20 py-2.5 text-sm font-medium md:flex">
          {topCategories.map((category) => {
            const categoryPath = `/category/${category.slug}`;
            const isActive = pathname === categoryPath || pathname.startsWith(`${categoryPath}/`);

            return (
            <div key={category.id} className="group relative">
              <Link
                to="/category/$slug"
                params={{ slug: category.slug }}
                className={`flex items-center gap-1 border-b-2 py-1.5 transition-colors ${isActive ? "border-primary text-primary" : "border-transparent hover:border-primary/50 hover:text-primary"}`}
              >
                {category.name}
              </Link>
            </div>
            );
          })}
          <Link to="/categories" className="ml-auto text-primary hover:underline">
            All Categories
          </Link>
        </nav>
      </div>

      {menuOpen && (
        <div className="max-h-[70vh] overflow-y-auto border-t bg-card p-4 md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border px-3 py-2 text-sm"
              >
                {c.name}
              </Link>
            ))}
          </div>
          <Link
            to={user ? "/account" : "/login"}
            onClick={() => setMenuOpen(false)}
            className="mt-3 block rounded-xl bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground"
          >
            {user ? "My Account" : "Login / Signup"}
          </Link>
        </div>
      )}
    </header>
  );
}
