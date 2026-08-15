import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Leaf, MapPin, Menu, ShoppingCart, User, X } from "lucide-react";
import { SearchBar } from "./search-bar";
import { megaMenu, getCategories, type Category } from "@/lib/catalog";
import { useShop } from "@/context/shop";
import { inr } from "@/lib/format";

export function Header() {
  const { cartCount, totals, user } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-accent/25 bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 md:flex md:gap-6">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Leaf className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="font-display block truncate text-base leading-tight font-bold text-primary sm:text-lg">
                Jain Desi and Pure
              </span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">
                Pure Desi Taste, Naturally Better
              </span>
            </span>
          </Link>

          <button
            type="button"
            className="hidden shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-left text-xs lg:flex"
          >
            <MapPin className="size-4 text-primary" />
            <span>
              <span className="block font-semibold">Delivering to</span>
              <span className="block text-muted-foreground">Indore 452001</span>
            </span>
            <ChevronDown className="size-3" />
          </button>

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
          {megaMenu.map((group) => (
            <div key={group.title} className="group relative">
              <Link
                to="/category/$slug"
                params={{ slug: group.slug }}
                className="flex items-center gap-1 py-1.5 hover:text-primary"
              >
                {group.title}
                <ChevronDown className="size-3" />
              </Link>
              <div className="invisible absolute top-full left-0 z-50 w-56 rounded-2xl border bg-popover p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                {group.links.map((l) => (
                  <Link
                    key={l}
                    to="/search"
                    search={{ q: l }}
                    className="block rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          ))}
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
