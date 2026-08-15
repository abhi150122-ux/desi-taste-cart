import { useRef, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCategories, type Category } from "@/lib/catalog";

export function CategorySlider() {
  const railRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const scrollBy = (dir: number) => railRef.current?.scrollBy({ left: dir * 500, behavior: "smooth" });

  return (
    <section className="py-6">
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="truncate text-xl font-bold tracking-tight sm:text-2xl">Shop by Category</h2>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scrollBy(-1)}
            className="hidden size-9 place-items-center rounded-full border bg-card hover:bg-secondary md:grid"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scrollBy(1)}
            className="hidden size-9 place-items-center rounded-full border bg-card hover:bg-secondary md:grid"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div ref={railRef} className="rail -mx-4 gap-3 px-4 pb-2 sm:mx-0 sm:gap-4 sm:px-0">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/category/$slug"
            params={{ slug: c.slug }}
            className="group w-[21vw] max-w-[112px] shrink-0 text-center sm:w-[104px]"
          >
            <div className="overflow-hidden rounded-2xl border border-accent/25 bg-card p-1.5 transition-all group-hover:-translate-y-1 group-hover:border-primary group-hover:shadow-[var(--shadow-lift)]">
              <img
                src={c.image}
                alt={c.name}
                width={200}
                height={200}
                loading="lazy"
                className="aspect-square w-full rounded-xl object-cover"
              />
            </div>
            <p className="mt-2 line-clamp-2 text-[11px] leading-tight font-medium sm:text-xs">{c.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
