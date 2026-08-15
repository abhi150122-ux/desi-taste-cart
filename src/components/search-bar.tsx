import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { searchProducts, type Product } from "@/lib/catalog";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";

export function SearchBar({ className, autoFocus }: { className?: string; autoFocus?: boolean }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const loadSuggestions = async () => {
      const results = await searchProducts(query);
      setSuggestions(results.slice(0, 6));
    };

    const debounce = setTimeout(loadSuggestions, 200);
    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const submit = (value: string) => {
    if (!value.trim()) return;
    setOpen(false);
    navigate({ to: "/search", search: { q: value.trim() } });
  };

  return (
    <div ref={wrapRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
      >
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-xs transition-colors focus-within:border-primary">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            autoFocus={autoFocus}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder='Search "cold pressed oil", "atta", "makhana"'
            aria-label="Search products"
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>
              <X className="size-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </form>

      {open && query.trim().length > 0 && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border bg-popover shadow-lg">
          {suggestions.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No products match “{query}”.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {suggestions.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate({ to: "/product/$slug", params: { slug: p.slug } });
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-secondary"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      width={40}
                      height={40}
                      loading="lazy"
                      className="size-10 shrink-0 rounded-lg object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {p.unit} · {p.categoryName}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold">{inr(p.price)}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => submit(query)}
                  className="w-full border-t px-3 py-2.5 text-left text-sm font-medium text-primary hover:bg-secondary"
                >
                  View all results for “{query}”
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
