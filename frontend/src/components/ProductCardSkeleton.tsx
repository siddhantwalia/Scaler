const ProductCardSkeleton = () => (
  <div className="bg-card rounded-sm flipkart-shadow border border-border/50 animate-pulse">
    <div className="aspect-square bg-muted" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/4" />
      <div className="h-5 bg-muted rounded w-1/3" />
    </div>
  </div>
);

export default ProductCardSkeleton;
