import { categories } from "@/data/products";
import { Link, useSearchParams } from "react-router-dom";

const CategoryBar = () => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  return (
    <nav className="bg-card flipkart-shadow border-b border-border overflow-x-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-0 min-w-max">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={cat === "All" ? "/" : `/?category=${encodeURIComponent(cat)}`}
              className={`px-5 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                activeCategory === cat
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/70 hover:text-primary"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryBar;
