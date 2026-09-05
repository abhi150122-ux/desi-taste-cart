import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories, type Category } from "@/lib/catalog";
import { RetryImage } from "./retry-image";

export function PromoSlider({ categories: providedCategories }: { categories?: Category[] }) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (providedCategories) return;
    getCategories().then((items) => setCategories(items.slice(0, 5)));
  }, [providedCategories]);

  const visibleCategories = (providedCategories ?? categories).slice(0, 5);

  return (
    <section className="py-6">
      <div className="rail -mx-4 gap-4 px-4 pb-2 sm:mx-0 sm:px-0">
        {visibleCategories.map((category) => (
          <Link
            key={category.slug}
            to="/category/$slug"
            params={{ slug: category.slug }}
            className="group relative flex w-[78vw] shrink-0 items-center gap-4 overflow-hidden rounded-2xl border border-accent/25 bg-card p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)] sm:w-[340px]"
          >
            <RetryImage
              src={category.image}
              alt={category.name}
              width={200}
              height={200}
              loading="lazy"
              className="size-20 shrink-0 rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold">{category.name}</h3>
              <p className="truncate text-xs text-muted-foreground">Fresh picks for your pantry</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Shop now <ArrowRight className="size-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
