import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, Heart, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { api } from "@/api/api";

const Navbar = () => {
  const { totalItems } = useCart();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(search)}`);
  };

  // Fetch wishlist count from backend
  useEffect(() => {
    const fetchWishlistCount = () => {
      api.getWishlist()
        .then((data) => setWishlistCount(data.length))
        .catch(() => { });
    };

    // initial load
    fetchWishlistCount();
    window.addEventListener("wishlistUpdated", fetchWishlistCount);

    // cleanup
    return () => {
      window.removeEventListener("wishlistUpdated", fetchWishlistCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-nav text-primary-foreground flipkart-shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-14">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex flex-col items-center leading-none">
            <span className="text-xl font-bold italic tracking-tight">Flipkart</span>
            <span className="text-[10px] italic flex items-center gap-0.5 text-primary-foreground opacity-90">
              Explore <span className="text-secondary font-bold">Plus</span>
              <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/plus-brand-bc11da.svg" alt="plus-star" className="h-2.5 w-2.5" />
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-2xl ml-4">
            <div className="flex w-full bg-card rounded-md shadow-inner overflow-hidden border border-transparent focus-within:border-primary/20 transition-all">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products, brands and more"
                className="flex-1 px-4 py-2 text-sm text-foreground outline-none bg-transparent"
              />
              <button type="submit" className="px-4 text-primary hover:bg-accent/50 transition-colors">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-4">
            {/* Login */}
            <Link
              to="/"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-sm text-sm font-semibold hover:bg-gray-100 transition-colors shadow-sm"
            >
              Login
            </Link>

            {/* Become a Seller */}
            <span className="hidden lg:inline text-sm font-semibold px-4 cursor-pointer hover:underline underline-offset-4">
              Become a Seller
            </span>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 px-4 py-2 text-sm font-bold hover:bg-nav-secondary/50 rounded-sm transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="absolute top-0.5 left-7 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full h-4 min-w-[16px] flex items-center justify-center px-1 border border-nav">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Wishlist Icon only for clean look */}
            <Link
              to="/wishlist"
              className="relative flex items-center p-2 hover:bg-nav-secondary/50 rounded-full transition-colors"
              title="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-[8px] font-bold rounded-full h-3.5 min-w-[14px] flex items-center justify-center border border-nav">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Orders */}
            <Link
              to="/orders"
              className="hidden sm:flex items-center p-2 hover:bg-nav-secondary/50 rounded-full transition-colors text-xs font-semibold"
              title="My Orders"
            >
              <Package className="h-5 w-5" />
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 hover:bg-nav-secondary rounded-sm transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {mobileMenuOpen && (
          <form onSubmit={handleSearch} className="sm:hidden pb-3">
            <div className="flex w-full bg-card rounded-sm overflow-hidden">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products..."
                className="flex-1 px-4 py-2 text-sm text-foreground outline-none bg-transparent"
              />
              <button type="submit" className="px-4 text-primary">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
};

export default Navbar;
