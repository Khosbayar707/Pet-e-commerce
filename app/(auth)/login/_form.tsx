"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      toast.error("И-мэйл эсвэл нууц үг буруу байна");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">И-мэйл</Label>
          <Input id="email" name="email" type="email" required className="mt-1" placeholder="ta@example.com" />
        </div>
        <div>
          <Label htmlFor="password">Нууц үг</Label>
          <Input id="password" name="password" type="password" required className="mt-1" placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Бүртгэл байхгүй юу?{" "}
        <Link href="/register" className="text-blue-600 font-medium hover:underline">
          Бүртгүүлэх
        </Link>
      </p>
    </div>
  );
}
