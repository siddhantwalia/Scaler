import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <main className="container mx-auto px-4 py-4">
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Cart items */}
        <div className="lg:col-span-2 bg-card rounded-sm flipkart-shadow">
          <div className="px-4 py-3 border-b border-border">
            <h1 className="text-lg font-semibold text-foreground">
              My Cart ({items.reduce((s, i) => s + i.quantity, 0)})
            </h1>
          </div>
          <div className="divide-y divide-border">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="p-4 flex gap-4">
                <Link to={`/product/${product.id}`} className="w-24 h-24 flex-shrink-0">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product.id}`} className="text-sm font-medium text-foreground hover:text-primary line-clamp-2">
                    {product.name}
                  </Link>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-bold text-foreground">₹{product.price.toLocaleString()}</span>
                    {product.discount > 0 && (
                      <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-border rounded-full overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-1.5 hover:bg-muted disabled:opacity-40 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm font-semibold border-x border-border bg-muted/30">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1.5 hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-xs font-semibold text-foreground/60 hover:text-destructive uppercase flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border flex justify-end">
            <Button
              onClick={() => navigate("/checkout")}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8"
            >
              PLACE ORDER
            </Button>
          </div>
        </div>

        {/* Price summary */}
        <div className="bg-card rounded-sm flipkart-shadow h-fit sticky top-20">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase">Price Details</h2>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground">Price ({items.length} items)</span>
              <span className="text-foreground">₹{items.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Discount</span>
              <span className="text-discount">
                − ₹{(items.reduce((s, i) => s + (i.product.originalPrice - i.product.price) * i.quantity, 0)).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Delivery Charges</span>
              <span className="text-discount font-medium">FREE</span>
            </div>
            <div className="border-t border-dashed border-border pt-3 flex justify-between font-bold text-base">
              <span className="text-foreground">Total Amount</span>
              <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
