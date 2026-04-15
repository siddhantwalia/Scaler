import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/api";
import { useCart } from "@/context/CartContext";
import StarRating from "@/components/StarRating";
import { ShoppingCart, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imageIndex, setImageIndex] = useState(0);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProductById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 bg-card p-4 md:p-8 rounded-sm shadow-sm animate-pulse">
            <div className="aspect-square bg-muted rounded-sm"></div>
            <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-10 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded w-full"></div>
            </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground">Product not found.</p>
        <Button variant="link" onClick={() => navigate("/")} className="mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="bg-card rounded-sm flipkart-shadow p-4 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image carousel */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-card border border-border rounded-sm flex items-center justify-center overflow-hidden">
              <img
                src={product.images[imageIndex]}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setImageIndex((i) => (i === 0 ? product.images.length - 1 : i - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/90 rounded-full p-1 flipkart-shadow hover:bg-card transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-foreground" />
                  </button>
                  <button
                    onClick={() => setImageIndex((i) => (i === product.images.length - 1 ? 0 : i + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/90 rounded-full p-1 flipkart-shadow hover:bg-card transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-foreground" />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`w-16 h-16 border-2 rounded-sm overflow-hidden transition-colors ${
                      i === imageIndex ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 text-base font-semibold"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                ADD TO CART
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
              >
                <Zap className="h-5 w-5 mr-2" />
                BUY NOW
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h1 className="text-lg md:text-xl font-medium text-foreground">{product.name}</h1>

            <StarRating rating={product.rating} count={product.ratingCount} size="md" />

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-foreground">₹{product.price.toLocaleString()}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-base text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="text-base text-discount font-semibold">{product.discount}% off</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold ${
                product.inStock ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              }`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Specs */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Specifications</h3>
              <div className="border border-border rounded-sm divide-y divide-border">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex text-sm">
                    <span className="w-1/3 px-3 py-2 bg-muted text-muted-foreground font-medium">{key}</span>
                    <span className="flex-1 px-3 py-2 text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
