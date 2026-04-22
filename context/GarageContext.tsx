"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Car } from "@/lib/types";

interface GarageContextValue {
  saved: Car[];
  addToGarage: (car: Car) => void;
  removeFromGarage: (id: string) => void;
  isInGarage: (id: string) => boolean;
  clearGarage: () => void;
}

const GarageContext = createContext<GarageContextValue | null>(null);

const KEY = "drivex_garage";

export function GarageProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Car[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(saved));
  }, [saved, hydrated]);

  function addToGarage(car: Car) {
    setSaved((prev) => (prev.find((c) => c.id === car.id) ? prev : [...prev, car]));
  }

  function removeFromGarage(id: string) {
    setSaved((prev) => prev.filter((c) => c.id !== id));
  }

  function isInGarage(id: string) {
    return saved.some((c) => c.id === id);
  }

  function clearGarage() {
    setSaved([]);
  }

  return (
    <GarageContext.Provider value={{ saved, addToGarage, removeFromGarage, isInGarage, clearGarage }}>
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  const ctx = useContext(GarageContext);
  if (!ctx) throw new Error("useGarage must be used inside GarageProvider");
  return ctx;
}
