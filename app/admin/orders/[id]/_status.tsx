"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/actions/orders";
import { toast } from "sonner";

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    if (status === currentStatus) return;
    setLoading(true);
    const result = await updateOrderStatus(orderId, status);
    if (result?.error) {
      toast.error(result.error as string);
    } else {
      toast.success("Order status updated");
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" onClick={handleUpdate} disabled={loading || status === currentStatus}>
        {loading ? "Saving..." : "Update"}
      </Button>
    </div>
  );
}
