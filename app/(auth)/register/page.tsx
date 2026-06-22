import type { Metadata } from "next";
import { RegisterForm } from "./_form";

export const metadata: Metadata = { title: "Бүртгүүлэх" };

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MyCat бүртгэл үүсгэх</h1>
          <p className="text-gray-500 mt-1 text-sm">Мянга мянган муурын эзэдтэй нэгдээрэй</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
