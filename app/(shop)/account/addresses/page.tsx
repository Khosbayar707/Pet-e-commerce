import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MapPin, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "My Addresses" };

export default async function AddressesPage() {
  const session = await auth();
  const addresses = await prisma.address.findMany({
    where: { userId: session!.user!.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No saved addresses yet.</p>
          <p className="text-sm text-gray-400 mt-1">Add an address for faster checkout.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  {address.label && <p className="font-semibold text-gray-900">{address.label}</p>}
                  {address.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
              <p className="text-sm text-gray-700">
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
