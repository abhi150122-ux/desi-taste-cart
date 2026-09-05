import { useEffect, useState } from "react";
import { createFileRoute, notFound, useNavigate, Link } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShieldCheck, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, Container, Breadcrumbs } from "@/components/site-layout";
import { ProductSlider } from "@/components/product-slider";
import { productById, productBySlug, productsByCategory, sampleReviews, type Product } from "@/lib/catalog";
import { inr } from "@/lib/format";
import { useShop } from "@/context/shop";
import { PageLoader } from "@/components/page-loader";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    try {
      const product = await productBySlug(params.slug);
      if (!product) {
        console.warn(`Product not found: ${params.slug}`);
        throw notFound();
      }
      return { name: product.name, unit: product.unit, description: product.description };
    } catch (error) {
      console.error(`Error loading product ${params.slug}:`, error);
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Product not found — Jain Desi and Pure" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.name} — ${loaderData.unit} | Jain Desi and Pure`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description.slice(0, 155) },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart, qtyOf, setQty, toggleWishlist, inWishlist, markViewed, recentlyViewed } = useShop();
  const [qty, setLocalQty] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const prod = await productBySlug(slug);
        setProduct(prod || null);
        if (prod) {
          const relatedProducts = await productsByCategory(prod.category);
          setRelated(relatedProducts.filter((p) => p.slug !== slug).slice(0, 8));
        }
      } catch (error) {
        console.error(`Error loading product ${slug}:`, error);
        setProduct(null);
        setRelated([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  const [activeImage, setActiveImage] = useState(0);
  const inCart = product ? qtyOf(product.id) : 0;

  useEffect(() => {
    if (product) {
      markViewed(product.id);
      setLocalQty(1);
      setActiveImage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (isLoading || !product) {
    return (
      <SiteLayout>
        <Container>
          <Breadcrumbs items={[{ label: "Loading..." }]} />
          <PageLoader label="Loading product..." />
        </Container>
      </SiteLayout>
    );
  }

  const gallery = [product.image, product.image, product.image];
  const recent = recentlyViewed
    .filter((id) => id !== product.id)
    .map((id) => productById(id))
    .filter((p) => p !== undefined);

  return (
    <SiteLayout>
      <Container>
        <Breadcrumbs
          items={[{ label: product.categoryName, slug: product.category }, { label: product.name }]}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="group overflow-hidden rounded-3xl border border-accent/25 bg-card p-4">
              <img
                src={gallery[activeImage]}
                alt={product.name}
                width={700}
                height={700}
                className="aspect-square w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="mt-3 flex gap-3">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`View image ${i + 1}`}
                  onClick={() => setActiveImage(i)}
                  className={`size-20 overflow-hidden rounded-xl border-2 ${i === activeImage ? "border-primary" : "border-border"}`}
                >
                  <img src={g} alt="" width={80} height={80} loading="lazy" className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            {product.badge && (
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold tracking-wide text-accent-foreground uppercase">
                {product.badge}
              </span>
            )}
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{product.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{product.unit}</p>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1 rounded-lg bg-success px-2 py-0.5 text-xs font-semibold text-success-foreground">
                <Star className="size-3 fill-current" /> {product.rating}
              </span>
              <span className="text-muted-foreground">{product.reviewCount} reviews</span>
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-3">
              <span className="text-3xl font-bold">{inr(product.price)}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{inr(product.mrp)}</span>
                  <span className="rounded-md bg-primary-soft px-2 py-0.5 text-sm font-bold text-primary">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

            <p className={`mt-3 text-sm font-semibold ${product.stock > 0 ? "text-primary" : "text-destructive"}`}>
              {product.stock > 0 ? `In stock — ${product.stock} packs available` : "Out of stock"}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-xl border px-3 py-2.5">
                <button type="button" aria-label="Decrease" onClick={() => setLocalQty((q) => Math.max(1, q - 1))}>
                  <Minus className="size-4" />
                </button>
                <span className="min-w-6 text-center font-bold">{qty}</span>
                <button type="button" aria-label="Increase" onClick={() => setLocalQty((q) => q + 1)}>
                  <Plus className="size-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(product.id, qty);
                  toast.success(`${product.name} — ${product.unit} added to cart`);
                }}
                className="flex-1 rounded-xl border border-primary bg-primary-soft px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:flex-none"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => {
                  addToCart(product.id, qty);
                  navigate({ to: "/checkout" });
                }}
                className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground sm:flex-none"
              >
                Buy Now
              </button>
              <button
                type="button"
                aria-label="Toggle wishlist"
                onClick={() => {
                  toggleWishlist(product.id);
                  toast.success(inWishlist(product.id) ? "Removed from wishlist" : "Saved to wishlist");
                }}
                className="grid size-11 place-items-center rounded-xl border"
              >
                <Heart className={inWishlist(product.id) ? "size-5 fill-destructive text-destructive" : "size-5"} />
              </button>
            </div>

            {inCart > 0 && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-primary-soft px-4 py-2.5 text-sm">
                <span className="font-medium text-primary">{inCart} in your cart</span>
                <button type="button" onClick={() => setQty(product.id, 0)} className="text-xs font-semibold underline">
                  Remove
                </button>
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border bg-card p-4">
                <Truck className="size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">Delivery in 24-48 hours</p>
                  <p className="text-xs text-muted-foreground">Free delivery above ₹1,499</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border bg-card p-4">
                <ShieldCheck className="size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">Purity guaranteed</p>
                  <p className="text-xs text-muted-foreground">No adulteration, no preservatives</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-bold">Product Description</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-bold">Product Information</h2>
            <dl className="mt-3 grid gap-2 text-sm">
              {[
                ["Net Quantity", product.unit],
                ["Ingredients", `100% ${product.name.toLowerCase()}, nothing else added`],
                ["Country of Origin", "India"],
                ["Storage", "Store in a cool, dry place away from direct sunlight"],
                ["Manufacturer", "Jain Desi and Pure Foods, Indore, Madhya Pradesh"],
                ["Shelf Life", "6 months from date of packaging"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[120px_minmax(0,1fr)] gap-2 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border bg-card p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="text-lg font-bold">Customer Reviews</h2>
            <Link to="/search" search={{ q: product.categoryName }} className="text-xs font-semibold text-primary">
              Similar products
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {sampleReviews.map((r) => (
              <div key={r.name} className="rounded-xl bg-secondary/60 p-4">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-[11px] text-muted-foreground">{r.date}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-accent">{"★".repeat(r.rating)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        <ProductSlider title="Related Products" products={related} viewAllSlug={product.category} />
        {recent.length > 0 && <ProductSlider title="Recently Viewed" products={recent} />}
      </Container>
    </SiteLayout>
  );
}
