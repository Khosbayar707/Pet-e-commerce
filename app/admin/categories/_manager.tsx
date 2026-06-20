"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createCategory, deleteCategory } from "@/actions/categories";
import { toast } from "sonner";
import { Plus, Trash2, Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count: { products: number };
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const result = await createCategory(new FormData(e.currentTarget));
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Category created!");
      setShowForm(false);
    }
    setLoading(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete category "${name}"? This will affect all associated products.`)) return;
    const result = await deleteCategory(id);
    if (result?.error) {
      toast.error(result.error as string);
    } else {
      toast.success("Category deleted");
    }
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowForm(!showForm)} className="gap-2">
        <Plus className="h-4 w-4" /> Add Category
      </Button>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New Category</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" required className="mt-1" placeholder="e.g. Food & Treats" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={2} className="mt-1" />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Category"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Slug</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Products</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400">
                  No categories yet. Create one above.
                </td>
              </tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-gray-900">{cat.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-xs font-mono">{cat.slug}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">{cat._count.products}</td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(cat.id, cat.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
