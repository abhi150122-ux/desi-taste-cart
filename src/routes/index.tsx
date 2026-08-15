import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, Leaf, ShieldCheck, Wheat } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteLayout, Container } from "@/components/site-layout";
import { HeroSlider } from "@/components/hero-slider";
import { PromoSlider } from "@/components/promo-slider";
import { CategorySlider } from "@/components/category-slider";
import { ProductSlider } from "@/components/product-slider";
import { getHomeSections, productById, type Product } from "@/lib/catalog";
import { useShop } from "@/context/shop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jain Desi and Pure — Cold Pressed Oils, Ghee, Dals & Atta Online" },
      {
        name: "description",
        content:
          "Order cold pressed oils, bilona desi ghee, unpolished dals, stone ground atta, spices and traditional Indian snacks. Pure Desi Taste, Naturally Better.",
      },
      { property: "og:title", content: "Jain Desi and Pure — Pure Desi Taste, Naturally Better" },
      {
        property: "og:description",
        content: "Quick delivery of cold pressed oils, desi ghee, dals, attas, spices and healthy desi snacks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const usps = [
  { icon: Leaf, title: "100% Natural", text: "Traditional and carefully selected products." },
  { icon: ShieldCheck, title: "Cold Pressed Oils", text: "Naturally extracted, never chemically refined." },
  { icon: Wheat, title: "Premium Quality", text: "Carefully sourced grains and pulses." },
  { icon: HeartHandshake, title: "Made with Care", text: "Traditional taste with modern quality standards." },
];

function Index() {
  const { recentlyViewed } = useShop();
  const [homeSections, setHomeSections] = useState<any[]>([]);
  const [recent, setRecent] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSections = async () => {
      try {
        setIsLoading(true);
        console.log("[HOME] Loading home sections...");
        
        const sections = await getHomeSections();
        console.log("[HOME] Loaded sections:", sections);
        setHomeSections(sections);
        
        // Load recently viewed products
        const recentProducts: Product[] = [];
        for (const id of recentlyViewed) {
          const product = await productById(id);
          if (product) recentProducts.push(product);
        }
        setRecent(recentProducts);
        
        setIsLoading(false);
      } catch (error) {
        console.error("[HOME] Error loading sections:", error);
        setIsLoading(false);
      }
    };
    
    loadSections();
  }, [recentlyViewed]);

  return (
    <SiteLayout>
      <Container className="pt-4">
        <HeroSlider />
        <PromoSlider />
        <CategorySlider />

        {isLoading ? (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : homeSections.length > 0 ? (
          homeSections.map((section) => (
            <ProductSlider
              key={section.title}
              title={section.title}
              products={section.items}
              {...(section.slug ? { viewAllSlug: section.slug } : {})}
            />
          ))
        ) : (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">No products available</p>
          </div>
        )}

        {recent.length > 0 && <ProductSlider title="Recently Viewed" products={recent} />}

        <section className="my-10 rounded-3xl border border-accent/25 bg-card p-6 sm:p-10">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Why Jain Desi and Pure?</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Built on the simple promise our family has kept for decades — nothing added, nothing hidden.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {usps.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-primary-soft/60 p-5">
                <span className="grid size-11 place-items-center rounded-2xl bg-card text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-bold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/categories"
              className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              Browse All Categories
            </Link>
          </div>
        </section>
      </Container>
    </SiteLayout>
  );
}
