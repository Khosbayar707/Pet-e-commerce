"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AdminSignOut() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full gap-2 text-gray-400 hover:text-white hover:bg-gray-800"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );
}
