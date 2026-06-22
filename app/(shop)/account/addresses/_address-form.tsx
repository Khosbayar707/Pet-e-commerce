"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { createAddress, updateAddress, deleteAddress } from "@/actions/user";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Address = {
  id: string;
  label: string | null;
  firstName: string;
  lastName: string;
  phone: string | null;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

function AddressFormFields({ address }: { address?: Address }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="label">Нэр (жш. Гэр, Ажил)</Label>
        <Input id="label" name="label" defaultValue={address?.label ?? ""} className="mt-1" placeholder="Гэр" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Нэр *</Label>
          <Input id="firstName" name="firstName" defaultValue={address?.firstName ?? ""} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="lastName">Овог *</Label>
          <Input id="lastName" name="lastName" defaultValue={address?.lastName ?? ""} required className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="phone">Утас</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={address?.phone ?? ""} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="address1">Хаяг *</Label>
        <Input id="address1" name="address1" defaultValue={address?.address1 ?? ""} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="address2">Байр, тоот гэх мэт</Label>
        <Input id="address2" name="address2" defaultValue={address?.address2 ?? ""} className="mt-1" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="city">Хот *</Label>
          <Input id="city" name="city" defaultValue={address?.city ?? ""} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="state">Муж/Аймаг *</Label>
          <Input id="state" name="state" defaultValue={address?.state ?? ""} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="postalCode">Шуудангийн код *</Label>
          <Input id="postalCode" name="postalCode" defaultValue={address?.postalCode ?? ""} required className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="country">Улс *</Label>
        <Input id="country" name="country" defaultValue={address?.country ?? "US"} required className="mt-1" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="isDefault" name="isDefault" defaultChecked={address?.isDefault} />
        <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer">
          Үндсэн хаяг болгох
        </Label>
      </div>
    </div>
  );
}

export function AddAddressDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const result = await createAddress(new FormData(e.currentTarget));
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Хаяг нэмэгдлээ");
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Хаяг нэмэх
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Шинэ хаяг нэмэх</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AddressFormFields />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Цуцлах</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Хадгалж байна..." : "Хаяг хадгалах"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditAddressDialog({ address }: { address: Address }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const result = await updateAddress(address.id, new FormData(e.currentTarget));
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Хаяг шинэчлэгдлээ");
      setOpen(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Энэ хаягийг устгах уу?")) return;
    const result = await deleteAddress(address.id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Хаяг устгагдлаа");
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">Засах</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Хаяг засах</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AddressFormFields address={address} />
          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" /> Устгах
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Цуцлах</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Хадгалж байна..." : "Өөрчлөлт хадгалах"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
