import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddAddressDialog, EditAddressDialog } from "./_address-form";

export const metadata: Metadata = { title: "Хадгалагдсан хаягууд" };

export default async function AddressesPage() {
  const session = await auth();
  const addresses = await prisma.address.findMany({
    where: { userId: session!.user!.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Хадгалагдсан хаягууд</h2>
        <AddAddressDialog />
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">Хадгалагдсан хаяг байхгүй байна.</p>
          <p className="text-sm text-gray-400 mt-1">Хурдан төлбөр тооцоо хийхийн тулд хаяг нэмнэ үү.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {address.label && <p className="font-semibold text-gray-900 dark:text-white">{address.label}</p>}
                  {address.isDefault && <Badge variant="secondary" className="text-xs">Үндсэн</Badge>}
                </div>
                <EditAddressDialog address={address} />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {address.firstName} {address.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {address.address1}{address.address2 ? `, ${address.address2}` : ""}<br />
                {address.city}, {address.state} {address.postalCode}<br />
                {address.country}
              </p>
              {address.phone && <p className="text-sm text-gray-500">{address.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
