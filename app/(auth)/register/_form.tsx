"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/actions/auth";
import { toast } from "sonner";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (formData.get("password") !== formData.get("confirmPassword")) {
      toast.error("Нууц үг таарахгүй байна");
      setLoading(false);
      return;
    }
    const result = await registerUser(formData);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Бүтэн нэр</Label>
          <Input id="name" name="name" required className="mt-1" placeholder="Бат Болд" />
        </div>
        <div>
          <Label htmlFor="email">И-мэйл</Label>
          <Input id="email" name="email" type="email" required className="mt-1" placeholder="ta@example.com" />
        </div>
        <div>
          <Label htmlFor="password">Нууц үг</Label>
          <Input id="password" name="password" type="password" required className="mt-1" placeholder="Хамгийн багадаа 8 тэмдэгт" />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Нууц үг давтах</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required className="mt-1" placeholder="Нууц үгээ давтана уу" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Бүртгэл үүсгэж байна..." : "Бүртгэл үүсгэх"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Бүртгэлтэй юу?{" "}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Нэвтрэх
        </Link>
      </p>
    </div>
  );
}
