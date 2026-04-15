import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const Navbar = () => {
  const { totalItems } = useCart();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(search)}`);
  };

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
            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium hover:bg-nav-secondary transition-colors"
            >
              <User className="h-4 w-4" />
              Login
            </Link>
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
