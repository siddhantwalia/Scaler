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
          <Link to="/" className="flex-shrink-0 flex flex-col items-end">
            <span className="text-xl font-bold italic tracking-tight">Flipkart</span>
            <span className="text-[10px] -mt-1 italic text-primary-foreground/70">
              Explore <span className="text-secondary">Plus</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xl">
            <div className="flex w-full bg-card rounded-sm overflow-hidden">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products, brands and more"
                className="flex-1 px-4 py-2 text-sm text-foreground outline-none bg-transparent"
              />
              <button type="submit" className="px-4 text-primary hover:bg-accent transition-colors">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Login */}
            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium hover:bg-nav-secondary transition-colors"
            >
              <User className="h-4 w-4" />
              Login
            </Link>
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative hidden md:flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium hover:bg-nav-secondary transition-colors"
            >
              <Heart className="h-4 w-4" />
              Wishlist
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 left-5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full h-4 min-w-[16px] flex items-center justify-center px-1">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Orders */}
            <Link
              to="/orders"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium hover:bg-nav-secondary transition-colors"
            >
              <Package className="h-4 w-4" />
              Orders
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium hover:bg-nav-secondary transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden md:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 left-6 md:left-5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full h-4 min-w-[16px] flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
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
