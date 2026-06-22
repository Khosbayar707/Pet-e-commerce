"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="text-6xl">😿</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Алдаа гарлаа!</h2>
        <p className="text-gray-500">Гэнэтийн алдаа гарлаа. Дахин оролдоно уу.</p>
        <Button onClick={reset}>Дахин оролдох</Button>
      </div>
    </div>
  );
}
