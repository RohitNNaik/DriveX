"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Car } from "@/lib/types";

const MAX_COMPARE = 3;

interface CompareContextValue {
  selected: Car[];
  addCar: (car: Car) => void;
  removeCar: (id: string) => void;
  isSelected: (id: string) => boolean;
  clearAll: () => void;
  isFull: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Car[]>([]);

  const addCar = (car: Car) => {
    if (selected.length >= MAX_COMPARE) return;
    if (selected.find((c) => c.id === car.id)) return;
    setSelected((prev) => [...prev, car]);
  };

  const removeCar = (id: string) => {
    setSelected((prev) => prev.filter((c) => c.id !== id));
  };

  const isSelected = (id: string) => selected.some((c) => c.id === id);

  const clearAll = () => setSelected([]);

  return (
    <CompareContext.Provider
      value={{ selected, addCar, removeCar, isSelected, clearAll, isFull: selected.length >= MAX_COMPARE }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}
