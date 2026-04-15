import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/api";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CheckoutPage = () => {
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", address: "", phone: "", pincode: "" });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // restrict numeric fields
    if (name === "phone") {
      setForm((prev) => ({ ...prev, phone: value.replace(/\D/g, "").slice(0, 10) }));
      return;
    }

    if (name === "pincode") {
      setForm((prev) => ({ ...prev, pincode: value.replace(/\D/g, "").slice(0, 6) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const validate = () => {
    const newErrors = {
      name: "",
      phone: "",
      address: "",
      pincode: "",
    };

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!/^[0-9]{6}$/.test(form.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((e) => e === "");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const fullAddress = `${form.name}, ${form.address}, ${form.pincode}. Phone: ${form.phone}`;
      const order = await api.createOrder(fullAddress);

      queryClient.invalidateQueries({ queryKey: ["cart"] });

      navigate("/order-confirmation", {
        state: {
          orderId: order.id,
          items,
          subtotal,
          address: form
        }
      });
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-4">
      <div className="grid lg:grid-cols-3 gap-4">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-card rounded-sm flipkart-shadow">
          <div className="px-4 py-3 border-b border-border">
            <h1 className="text-lg font-semibold text-foreground">Shipping Address</h1>
          </div>
          <div className="p-4 grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123, Street Name, City"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="560001"
                className={errors.pincode ? "border-red-500" : ""}
              />
              {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode}</p>}
            </div>
          </div>
          <div className="px-4 py-3 border-t border-border flex justify-end">
            <Button disabled={isSubmitting} type="submit" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8">
              {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
            </Button>
          </div>
        </form>

        {/* Order Summary */}
        <div className="bg-card rounded-sm flipkart-shadow h-fit">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase">Order Summary</h2>
          </div>
          <div className="p-4 space-y-3">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 text-sm">
                <img src={product.images[0]} alt="" className="w-12 h-12 object-contain" />
                <div className="flex-1 min-w-0">
                  <p className="line-clamp-1 text-foreground">{product.name}</p>
                  <p className="text-muted-foreground">Qty: {quantity}</p>
                </div>
                <span className="font-semibold text-foreground">₹{(product.price * quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-border pt-3 flex justify-between font-bold text-base">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
