import type { Metadata } from "next";
import { LoginForm } from "./_form";

export const metadata: Metadata = { title: "Нэвтрэх" };

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Тавтай морил</h1>
          <p className="text-gray-500 mt-1 text-sm">MyCat бүртгэлдээ нэвтэрнэ үү</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
