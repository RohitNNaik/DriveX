"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Car } from "@/lib/types";

interface Props {
  cars: Car[];
}

export default function ShareCompareButton({ cars }: Props) {
  const [state, setState] = useState<"idle" | "copied">("idle");

  function buildLink() {
    const ids = cars.map((c) => c.id).join(",");
    const url = `${window.location.origin}/compare?cars=${encodeURIComponent(ids)}`;
    return url;
  }

  async function handleShare() {
    const url = buildLink();
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setState("copied");
      setTimeout(() => setState("idle"), 2500);
    }
  }

  if (cars.length < 2) return null;

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
    >
      {state === "copied" ? (
        <>
          <Check className="h-4 w-4 text-emerald-600" />
          <span className="text-emerald-600">Link copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share comparison
        </>
      )}
    </button>
  );
}
