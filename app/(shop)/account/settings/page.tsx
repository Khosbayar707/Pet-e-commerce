import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./_profile-form";
import { PasswordForm } from "./_password-form";
import { NotificationsForm } from "./_notifications-form";

export const metadata: Metadata = { title: "Account Settings" };

export default async function SettingsPage() {
  const session = await auth();
  const user = session!.user!;

  return (
    <div className="space-y-8">
      <ProfileForm name={user.name ?? ""} email={user.email ?? ""} />
      <PasswordForm />
      <NotificationsForm />

      <Separator />

      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/40 p-6 space-y-4">
        <h2 className="text-lg font-bold text-red-700">Аюултай бүс</h2>
        <p className="text-sm text-red-600">Бүртгэлээ устгавал буцаах боломжгүй.</p>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 px-4 py-2 transition-colors">
          Бүртгэл устгах
        </button>
      </div>
    </div>
  );
}
