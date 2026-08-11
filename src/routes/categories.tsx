import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, Container, Breadcrumbs } from "@/components/site-layout";
import { categories, productsByCategory } from "@/lib/catalog";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "All Categories — Jain Desi and Pure" },
      {
        name: "description",
        content: "Browse cold pressed oils, attas, dals, rice, spices, pickles, snacks and dry fruits.",
      },
      { property: "og:title", content: "All Categories — Jain Desi and Pure" },
      { property: "og:description", content: "Every desi pantry essential in one place, delivered fast." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <SiteLayout>
      <Container>
        <Breadcrumbs items={[{ label: "Categories" }]} />
        <h1 className="text-2xl font-bold sm:text-3xl">Shop by Category</h1>
        <p className="mt-1 text-sm text-muted-foreground">{categories.length} categories · fresh stock daily</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group rounded-2xl border border-accent/25 bg-card p-3 text-center transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-lift)]"
            >
              <img
                src={c.image}
                alt={c.name}
                width={200}
                height={200}
                loading="lazy"
                className="aspect-square w-full rounded-xl object-cover"
              />
              <p className="mt-2 text-xs font-semibold">{c.name}</p>
              <p className="text-[11px] text-muted-foreground">{productsByCategory(c.slug).length} items</p>
            </Link>
          ))}
        </div>
      </Container>
    </SiteLayout>
  );
}
