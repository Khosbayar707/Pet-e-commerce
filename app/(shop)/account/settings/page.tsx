import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export const metadata: Metadata = { title: "Account Settings" };

export default async function SettingsPage() {
  const session = await auth();
  const user = session!.user!;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name</Label>
            <Input defaultValue={user.name ?? ""} className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input defaultValue={user.email ?? ""} type="email" className="mt-1" disabled />
          </div>
        </div>
        <Button>Save Changes</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
        <div className="space-y-3">
          <div>
            <Label>Current Password</Label>
            <Input type="password" className="mt-1" />
          </div>
          <div>
            <Label>New Password</Label>
            <Input type="password" className="mt-1" />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input type="password" className="mt-1" />
          </div>
        </div>
        <Button>Update Password</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
        <div className="space-y-4">
          {[
            { label: "Order updates", desc: "Receive emails about your orders" },
            { label: "Promotions", desc: "Get notified about deals and offers" },
            { label: "New products", desc: "Be the first to know about new arrivals" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="bg-red-50 rounded-xl border border-red-100 p-6 space-y-4">
        <h2 className="text-lg font-bold text-red-700">Danger Zone</h2>
        <p className="text-sm text-red-600">Once you delete your account, there is no going back.</p>
        <Button variant="destructive">Delete Account</Button>
      </div>
    </div>
  );
}
