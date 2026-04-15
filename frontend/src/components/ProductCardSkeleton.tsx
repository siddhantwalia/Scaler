const ProductCardSkeleton = () => (
  <div className="bg-white hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] transition-shadow duration-300 flex flex-col overflow-hidden relative animate-pulse">
    <div className="absolute top-3 right-3 z-10 w-[20px] h-[20px] bg-muted rounded-full" />
    
    <div className="relative aspect-[1] w-full bg-white p-6 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full h-full bg-muted rounded-sm" />
    </div>

    <div className="px-5 pb-5 pt-2 flex flex-col gap-1.5 flex-1 space-y-3">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="h-6 bg-muted rounded w-1/3 mt-auto" />
    </div>
  </div>
);

export default ProductCardSkeleton;
