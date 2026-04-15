import { Link } from "react-router-dom";
import { Package, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Product } from "@/data/products";
import StarRating from "@/components/StarRating";
import { api } from "@/api/api"; // ✅ backend API

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: number;
  total_amount: number;
  status: string;
  items: OrderItem[];
}

const statusColor: Record<string, string> = {
  Delivered: "text-green-600",
  Shipped: "text-primary",
  Processing: "text-yellow-600",
  Cancelled: "text-destructive",
};

const statusDot: Record<string, string> = {
  Delivered: "bg-green-600",
  Shipped: "bg-primary",
  Processing: "bg-yellow-600",
  Cancelled: "bg-destructive",
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders()
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter((order) =>
    searchQuery
      ? order.id.toString().includes(searchQuery) ||
        order.items.some((i) =>
          i.product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true
  );

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading your orders...</p>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <Package className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-foreground mb-2">No orders yet</h1>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't placed any orders.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-sm hover:bg-primary/90 transition-colors"
        >
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-4 max-w-4xl">
      {/* Header */}
      <div className="bg-card rounded-sm flipkart-shadow mb-4">
        <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border">
          <h1 className="text-lg font-semibold text-foreground">My Orders</h1>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* Orders list */}
        <div className="divide-y divide-border">
          {filteredOrders.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              No orders match your search.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="px-4 py-4">
                {/* Order meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">
                      Order{" "}
                      <span className="font-semibold text-foreground">
                        #{order.id}
                      </span>
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">Recently placed</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        statusDot[order.status] || "bg-gray-400"
                      }`}
                    />
                    <span className={statusColor[order.status] || "text-gray-500"}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                {order.items.map(({ product, quantity }) => (
                  <Link
                    to={`/product/${product.id}`}
                    key={product.id}
                    className="flex gap-4 py-2 group hover:bg-muted/30 -mx-2 px-2 rounded-sm transition-colors"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-contain flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {quantity}
                      </p>
                      <div className="mt-1">
                        <StarRating rating={product.rating} size="sm" />
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      <span className="text-sm font-semibold text-foreground">
                        ₹{(product.price * quantity).toLocaleString()}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}

                {/* Total */}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed border-border text-sm">
                  <span className="text-muted-foreground">Order Total</span>
                  <span className="font-bold text-foreground">
                    ₹{order.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default OrdersPage;