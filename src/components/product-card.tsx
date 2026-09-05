import { Link } from "@tanstack/react-router";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/catalog";
import { inr } from "@/lib/format";
import { useShop } from "@/context/shop";
import { cn } from "@/lib/utils";
import { RetryImage } from "./retry-image";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { qtyOf, addToCart, setQty, toggleWishlist, inWishlist } = useShop();
  const qty = qtyOf(product.id);
  const wished = inWishlist(product.id);

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <button
        type="button"
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => {
          toggleWishlist(product.id);
          toast.success(wished ? "Removed from wishlist" : `${product.name} saved to wishlist`);
        }}
        className="absolute top-4 right-4 z-10 grid size-8 place-items-center rounded-full bg-card/90 backdrop-blur transition-transform hover:scale-110"
      >
        <Heart
          className={cn("size-4 transition-colors", wished ? "animate-pop fill-destructive text-destructive" : "text-muted-foreground")}
        />
      </button>

      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative overflow-hidden rounded-xl bg-secondary">
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 z-10 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
              {product.discount}% OFF
            </span>
          )}
          <RetryImage
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        {product.badge && (
          <span className="mb-1.5 w-fit rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold tracking-wide text-accent-foreground uppercase">
            {product.badge}
          </span>
        )}
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="line-clamp-2 text-sm leading-snug font-semibold hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">{product.unit}</p>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-accent text-accent" />
          {product.rating} <span className="opacity-70">({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="min-w-0">
            <p className="text-sm font-bold">{inr(product.price)}</p>
            {product.mrp > product.price && (
              <p className="text-xs text-muted-foreground line-through">{inr(product.mrp)}</p>
            )}
          </div>

          {qty === 0 ? (
            <button
              type="button"
              onClick={() => {
                addToCart(product.id);
                toast.success(`${product.name} — ${product.unit} added to cart`);
              }}
              className="shrink-0 rounded-xl border border-primary bg-primary-soft px-4 py-1.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              ADD
            </button>
          ) : (
            <div className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-2 py-1.5 text-primary-foreground">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty(product.id, qty - 1)}>
                <Minus className="size-4" />
              </button>
              <span className="min-w-4 text-center text-sm font-bold">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty(product.id, qty + 1)}>
                <Plus className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
