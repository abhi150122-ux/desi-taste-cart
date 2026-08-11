import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "./product-card";

export function ProductSlider({
  title,
  products,
  viewAllSlug,
}: {
  title: string;
  products: Product[];
  viewAllSlug?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => railRef.current?.scrollBy({ left: dir * 600, behavior: "smooth" });

  if (products.length === 0) return null;

  return (
    <section className="py-6">
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="truncate text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        <div className="flex shrink-0 items-center gap-2">
          {viewAllSlug && (
            <Link
              to="/category/$slug"
              params={{ slug: viewAllSlug }}
              className="rounded-full border border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-soft"
            >
              View All
            </Link>
          )}
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scrollBy(-1)}
            className="hidden size-9 place-items-center rounded-full border bg-card hover:bg-secondary md:grid"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scrollBy(1)}
            className="hidden size-9 place-items-center rounded-full border bg-card hover:bg-secondary md:grid"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div ref={railRef} className="rail -mx-4 gap-3 px-4 pb-2 sm:mx-0 sm:gap-4 sm:px-0">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} className="w-[46vw] shrink-0 sm:w-[210px] lg:w-[192px]" />
        ))}
      </div>
    </section>
  );
}
