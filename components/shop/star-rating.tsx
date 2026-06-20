"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const sizeMap = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-6 w-6" };

export function StarRating({ rating, max = 5, size = "md", interactive, onRate }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <button
            key={i}
            type="button"
            onClick={() => interactive && onRate?.(i + 1)}
            disabled={!interactive}
            className={cn(!interactive && "pointer-events-none")}
          >
            <Star
              className={cn(
                sizeMap[size],
                "transition-colors",
                filled ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
