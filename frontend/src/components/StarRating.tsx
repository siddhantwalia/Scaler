import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}

const StarRating = ({ rating, count, size = "sm" }: StarRatingProps) => {
  const starSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex items-center gap-1">
      <span className={`inline-flex items-center gap-0.5 bg-[#388e3c] text-white px-1.5 py-[2px] rounded-[3px] text-[12px] font-bold`}>
        {rating}
        <Star className={`h-[10px] w-[10px] fill-current`} />
      </span>
      {count !== undefined && (
        <span className={`text-[#878787] font-medium text-[12px]`}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default StarRating;
