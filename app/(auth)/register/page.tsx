import type { Metadata } from "next";
import { RegisterForm } from "./_form";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="text-gray-500 mt-1 text-sm">Join MyCat and treat your cat right</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
