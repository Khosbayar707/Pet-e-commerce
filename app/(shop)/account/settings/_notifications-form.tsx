"use client";

import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const notifications = [
  { id: "orders", label: "Захиалгын мэдээлэл", desc: "Захиалгын и-мэйл хүлээн авах" },
  { id: "promos", label: "Урамшуулал", desc: "Урамшуулал хөнгөлөлтийн мэдэгдэл авах" },
  { id: "arrivals", label: "Шинэ бүтээгдэхүүн", desc: "Шинэ барааны тухай хамгийн түрүүнд мэдэх" },
];

export function NotificationsForm() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Мэдэгдэл</h2>
      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-gray-900 dark:text-white">{item.label}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
            <Switch
              defaultChecked
              onCheckedChange={(checked) =>
                toast.success(`${item.label} ${checked ? "идэвхжүүлсэн" : "идэвхгүй болголоо"}`)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
