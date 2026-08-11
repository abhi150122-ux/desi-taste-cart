import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
import { z } from "zod";
import { SiteLayout, Container, Breadcrumbs } from "@/components/site-layout";
import { SearchBar } from "@/components/search-bar";
import { ProductGrid } from "@/components/product-grid";
import { ProductCardSkeleton } from "@/components/skeletons";
import { searchProducts, categories } from "@/lib/catalog";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Search Products — Jain Desi and Pure" },
      { name: "description", content: "Search cold pressed oils, attas, dals, spices and desi snacks instantly." },
      { property: "og:title", content: "Search Products — Jain Desi and Pure" },
      { property: "og:description", content: "Find every pure desi grocery essential in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const query = q ?? "";
  const [loading, setLoading] = useState(true);
  const results = searchProducts(query);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <SiteLayout>
      <Container>
        <Breadcrumbs items={[{ label: "Search" }]} />
        <div className="mx-auto max-w-2xl">
          <SearchBar autoFocus />
        </div>

        {!query ? (
          <div className="py-10 text-center">
            <h1 className="text-xl font-bold">What are you looking for?</h1>
            <p className="mt-1 text-sm text-muted-foreground">Try one of these popular searches</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["oil", "atta", "dal", "makhana", "ghee", "mustard", "rice", "papad"].map((s) => (
                <Link
                  key={s}
                  to="/search"
                  search={{ q: s }}
                  className="rounded-full border border-primary/30 px-4 py-1.5 text-sm text-primary hover:bg-primary-soft"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <h1 className="text-xl font-bold sm:text-2xl">
              Search results for “{query}”{" "}
              <span className="text-sm font-normal text-muted-foreground">({results.length})</span>
            </h1>

            {loading ? (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="mt-8 rounded-3xl border bg-card p-10 text-center">
                <SearchX className="mx-auto size-10 text-muted-foreground" />
                <p className="mt-3 text-lg font-bold">No products found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  We couldn’t find anything for “{query}”. Try a different keyword or browse categories.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {categories.slice(0, 6).map((c) => (
                    <Link
                      key={c.slug}
                      to="/category/$slug"
                      params={{ slug: c.slug }}
                      className="rounded-full border px-4 py-1.5 text-sm hover:bg-secondary"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <ProductGrid products={results} />
              </div>
            )}
          </div>
        )}
      </Container>
    </SiteLayout>
  );
}
