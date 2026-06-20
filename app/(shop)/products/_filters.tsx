"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  brands: string[];
}

export function ProductFilters({ categories, brands }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const clearAll = () => {
    router.push(pathname);
  };

  const hasFilters = searchParams.size > 0;
  const currentCategory = searchParams.get("category");
  const currentBrand = searchParams.get("brand");
  const currentSort = searchParams.get("sort") || "newest";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-gray-500 h-auto p-0">
            <X className="h-3 w-3 mr-1" /> Clear all
          </Button>
        )}
      </div>

      {/* Sort */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Sort By</Label>
        <Select value={currentSort} onValueChange={(v) => updateParam("sort", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Category */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Category</Label>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={currentCategory === cat.slug}
                onCheckedChange={(checked) => updateParam("category", checked ? cat.slug : null)}
              />
              <span className="text-sm text-gray-700">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brand */}
      {brands.length > 0 && (
        <>
          <div>
            <Label className="text-sm font-semibold mb-3 block">Brand</Label>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={currentBrand === brand}
                    onCheckedChange={(checked) => updateParam("brand", checked ? brand : null)}
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Price */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Price Range</Label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("minPrice") || ""}
            onBlur={(e) => updateParam("minPrice", e.target.value || null)}
            className="w-full"
            min={0}
          />
          <span className="text-gray-400">—</span>
          <Input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("maxPrice") || ""}
            onBlur={(e) => updateParam("maxPrice", e.target.value || null)}
            className="w-full"
            min={0}
          />
        </div>
      </div>
    </div>
  );
}
