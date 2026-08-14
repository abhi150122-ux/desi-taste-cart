import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroOils from "@/assets/hero-oils.jpg";
import heroGhee from "@/assets/hero-ghee.jpg";
import heroHealthy from "@/assets/hero-healthy.jpg";

const slides = [
  {
    image: heroOils,
    eyebrow: "Cold Pressed Oils",
    title: "Pure Desi Products Delivered to Your Door",
    text: "Cold pressed oils, authentic grains, dals, spices, snacks and more.",
    cta: "Shop Oils",
    slug: "cold-pressed-oils",
  },
  {
    image: heroGhee,
    eyebrow: "Desi Ghee & Traditional Foods",
    title: "Authentic Taste From Traditional Recipes",
    text: "Bilona churned ghee, homemade pickles, papad and mithai made the old way.",
    cta: "Explore",
    slug: "ghee-dairy",
  },
  {
    image: heroHealthy,
    eyebrow: "Healthy Everyday Essentials",
    title: "Wholesome Grains, Dals, Seeds & Snacks",
    text: "Unpolished dals, millet attas and roasted snacking you can trust daily.",
    cta: "Shop Healthy",
    slug: "healthy-snacks",
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  const go = (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-accent/25 bg-card shadow-[var(--shadow-card)]">
      <div className="relative h-[260px] w-full sm:h-[320px] md:h-[400px]">
        {slides.map((s, i) => (
          <div
            key={s.eyebrow}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <img
              src={s.image}
              alt={s.eyebrow}
              width={1600}
              height={640}
              loading={i === 0 ? "eager" : "lazy"}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-xl px-6 sm:px-10 md:px-14">
                <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">{s.eyebrow}</p>
                <h1 className="mt-2 text-2xl leading-tight font-bold text-white sm:text-4xl md:text-5xl">{s.title}</h1>
                <p className="mt-3 max-w-md text-sm text-white/80 sm:text-base">{s.text}</p>
                <Link
                  to="/category/$slug"
                  params={{ slug: s.slug }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:scale-105"
                >
                  {s.cta}
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => go(-1)}
        className="absolute top-1/2 left-3 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-card/85 shadow backdrop-blur hover:bg-card"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => go(1)}
        className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-card/85 shadow backdrop-blur hover:bg-card"
      >
        <ChevronRight className="size-4" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.eyebrow}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-primary" : "w-2 bg-primary/30"}`}
          />
        ))}
      </div>
    </section>
  );
}
