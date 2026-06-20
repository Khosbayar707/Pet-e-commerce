"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProduct, updateProduct } from "@/actions/products";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

interface Category { id: string; name: string }
interface ProductFormProps {
  categories: Category[];
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    stock: number;
    brand?: string | null;
    categoryId: string;
    featured: boolean;
    status: string;
    tags: string[];
  };
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [status, setStatus] = useState(product?.status ?? "ACTIVE");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("featured", String(featured));
    formData.set("status", status);
    formData.set("categoryId", categoryId);

    let result;
    if (product) {
      result = await updateProduct(product.id, formData);
    } else {
      result = await createProduct(formData);
    }

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success(product ? "Product updated!" : "Product created!");
      router.push("/admin/products");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input id="name" name="name" required defaultValue={product?.name} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" name="description" required rows={4} defaultValue={product?.description} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" defaultValue={product?.brand ?? ""} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" defaultValue={product?.sku ?? ""} className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" name="tags" defaultValue={product?.tags?.join(", ")} placeholder="food, treats, premium" className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Pricing & Inventory</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input id="price" name="price" type="number" step="0.01" min="0" required defaultValue={product?.price} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="comparePrice">Compare Price</Label>
              <Input id="comparePrice" name="comparePrice" type="number" step="0.01" min="0" defaultValue={product?.comparePrice ?? ""} className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="stock">Stock *</Label>
            <Input id="stock" name="stock" type="number" min="0" required defaultValue={product?.stock ?? 0} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Category *</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={featured} onCheckedChange={setFeatured} id="featured" />
            <Label htmlFor="featured">Featured product</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Images</CardTitle></CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            <Upload className="h-8 w-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-3">Upload product images</p>
            <Input type="file" name="images" accept="image/*" multiple className="max-w-xs mx-auto" />
            <p className="text-xs text-gray-400 mt-2">PNG, JPG, WebP up to 10MB each</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
