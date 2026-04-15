import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/api";
import { useCart } from "@/context/CartContext";
import StarRating from "@/components/StarRating";
import { ShoppingCart, Zap, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  // Fetch product
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProductById(Number(id)),
    enabled: !!id,
  });

  // Check wishlist status
  useEffect(() => {
    if (product) {
      api.getWishlist().then((items) => {
        setWishlisted(items.some((p: any) => p.id === product.id));
      });
    }
  }, [product]);

  // Handlers
  const handleAddToCart = async () => {
    addToCart(product);
    toast.success("Added to cart!");

    try {
      await api.removeFromWishlist(product.id);
      setWishlisted(false);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch { }
  };

  const handleBuyNow = async () => {
    addToCart(product);

    try {
      await api.removeFromWishlist(product.id);
      setWishlisted(false);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch { }

    navigate("/cart");
  };

  const handleWishlistToggle = async () => {
    try {
      if (wishlisted) {
        await api.removeFromWishlist(product.id);
        setWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await api.addToWishlist(product.id);
        setWishlisted(true);
        toast.success("Added to wishlist");
      }

      // 🔥 ADD THIS
      window.dispatchEvent(new Event("wishlistUpdated"));

    } catch {
      toast.error("Something went wrong");
    }
  };

  // Loading UI
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

  // Error UI
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

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="bg-card rounded-sm flipkart-shadow p-4 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">

          {/* Image Section */}
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
                    onClick={() =>
                      setImageIndex((i) =>
                        i === 0 ? product.images.length - 1 : i - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/90 rounded-full p-1 flipkart-shadow"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() =>
                      setImageIndex((i) =>
                        i === product.images.length - 1 ? 0 : i + 1
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/90 rounded-full p-1 flipkart-shadow"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-secondary text-secondary-foreground h-12 font-semibold"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                ADD TO CART
              </Button>

              <Button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 bg-primary text-primary-foreground h-12 font-semibold"
              >
                <Zap className="h-5 w-5 mr-2" />
                BUY NOW
              </Button>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">

            {/* Title + Wishlist */}
            <div className="flex items-start justify-between">
              <h1 className="text-lg md:text-xl font-medium">
                {product.name}
              </h1>

              <button
                onClick={handleWishlistToggle}
                className="p-2 rounded-full hover:bg-muted"
              >
                <Heart
                  className={`h-5 w-5 ${wishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground"
                    }`}
                />
              </button>
            </div>

            <StarRating rating={product.rating} count={product.ratingCount} />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold">
                ₹{product.price.toLocaleString()}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="line-through text-muted-foreground">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-discount font-semibold">
                    {product.discount}% off
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <span
              className={`text-sm font-semibold ${product.inStock ? "text-green-600" : "text-red-500"
                }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>

            {/* Description */}
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>

            {/* Specs */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Specifications</h3>
              <div className="border rounded-sm divide-y">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex text-sm">
                    <span className="w-1/3 px-3 py-2 bg-muted">
                      {key}
                    </span>
                    <span className="flex-1 px-3 py-2">
                      {value}
                    </span>
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