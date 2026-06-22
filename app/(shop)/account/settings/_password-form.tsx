"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/actions/user";
import { toast } from "sonner";

export function PasswordForm() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const result = await updatePassword(new FormData(e.currentTarget));
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Нууц үг шинэчлэгдлээ");
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Нууц үг солих</h2>
      <div className="space-y-3">
        <div>
          <Label htmlFor="currentPassword">Одоогийн нууц үг</Label>
          <Input id="currentPassword" name="currentPassword" type="password" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="newPassword">Шинэ нууц үг</Label>
          <Input id="newPassword" name="newPassword" type="password" required className="mt-1" placeholder="Хамгийн багадаа 8 тэмдэгт" />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Шинэ нууц үг давтах</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required className="mt-1" />
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Шинэчилж байна..." : "Нууц үг шинэчлэх"}
      </Button>
    </form>
  );
}
