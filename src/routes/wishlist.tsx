import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteLayout, Container, Breadcrumbs } from "@/components/site-layout";
import { useShop } from "@/context/shop";
import { productById, type Product } from "@/lib/catalog";
import { inr } from "@/lib/format";
import { RetryImage } from "@/components/retry-image";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Jain Desi and Pure" },
      { name: "description", content: "Your saved pure desi grocery favourites, ready to move to cart." },
      { property: "og:title", content: "Wishlist — Jain Desi and Pure" },
      { property: "og:description", content: "Save and shop your favourite desi essentials." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      const products: Product[] = [];
      for (const id of wishlist) {
        const product = await productById(id);
        if (product) products.push(product);
      }
      setItems(products);
      setIsLoading(false);
    };

    loadItems();
  }, [wishlist]);

  return (
    <SiteLayout>
      <Container>
        <Breadcrumbs items={[{ label: "Wishlist" }]} />
        <h1 className="text-2xl font-bold sm:text-3xl">Wishlist</h1>

        {items.length === 0 ? (
          <div className="mx-auto mt-6 max-w-md rounded-3xl border bg-card p-10 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary-soft text-primary">
              <Heart className="size-7" />
            </span>
            <p className="mt-4 text-lg font-bold">Your wishlist is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any product to save it here.</p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {items.map((p) => (
              <div key={p.id} className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 rounded-2xl border bg-card p-3">
                <RetryImage
                  src={p.image}
                  alt={p.name}
                  width={160}
                  height={160}
                  loading="lazy"
                  className="size-20 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <Link
                    to="/product/$slug"
                    params={{ slug: p.slug }}
                    className="truncate text-sm font-semibold hover:text-primary"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {p.unit} · {inr(p.price)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(p.id);
                        toggleWishlist(p.id);
                        toast.success(`${p.name} moved to cart`);
                      }}
                      className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground"
                    >
                      Move to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(p.id)}
                      className="rounded-xl border px-4 py-1.5 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </SiteLayout>
  );
}
