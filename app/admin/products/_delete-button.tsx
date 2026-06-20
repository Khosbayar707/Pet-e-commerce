"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/products";
import { toast } from "sonner";

export function DeleteProductButton({ productId }: { productId: string }) {
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const result = await deleteProduct(productId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Product deleted");
    }
  }

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDelete}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
