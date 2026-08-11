import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CATEGORY_IMAGES } from "@/lib/catalog";

const banners = [
  {
    slug: "cold-pressed-oils",
    title: "Cold Pressed Oils",
    text: "Wood churned, chemical free",
    cta: "Shop Oils",
  },
  {
    slug: "breakfast-healthy",
    title: "Healthy Breakfast",
    text: "Poha, dalia, oats & more",
    cta: "Start Fresh",
  },
  {
    slug: "namkeen-snacks",
    title: "Traditional Indian Snacks",
    text: "Namkeen fried in pure oil",
    cta: "Snack Now",
  },
  {
    slug: "dals-pulses",
    title: "Premium Dals & Grains",
    text: "Unpolished & farm sourced",
    cta: "Stock Up",
  },
];

export function PromoSlider() {
  return (
    <section className="py-6">
      <div className="rail -mx-4 gap-4 px-4 pb-2 sm:mx-0 sm:px-0">
        {banners.map((b) => (
          <Link
            key={b.slug}
            to="/category/$slug"
            params={{ slug: b.slug }}
            className="group relative flex w-[78vw] shrink-0 items-center gap-4 overflow-hidden rounded-2xl border border-accent/25 bg-card p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)] sm:w-[340px]"
          >
            <img
              src={CATEGORY_IMAGES[b.slug]}
              alt={b.title}
              width={200}
              height={200}
              loading="lazy"
              className="size-20 shrink-0 rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold">{b.title}</h3>
              <p className="truncate text-xs text-muted-foreground">{b.text}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                {b.cta} <ArrowRight className="size-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
