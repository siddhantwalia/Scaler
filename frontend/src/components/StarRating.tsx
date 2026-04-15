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
      <span className={`inline-flex items-center gap-0.5 bg-discount text-discount-foreground px-1.5 py-0.5 rounded-sm ${textSize} font-semibold`}>
        {rating}
        <Star className={`${starSize} fill-current`} />
      </span>
      {count !== undefined && (
        <span className={`text-muted-foreground ${textSize}`}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default StarRating;
