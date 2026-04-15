import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const WishlistPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchWishlist = () => {
    api.getWishlist()
      .then(setItems)
      .catch(() => toast.error("Failed to load wishlist"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleMoveToCart = async (product: any) => {
    try {
      addToCart(product);
      await api.removeFromWishlist(product.id);
      toast.success("Moved to cart!");

      setItems(prev => prev.filter(p => p.id !== product.id));

      // 🔥 ADD THIS
      window.dispatchEvent(new Event("wishlistUpdated"));

    } catch {
      toast.error("Failed to move item");
    }
  };
  const handleRemove = async (id: number) => {
    try {
      await api.removeFromWishlist(id);
      toast.success("Removed from wishlist");
      setItems((prev) => prev.filter((p) => p.id !== id));
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch {
      toast.error("Failed to remove item");
    }
  };

  if (loading) {
    return <p className="p-6 text-center">Loading wishlist...</p>;
  }

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Empty Wishlist</h2>
        <p className="text-muted-foreground mb-6">
          You have no items in your wishlist. Start adding!
        </p>
        <Link to="/">
          <Button>Continue Shopping</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-lg font-semibold text-foreground mb-4">
        My Wishlist ({items.length})
      </h1>

      <div className="space-y-3">
        {items.map((product) => (
          <div
            key={product.id}
            className="bg-card rounded-sm flipkart-shadow border border-border/50 p-4 flex gap-4"
          >
            <Link to={`/product/${product.id}`} className="flex-shrink-0">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <Link
                to={`/product/${product.id}`}
                className="hover:text-primary transition-colors"
              >
                <h3 className="text-sm md:text-base font-medium text-foreground line-clamp-2">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-base font-bold text-foreground">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-discount font-semibold">
                      {product.discount}% off
                    </span>
                  </>
                )}
              </div>

              <p
                className={`text-xs mt-1 font-semibold ${product.inStock ? "text-green-600" : "text-red-500"
                  }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={() => handleMoveToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Move to Cart
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemove(product.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default WishlistPage;