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
    <main className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="bg-card rounded-sm flipkart-shadow">
        <div className="px-6 py-4 border-b border-border">
          <h1 className="text-lg font-bold text-foreground">
            My Wishlist ({items.length})
          </h1>
        </div>

        <div className="divide-y divide-border">
          {items.map((product) => (
            <div
              key={product.id}
              className="p-6 flex flex-col sm:flex-row gap-6 relative group"
            >
              <Link to={`/product/${product.id}`} className="flex-shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-contain"
                />
              </Link>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-start">
                  <Link
                    to={`/product/${product.id}`}
                    className="hover:text-primary transition-colors pr-8"
                  >
                    <h3 className="text-base font-normal text-foreground line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-destructive shrink-0"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-success text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    {product.rating} ★
                  </div>
                  <span className="text-xs text-muted-foreground font-semibold">({product.ratingCount.toLocaleString()})</span>
                  <img
                    src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fa_6296a1.png"
                    alt="fassured"
                    className="h-3.5 w-auto object-contain"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-foreground">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-success font-semibold">
                        {product.discount}% off
                      </span>
                    </>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    size="lg"
                    onClick={() => handleMoveToCart(product)}
                    disabled={!product.inStock}
                    className="bg-secondary text-secondary-foreground font-bold text-sm tracking-wide rounded-sm px-8"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    MOVE TO CART
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default WishlistPage;