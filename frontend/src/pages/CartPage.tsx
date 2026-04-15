import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/api/api";
import { toast } from "sonner";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="text-xl font-medium text-foreground mb-2">Your cart is empty!</h2>
        <p className="text-muted-foreground mb-6">Add items to it now.</p>
        <Link to="/">
          <Button className="bg-primary text-primary-foreground">Shop Now</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-4 max-w-6xl">
      <div className="grid lg:grid-cols-3 gap-4 items-start">
        {/* Cart items */}
        <div className="lg:col-span-2 bg-card rounded-sm flipkart-shadow">
          <div className="px-6 py-4 border-b border-border">
            <h1 className="text-lg font-semibold text-foreground">
              Flipkart ({items.reduce((s, i) => s + i.quantity, 0)})
            </h1>
          </div>
          <div className="divide-y divide-border">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="p-6 flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Link to={`/product/${product.id}`} className="w-28 h-28 flex-shrink-0">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />
                  </Link>
                  <div className="flex items-center border border-border rounded-sm overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center hover:bg-muted disabled:opacity-30 transition-colors border-r"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <input 
                      type="text" 
                      readOnly 
                      value={quantity} 
                      className="w-10 h-7 text-center text-sm font-bold bg-transparent outline-none"
                    />
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors border-l"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="space-y-1">
                    <Link to={`/product/${product.id}`} className="text-base font-normal text-foreground hover:text-primary line-clamp-1">
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">Seller: Scaler Retail</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">₹{product.price.toLocaleString()}</span>
                    {product.discount > 0 && (
                      <>
                        <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                        <span className="text-sm text-success font-semibold">{product.discount}% Off</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <button
                      onClick={async () => {
                        try {
                          await api.addToWishlist(product.id);
                          removeFromCart(product.id);
                          toast.success("Saved for later");
                          window.dispatchEvent(new Event("wishlistUpdated"));
                        } catch {
                          toast.error("Failed to save for later");
                        }
                      }}
                      className="text-sm font-bold text-foreground hover:text-primary uppercase transition-colors"
                    >
                      Save for later
                    </button>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-sm font-bold text-foreground hover:text-primary uppercase transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-sm text-foreground/80">
                  Delivery by Tomorrow, Thu | <span className="text-success font-medium">Free</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end sticky bottom-0 bg-card shadow-[0_-2px_10px_0_rgba(0,0,0,0.1)]">
            <Button
              onClick={() => navigate("/checkout")}
              className="bg-[#fb641b] hover:bg-[#fb641b]/90 text-white font-bold px-12 py-6 text-base rounded-sm"
            >
              PLACE ORDER
            </Button>
          </div>
        </div>

        {/* Price summary */}
        <div className="bg-card rounded-sm flipkart-shadow h-fit sticky top-20">
          <div className="px-6 py-3 border-b border-border">
            <h2 className="text-base font-bold text-muted-foreground uppercase opacity-70">Price Details</h2>
          </div>
          <div className="p-6 space-y-5 text-base">
            <div className="flex justify-between">
              <span className="text-foreground">Price ({items.length} items)</span>
              <span className="text-foreground">₹{items.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Discount</span>
              <span className="text-success">
                − ₹{(items.reduce((s, i) => s + (i.product.originalPrice - i.product.price) * i.quantity, 0)).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Delivery Charges</span>
              <span className="text-success font-medium">FREE</span>
            </div>
            <div className="border-t border-dashed border-border pt-4 flex justify-between font-bold text-lg">
              <span className="text-foreground">Total Amount</span>
              <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="text-success font-bold text-sm tracking-tight border-t border-dashed border-border pt-4">
              You will save ₹{(items.reduce((s, i) => s + (i.product.originalPrice - i.product.price) * i.quantity, 0)).toLocaleString()} on this order
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
