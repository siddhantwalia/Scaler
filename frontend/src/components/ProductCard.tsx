import { Link } from "react-router-dom";
import { Product } from "@/api/api";
import StarRating from "./StarRating";
import { api } from "@/api/api";
import { toast } from "sonner";
import { Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] transition-shadow duration-300 flex flex-col overflow-hidden relative"
    >
      <button
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          try {
            await api.addToWishlist(product.id);
            toast.success("Added to wishlist");
            window.dispatchEvent(new Event("wishlistUpdated"));
          } catch {
            toast.error("Failed to add to wishlist");
          }
        }}
        className="absolute top-2 right-2 z-10 p-2 hover:scale-110 transition"
      >
        <Heart className="h-[20px] w-[20px] text-[#c2c2c2] hover:text-[#ff4343] hover:fill-[#ff4343] transition-colors" />
      </button>

      <div className="relative aspect-[1] w-full bg-white p-4 flex flex-col items-center justify-center overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="max-h-[90%] max-w-[90%] object-contain group-hover:scale-[1.05] transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="px-5 pb-5 pt-2 flex flex-col gap-1.5 flex-1">
        <div className="min-h-[40px]">
          <h3 className="text-[14px] text-[#212121] font-normal line-clamp-2 group-hover:text-[#2874f0] transition-colors leading-[1.3]">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <StarRating rating={product.rating} count={product.ratingCount} />
          <img 
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
            alt="fassured" 
            className="h-[18px] w-auto min-w-[50px] object-contain"
          />
        </div>

        <div className="flex flex-col mt-auto pt-1 gap-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[16px] font-bold text-[#212121]">
              ₹{product.price.toLocaleString()}
            </span>
            {product.discount > 0 && (
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] text-[#878787] line-through decoration-[#878787]">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-[13px] text-[#388e3c] font-bold tracking-tight">
                  {product.discount}% off
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-[1px]">
            <span className="text-[12px] text-[#212121]">
              Free delivery
            </span>
            {product.stock === 0 ? (
              <span className="text-[12px] text-red-500 font-medium">Out of stock</span>
            ) : product.stock < 10 ? (
              <span className="text-[11px] text-[#ff9f00] font-medium">Only {product.stock} left</span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
