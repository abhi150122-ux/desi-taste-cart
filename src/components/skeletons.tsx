import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-xl", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="w-[170px] shrink-0 space-y-3 rounded-2xl border bg-card p-3 sm:w-[200px]">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-2/5" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export function ProductRailSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="w-[104px] shrink-0 space-y-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <Skeleton className="mx-auto h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return <Skeleton className="h-[220px] w-full rounded-3xl md:h-[380px]" />;
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
