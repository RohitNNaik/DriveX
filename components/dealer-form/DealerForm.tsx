"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function DealerForm({ carId, carName }: { carId?: string; carName?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          city: form.city,
          carId,
          carName,
          intent: "buy",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        setError(json.error ?? "Submission failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
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
      <div className="space-y-1">
        <Label htmlFor="city" className="text-xs">City *</Label>
        <Input id="city" placeholder="Bangalore" required value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })} />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button type="submit" className="w-full mt-1" disabled={loading}>
        {loading ? "Submitting…" : "Get Best Price"}
      </Button>
    </form>
  );
}

