import { connectDB } from "@/lib/db/mongoose";
import { LeadModel } from "./lead.schema";

export interface CreateLeadInput {
  carId?: string;
  carName?: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  message?: string;
  intent?: "buy" | "test_drive" | "loan" | "insurance" | "general";
}

function validatePhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.trim());
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function createLead(input: CreateLeadInput) {
  if (!input.name?.trim()) throw new Error("Name is required");
  if (!input.phone?.trim()) throw new Error("Phone is required");
  if (!validatePhone(input.phone)) throw new Error("Invalid Indian mobile number");
  if (input.email && !validateEmail(input.email)) throw new Error("Invalid email address");
  if (!input.city?.trim()) throw new Error("City is required");

  await connectDB();

  const lead = await LeadModel.create({
    carId: input.carId,
    carName: input.carName,
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim(),
    city: input.city.trim(),
    message: input.message?.trim(),
    intent: input.intent ?? "buy",
  });

  return lead;
}

export async function getLeads(status?: "new" | "contacted" | "closed", limit = 50) {
  await connectDB();
  const query = status ? { status } : {};
  return LeadModel.find(query).sort({ createdAt: -1 }).limit(limit).lean();
}
