"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface City {
  name: string;
  state: string;
  emoji: string;
  roadTax: (price: number) => number; // returns tax amount in INR
  handling: number; // fixed logistics/handling charge
}

export const CITIES: City[] = [
  {
    name: "Delhi",
    state: "Delhi",
    emoji: "🏛",
    roadTax: (p) => {
      if (p <= 600000)  return p * 0.04;
      if (p <= 1000000) return p * 0.07;
      return p * 0.10;
    },
    handling: 8500,
  },
  {
    name: "Mumbai",
    state: "Maharashtra",
    emoji: "🌆",
    roadTax: (p) => {
      if (p <= 1000000) return p * 0.07;
      if (p <= 2000000) return p * 0.09;
      return p * 0.11;
    },
    handling: 10000,
  },
  {
    name: "Bengaluru",
    state: "Karnataka",
    emoji: "🌿",
    roadTax: (p) => {
      if (p <= 500000)  return p * 0.13;
      if (p <= 1000000) return p * 0.14;
      if (p <= 2000000) return p * 0.17;
      return p * 0.18;
    },
    handling: 9000,
  },
  {
    name: "Chennai",
    state: "Tamil Nadu",
    emoji: "🌊",
    roadTax: (p) => {
      if (p <= 1000000) return p * 0.10;
      if (p <= 2000000) return p * 0.12;
      return p * 0.15;
    },
    handling: 9500,
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    emoji: "💎",
    roadTax: (p) => {
      if (p <= 1000000) return p * 0.09;
      if (p <= 2000000) return p * 0.11;
      return p * 0.13;
    },
    handling: 9000,
  },
  {
    name: "Pune",
    state: "Maharashtra",
    emoji: "🎓",
    roadTax: (p) => {
      if (p <= 1000000) return p * 0.07;
      if (p <= 2000000) return p * 0.09;
      return p * 0.11;
    },
    handling: 9000,
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    emoji: "🎨",
    roadTax: (p) => p * 0.07,
    handling: 9500,
  },
  {
    name: "Ahmedabad",
    state: "Gujarat",
    emoji: "🪁",
    roadTax: (p) => {
      if (p <= 1000000) return p * 0.06;
      return p * 0.08;
    },
    handling: 8500,
  },
];

interface CityContextValue {
  city: City;
  setCity: (city: City) => void;
}

const CityContext = createContext<CityContextValue | null>(null);

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<City>(CITIES[0]); // default: Delhi

  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used inside CityProvider");
  return ctx;
}
