import type { Metadata } from "next";
import { LoginForm } from "./_form";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to your MyCat account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
