import { Link } from "react-router-dom";
import { Product } from "@/api/api";
import StarRating from "./StarRating";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-card rounded-sm flipkart-shadow hover:flipkart-shadow-hover transition-all duration-200 flex flex-col overflow-hidden border border-border/50"
    >
      <div className="relative aspect-square bg-card p-4 flex items-center justify-center overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-discount text-discount-foreground text-[11px] font-bold px-2 py-0.5 rounded-sm">
            {product.discount}% off
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="text-sm text-foreground font-medium line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <StarRating rating={product.rating} count={product.ratingCount} />

        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-base font-bold text-foreground">
            ₹{product.price.toLocaleString()}
          </span>
          {product.discount > 0 && (
            <>
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="text-xs text-discount font-semibold">
                {product.discount}% off
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
