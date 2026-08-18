export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[260px] items-center justify-center py-12">
      <div className="flex items-center gap-3 rounded-full border border-accent/25 bg-card px-5 py-3 shadow-[var(--shadow-card)]">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
