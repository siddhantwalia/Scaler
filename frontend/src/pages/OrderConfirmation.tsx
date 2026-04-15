import { useLocation, Link, Navigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/api/api";

interface OrderState {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  address: { name: string; address: string; phone: string; pincode: string };
}

const OrderConfirmation = () => {
  const location = useLocation();
  const state = location.state as OrderState | null;

  if (!state) return <Navigate to="/" replace />;

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-card rounded-sm flipkart-shadow p-8 text-center">
        <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-1">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-6">
          Your order <span className="font-semibold text-primary">#{state.orderId}</span> has been confirmed.
        </p>

        <div className="text-left border border-border rounded-sm divide-y divide-border mb-6">
          <div className="px-4 py-3 bg-muted">
            <h3 className="text-sm font-semibold text-foreground">Order Summary</h3>
          </div>
          {state.items.map(({ product, quantity }) => (
            <div key={product.id} className="px-4 py-3 flex gap-3 text-sm">
              <img src={product.images[0]} alt="" className="w-12 h-12 object-contain" />
              <div className="flex-1">
                <p className="text-foreground line-clamp-1">{product.name}</p>
                <p className="text-muted-foreground">Qty: {quantity}</p>
              </div>
              <span className="font-semibold text-foreground">₹{(product.price * quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="px-4 py-3 flex justify-between font-bold">
            <span className="text-foreground">Total Paid</span>
            <span className="text-foreground">₹{state.subtotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="text-left border border-border rounded-sm p-4 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">Delivery Address</h3>
          <p className="text-sm text-muted-foreground">
            {state.address.name}<br />
            {state.address.address}<br />
            Pincode: {state.address.pincode}<br />
            Phone: {state.address.phone}
          </p>
        </div>

        <Link to="/">
          <Button className="bg-primary text-primary-foreground font-semibold px-8">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default OrderConfirmation;
