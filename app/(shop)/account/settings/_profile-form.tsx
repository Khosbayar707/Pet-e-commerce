"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/actions/user";
import { toast } from "sonner";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const result = await updateProfile(new FormData(e.currentTarget));
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Мэдээлэл шинэчлэгдлээ");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Хувийн мэдээлэл</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Бүтэн нэр</Label>
          <Input id="name" name="name" defaultValue={name} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="email">И-мэйл</Label>
          <Input id="email" defaultValue={email} type="email" className="mt-1" disabled />
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Хадгалж байна..." : "Өөрчлөлт хадгалах"}
      </Button>
    </form>
  );
}
