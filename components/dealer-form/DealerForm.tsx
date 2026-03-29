"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function DealerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to backend API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <span className="text-3xl">🎉</span>
        <p className="font-semibold text-green-700">Request submitted!</p>
        <p className="text-xs text-gray-500">A dealer will contact you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="space-y-1">
        <Label htmlFor="name" className="text-xs">Full Name</Label>
        <Input id="name" placeholder="Rahul Sharma" required value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="phone" className="text-xs">Phone Number</Label>
        <Input id="phone" type="tel" placeholder="98765 43210" required value={form.phone}
          pattern="[6-9][0-9]{9}"
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email" className="text-xs">Email</Label>
        <Input id="email" type="email" placeholder="rahul@email.com" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <Button type="submit" className="w-full mt-1">Get Best Price</Button>
    </form>
  );
}

