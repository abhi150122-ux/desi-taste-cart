import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getHomeBanners, type HomeBanner } from "@/lib/catalog";

function getBannerSlug(targetUrl?: string) {
  if (!targetUrl) return "categories";
  const trimmed = targetUrl.trim();
  if (!trimmed) return "categories";
  return trimmed.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean).at(-1) || "categories";
}

export function HeroSlider() {
  const [slides, setSlides] = useState<Array<{
    image: string;
    slug: string;
    targetUrl?: string;
  }>>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const loadSlides = async () => {
      const banners = await getHomeBanners();
      const normalized = banners.slice(0, 5).map((banner: HomeBanner) => ({
        image: banner.image_url,
        slug: getBannerSlug(banner.target_url),
        targetUrl: banner.target_url,
      }));
      setSlides(normalized);
    };

    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const go = (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length);

  if (slides.length === 0) return null;

  const renderSlide = (s: { image: string; slug: string; targetUrl?: string }, i: number) => {
    const slideLink = s.targetUrl && s.targetUrl.trim() ? s.targetUrl.trim() : undefined;
    const slideContent = (
      <img
        src={s.image}
        alt={s.slug}
        width={1600}
        height={640}
        loading={i === 0 ? "eager" : "lazy"}
        className="h-full w-full rounded-none object-cover"
      />
    );

    if (!slideLink) {
      return (
        <div
          key={`${s.slug}-${i}`}
          className={`absolute inset-0 p-3 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          {slideContent}
        </div>
      );
    }

    if (/^https?:\/\//i.test(slideLink)) {
      return (
        <a
          key={`${s.slug}-${i}`}
          href={slideLink}
          target="_blank"
          rel="noreferrer"
          className={`absolute inset-0 block p-3 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          {slideContent}
        </a>
      );
    }

    const normalizedLink = slideLink.startsWith("/") ? slideLink : `/${slideLink}`;
    return (
      <Link
        key={`${s.slug}-${i}`}
        to={normalizedLink as any}
        className={`absolute inset-0 block p-3 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        {slideContent}
      </Link>
    );
  };

  return (
    <section className="relative overflow-hidden border border-accent/25 bg-card p-3 shadow-[var(--shadow-card)]">
      <div className="relative h-[260px] w-full overflow-hidden bg-transparent sm:h-[320px] md:h-[400px]">
        {slides.map(renderSlide)}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => go(-1)}
        className="absolute top-1/2 left-6 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-card/85 shadow backdrop-blur hover:bg-card"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => go(1)}
        className="absolute top-1/2 right-6 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-card/85 shadow backdrop-blur hover:bg-card"
      >
        <ChevronRight className="size-4" />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={`${s.slug}-${i}-dot`}
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
