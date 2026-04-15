import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/api";
import { useCart } from "@/context/CartContext";
import StarRating from "@/components/StarRating";
import { ShoppingCart, Zap, ChevronLeft, ChevronRight, Heart, Star, Camera, Cpu, Smartphone, ShieldCheck, Tag, Layout, BookOpen, Layers } from "lucide-react";
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
    const syncWishlist = () => {
      if (product) {
        api.getWishlist().then((items) => {
          setWishlisted(items.some((p: any) => p.id === product.id));
        });
      }
    };

    syncWishlist();
    window.addEventListener("wishlistUpdated", syncWishlist);
    return () => window.removeEventListener("wishlistUpdated", syncWishlist);
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
    // Optimistic update
    const previousState = wishlisted;
    setWishlisted(!previousState);

    try {
      if (previousState) {
        await api.removeFromWishlist(product.id);
        toast.success("Removed from wishlist");
      } else {
        await api.addToWishlist(product.id);
        toast.success("Added to wishlist");
      }
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch {
      setWishlisted(previousState);
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
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Image and Primary Actions Column */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:sticky lg:top-24">
            {/* Side Thumbnails (Desktop Only) */}
            <div className="hidden lg:flex flex-col gap-2 w-16 shrink-0">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onMouseEnter={() => setImageIndex(idx)}
                  className={`w-14 h-16 border rounded-sm overflow-hidden p-1 transition-all ${imageIndex === idx ? "border-primary ring-[0.5px] ring-primary" : "border-border hover:border-primary/50"
                    }`}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            <div className="flex-1 w-full space-y-4">
              <div className="relative aspect-[4/3] w-full bg-white border border-border/50 rounded-sm flex items-center justify-center overflow-hidden p-4 group shadow-sm">
                <img
                  src={product.images[imageIndex]}
                  alt={product.name}
                  className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />

                <button
                  onClick={handleWishlistToggle}
                  className="absolute top-3 right-3 p-2 bg-card rounded-full shadow-md border hover:scale-110 transition-all z-10"
                >
                  <Heart
                    className={`h-5 w-5 ${wishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-gray-300"
                      }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground h-14 font-bold text-sm tracking-wide rounded-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  ADD TO CART
                </Button>

                <Button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 bg-[#fb641b] hover:bg-[#fb641b]/90 text-white h-14 font-bold text-sm tracking-wide rounded-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  BUY NOW
                </Button>
              </div>
            </div>
          </div>

          {/* Details Section Column */}
          <div className="space-y-6">
            <nav className="text-[12px] text-muted-foreground flex items-center gap-1.5 mb-1">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="opacity-50 text-[10px]">{">"}</span>
              <span className="hover:text-primary">{product.category}</span>
              <span className="opacity-50 text-[10px]">{">"}</span>
              <span className="text-foreground font-medium line-clamp-1 truncate max-w-[200px]">{product.name}</span>
            </nav>

            {/* Header info */}
            <div className="space-y-1.5">
              <h1 className="text-lg md:text-xl font-normal text-[#212121] leading-snug">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-success text-white px-1.5 py-0.5 rounded-[3px] text-[12px] font-bold">
                  {product.rating} <Star className="h-3 w-3 fill-current" />
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                  {product.ratingCount.toLocaleString()} Ratings & {Math.floor(product.ratingCount / 10).toLocaleString()} Reviews
                </span>
                <img
                  src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
                  alt="fassured"
                  className="h-5 w-auto object-contain ml-2"
                />
              </div>
            </div>

            {/* Price & Offers */}
            <div className="space-y-1 py-1 border-b border-dashed pb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold tracking-tight">₹{product.price.toLocaleString()}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-base text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="text-success font-bold text-base">{product.discount}% off</span>
                  </>
                )}
              </div>
              
              <p className={`text-sm font-medium pt-1 ${product.stock > 0 ? "text-[#388e3c]" : "text-red-500"}`}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </p>
              {product.stock > 0 && product.stock < 10 && (
                <p className="text-xs text-[#ff9f00] font-medium leading-none">
                  Only {product.stock} left in stock!
                </p>
              )}

              <p className="text-[12px] text-[#212121] font-semibold flex items-center gap-1 mt-2">
                + ₹69 Secured Packaging Fee 
                <span className="rounded-full h-3 w-3 border border-muted-foreground text-[8px] flex items-center justify-center cursor-help">?</span>
              </p>
            </div>

            {/* Delivery Info */}
            <div className="flex gap-10 text-sm">
              <span className="text-muted-foreground font-semibold w-24 shrink-0">Delivery</span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-bold">
                  <span>Delivery by Tomorrow, Thursday</span>
                  <span className="text-muted-foreground text-xs font-normal">|</span>
                  <span className="text-success">Free</span>
                  <span className="line-through text-muted-foreground text-xs font-normal">₹40</span>
                </div>
                <p className="text-xs text-muted-foreground">If ordered before 11:59 PM</p>
                <button className="text-primary text-[12px] font-bold hover:underline">View Details</button>
              </div>
            </div>

            {/* Available offers */}
            <div className="space-y-3 py-4 border-b border-dashed">
              <h3 className="text-base font-bold text-[#212121]">Available offers</h3>
              {[
                "Bank Offer 10% off on ICICI Bank Credit Cards, up to ₹1,250 on orders of ₹5,000 and above",
                "Bank Offer 10% off on Axis Bank Credit Card Transactions, up to ₹1,000",
                "Special Price Get extra 15% off (price inclusive of cashback/coupon)",
                "Partner Offer Sign up for Flipkart Pay Later and get Flipkart Gift Card worth up to ₹500*"
              ].map((offer, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[#212121]">
                  <Tag className="h-4 w-4 mt-1 text-success shrink-0" />
                  <span>
                    <span className="font-bold">{offer.split(' ')[0]} {offer.split(' ')[1]}</span>
                    {offer.substring(offer.indexOf(offer.split(' ')[1]) + offer.split(' ')[1].length)}
                    <button className="text-primary font-bold ml-1 hover:underline">T&C</button>
                  </span>
                </div>
              ))}
            </div>

            {/* Product Highlights Section */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-bold text-[#212121] flex items-center justify-between group cursor-pointer">
                Product highlights
                <ChevronLeft className="h-5 w-5 -rotate-90 text-muted-foreground group-hover:text-foreground transition-colors" />
              </h3>
              <div className="space-y-4">
                {product.highlights.map((highlight: string, idx: number) => {
                  const getIcon = (text: string) => {
                    const lower = text.toLowerCase();
                    if (lower.includes("ram") || lower.includes("rom") || lower.includes("storage")) return <Cpu className="h-5 w-5" />;
                    if (lower.includes("display") || lower.includes("inch") || lower.includes("screen")) return <Smartphone className="h-5 w-5" />;
                    if (lower.includes("camera") || lower.includes("mp")) return <Camera className="h-5 w-5" />;
                    if (lower.includes("battery") || lower.includes("mah") || lower.includes("playtime")) return <Zap className="h-5 w-5" />;
                    if (lower.includes("processor") || lower.includes("chip") || lower.includes("snapdragon")) return <Cpu className="h-5 w-5" />;
                    if (lower.includes("warranty")) return <ShieldCheck className="h-5 w-5" />;
                    if (lower.includes("wood") || lower.includes("finish") || lower.includes("design") || lower.includes("sturdy")) return <Layout className="h-5 w-5" />;
                    if (lower.includes("book") || lower.includes("author") || lower.includes("bestseller")) return <BookOpen className="h-5 w-5" />;
                    if (lower.includes("piece") || lower.includes("lego") || lower.includes("kit")) return <Layers className="h-5 w-5" />;
                    return <Star className="h-5 w-5" />;
                  };

                  return (
                    <div key={idx} className="flex items-center gap-4 text-[#212121]">
                      <div className="p-2 bg-[#f0f5ff] text-[#2874f0] rounded-sm">
                        {getIcon(highlight)}
                      </div>
                      <span className="text-sm font-medium">{highlight}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seller */}
            <div className="flex gap-10 mt-4 pt-3 border-t border-dashed">
              <span className="text-sm font-bold text-muted-foreground w-24 shrink-0">Seller</span>
              <div className="space-y-1">
                <button className="text-primary font-bold hover:underline flex items-center gap-2">
                  Scaler Retail 
                  <div className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">4.8 ★</div>
                </button>
                <p className="text-[12px] text-muted-foreground">7 Day Service Center Replacement/Repair</p>
                <button className="text-primary text-[12px] font-bold hover:underline uppercase pt-1">See other sellers</button>
              </div>
            </div>

            {/* Specifications Summary */}
            <div className="mt-8 border border-border/80 rounded shadow-sm overflow-hidden bg-white">
              <div className="bg-muted/20 px-6 py-4 text-lg font-bold border-b border-border/80 text-[#212121]">Specifications</div>
              <div className="divide-y divide-border/40">
                {Object.entries(product.specs || {}).map(([key, value]) => (
                  <div key={key} className="flex text-sm">
                    <span className="w-1/3 px-6 py-4 text-muted-foreground">
                      {key}
                    </span>
                    <span className="flex-1 px-6 py-4 text-[#212121] font-medium">
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