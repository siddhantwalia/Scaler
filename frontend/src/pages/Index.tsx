import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/api";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import CategoryBar from "@/components/CategoryBar";

const Index = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";
  
  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ["products", category, searchQuery],
    queryFn: () => api.getProducts(category, searchQuery),
  });

  const filtered = products; // Already filtered by backend

  return (
    <>
      <CategoryBar />
      <div className="bg-[#f1f3f6] min-h-[calc(100vh-64px)] py-4">
        <main className="container mx-auto px-2 sm:px-4 max-w-[1248px]">
        {searchQuery && (
          <p className="text-sm text-muted-foreground mb-4">
            Showing results for "<span className="font-semibold text-foreground">{searchQuery}</span>"
          </p>
        )}
        {category !== "All" && !searchQuery && (
          <h1 className="text-lg font-bold mb-4 text-foreground">{category}</h1>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-sm shadow-sm">
            <p className="text-lg text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      </div>
    </>
  );
};

export default Index;
