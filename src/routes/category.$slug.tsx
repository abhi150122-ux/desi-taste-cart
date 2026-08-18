import { useMemo, useState, useEffect } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout, Container, Breadcrumbs } from "@/components/site-layout";
import { ProductGrid } from "@/components/product-grid";
import { categoryBySlug, productsByCategory, type Category, type Product } from "@/lib/catalog";
import { inr } from "@/lib/format";
import { PageLoader } from "@/components/page-loader";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    try {
      const category = await categoryBySlug(params.slug);
      if (!category) {
        console.warn(`Category not found: ${params.slug}`);
        throw notFound();
      }
      return { name: category.name, description: category.description };
    } catch (error) {
      console.error(`Error loading category ${params.slug}:`, error);
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Category not found — Jain Desi and Pure" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.name} — Jain Desi and Pure`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
});

const sorts = ["Popular", "Price: Low to High", "Price: High to Low", "Rating", "Newest"] as const;

function CategoryPage() {
  const { slug } = Route.useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [all, setAll] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const cat = await categoryBySlug(slug);
      setCategory(cat || null);
      const products = await productsByCategory(slug);
      setAll(products);
      setIsLoading(false);
    };
    loadData();
  }, [slug]);

  const [sort, setSort] = useState<(typeof sorts)[number]>("Popular");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [unit, setUnit] = useState("All");

  const units = useMemo(() => ["All", ...Array.from(new Set(all.map((p) => p.unit)))], [all]);

  const filtered = useMemo(() => {
    const list = all.filter(
      (p) =>
        p.price <= maxPrice &&
        p.rating >= minRating &&
        (!inStockOnly || p.stock > 0) &&
        (unit === "All" || p.unit === unit),
    );
    switch (sort) {
      case "Price: Low to High":
        return list.sort((a, b) => a.price - b.price);
      case "Price: High to Low":
        return list.sort((a, b) => b.price - a.price);
      case "Rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "Newest":
        return list.slice().reverse();
      default:
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [all, sort, maxPrice, minRating, inStockOnly, unit]);

  if (isLoading || !category) {
    return (
      <SiteLayout>
        <Container>
          <Breadcrumbs items={[{ label: "Loading..." }]} />
          <PageLoader label="Loading category..." />
        </Container>
      </SiteLayout>
    );
  }

  const category_data = category;

  return (
    <SiteLayout>
      <Container>
        <Breadcrumbs items={[{ label: "Categories" }, { label: category_data.name }]} />

        <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-card">
          <img
            src={category_data.image}
            alt={category_data.name}
            width={1200}
            height={320}
            loading="lazy"
            className="h-40 w-full object-cover sm:h-56"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/20" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
            <h1 className="text-2xl font-bold sm:text-4xl">{category_data.name}</h1>
            <p className="mt-1 max-w-lg text-sm text-muted-foreground">{category_data.description}</p>
            <p className="mt-2 text-xs font-semibold text-primary">{all.length} products</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border bg-card p-4 lg:sticky lg:top-40">
            <h2 className="text-sm font-bold">Filters</h2>

            <div className="mt-4">
              <label className="text-xs font-semibold" htmlFor="price">
                Max price: {inr(maxPrice)}
              </label>
              <input
                id="price"
                type="range"
                min={50}
                max={2000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--primary)]"
              />
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold">Weight / Pack</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {units.map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`rounded-full border px-2.5 py-1 text-[11px] ${unit === u ? "border-primary bg-primary-soft text-primary" : "text-muted-foreground"}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold">Rating</p>
              <div className="mt-2 flex gap-1.5">
                {[0, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setMinRating(r)}
                    className={`rounded-full border px-2.5 py-1 text-[11px] ${minRating === r ? "border-primary bg-primary-soft text-primary" : "text-muted-foreground"}`}
                  >
                    {r === 0 ? "Any" : `${r}+`}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold">Brand</p>
              <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" defaultChecked className="accent-[var(--primary)]" /> Jain Desi and Pure
              </label>
            </div>

            <label className="mt-4 flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[var(--primary)]"
              />
              In stock only
            </label>
          </aside>

          <div>
            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <p className="truncate text-sm text-muted-foreground">Showing {filtered.length} products</p>
              <select
                aria-label="Sort products"
                value={sort}
                onChange={(e) => setSort(e.target.value as (typeof sorts)[number])}
                className="shrink-0 rounded-xl border bg-card px-3 py-2 text-sm"
              >
                {sorts.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border bg-card p-10 text-center">
                <p className="font-semibold">No products match these filters</p>
                <p className="mt-1 text-sm text-muted-foreground">Try widening the price range or rating.</p>
              </div>
            ) : (
              <ProductGrid products={filtered} />
            )}
          </div>
        </div>
      </Container>
    </SiteLayout>
  );
}
