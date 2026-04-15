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
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search)}`);
      setMobileMenuOpen(false);
    }
  };

  // Fetch wishlist count from backend
  useEffect(() => {
    const fetchWishlistCount = () => {
      api.getWishlist()
        .then((data) => setWishlistCount(data.length))
        .catch(() => { });
    };

    fetchWishlistCount();
    window.addEventListener("wishlistUpdated", fetchWishlistCount);
    return () => window.removeEventListener("wishlistUpdated", fetchWishlistCount);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-nav text-primary-foreground flipkart-shadow">
        {/* Main Row */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between sm:justify-start gap-2 h-14">
            {/* Desktop Navbar Toggle Hidden, Mobile Visible Left */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="sm:hidden -ml-2 p-2 hover:bg-nav-secondary rounded-sm transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex flex-col items-center leading-none">
              <span className="text-xl font-bold italic tracking-tight">Flipkart</span>
              <span className="text-[10px] italic flex items-center gap-0.5 text-primary-foreground opacity-90">
                Explore <span className="text-secondary font-bold">Plus</span>
                <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/plus-brand-bc11da.svg" alt="plus-star" className="h-2.5 w-2.5" />
              </span>
            </Link>

            {/* Desktop Search */}
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

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 sm:gap-4 ml-auto">
              <Link
                to="/"
                className="hidden sm:flex items-center gap-2 px-8 py-1.5 bg-white text-primary rounded-sm text-sm font-semibold hover:bg-gray-100 transition-all shadow-sm"
              >
                Login
              </Link>
              
              {/* Mobile Login Text */}
              <Link to="/" className="sm:hidden text-[14px] font-semibold px-2 hover:bg-white/10 rounded">
                Login
              </Link>

              <span className="hidden lg:inline text-sm font-semibold cursor-pointer hover:underline underline-offset-4">
                Become a Seller
              </span>

              {/* Wishlist - Hidden on Mobile Top Bar (in drawer) */}
              <Link
                to="/wishlist"
                className="hidden md:flex relative items-center p-2 hover:bg-nav-secondary/50 rounded-full transition-colors"
                title="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-[8px] font-bold rounded-full h-3.5 min-w-[14px] flex items-center justify-center border border-nav">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart - Always in top bar */}
              <Link
                to="/cart"
                className="relative flex items-center gap-1.5 px-2.5 sm:px-4 py-2 text-[14px] sm:text-sm font-bold hover:bg-nav-secondary/50 rounded-sm transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute top-0.5 left-5 sm:left-7 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full h-4 min-w-[16px] flex items-center justify-center px-1 border border-nav">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link
                to="/orders"
                className="hidden md:flex items-center p-2 hover:bg-nav-secondary/50 rounded-full transition-colors"
                title="My Orders"
              >
                <Package className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search Row - Permanent on Mobile */}
        <div className="sm:hidden px-4 pb-3">
          <form onSubmit={handleSearch}>
            <div className="flex w-full bg-card rounded-sm overflow-hidden shadow-inner">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products, brands and more"
                className="flex-1 px-4 py-2 text-[14px] text-foreground outline-none bg-transparent"
              />
              <button type="submit" className="px-4 text-muted-foreground">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex sm:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative w-72 h-full bg-white text-foreground flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="bg-nav text-white p-4 flex items-center gap-3">
              <User className="h-5 w-5" />
              <span className="font-semibold">Login & Create Account</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="ml-auto text-white/80"
              >
                <Package className="h-5 w-5 rotate-45" /> {/* Just a close mock for now */}
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2">
              <div className="px-4 py-2 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Navigation</div>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
              >
                <ShoppingCart className="h-5 w-5 opacity-70" />
                <span>Home</span>
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
              >
                <Package className="h-5 w-5 opacity-70" />
                <span>My Orders</span>
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
              >
                <Heart className="h-5 w-5 opacity-70" />
                <span>My Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="ml-auto bg-nav text-white text-[10px] px-1.5 py-0.5 rounded-full">{wishlistCount}</span>
                )}
              </Link>
              
              <div className="border-t my-2"></div>
              
              <div className="px-4 py-2 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Other Services</div>
              <span 
                className="flex items-center gap-4 px-4 py-3 text-sm font-medium hover:bg-accent transition-colors cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-5 w-5 opacity-70" />
                <span>Become a Seller</span>
              </span>
            </div>
          </div>
        </div>
      )}
      </>
  );
};

export default Navbar;
