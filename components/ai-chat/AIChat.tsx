"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CarCard from "@/components/car-card/CarCard";
import type { Car } from "@/lib/types";

interface Message {
  role: "user" | "ai";
  text: string;
  suggestions?: Car[];
}

const SUGGESTIONS = [
  "Best SUV under 10L",
  "Car for Bangalore city traffic",
  "Electric car under 15L",
  "Family car with 7 seats",
  "Best diesel for highway driving",
  "Budget hatchback under 7L",
];

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi! I'm your AI Car Advisor. Tell me what you're looking for and I'll recommend the best cars for you. 🚗",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (query?: string) => {
    const text = query ?? input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/bff/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: json.data.text, suggestions: json.data.suggestions },
        ]);
      } else {
        throw new Error(json.error);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px] max-w-4xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[85%] space-y-3">
              {msg.role === "ai" && (
                <div className="flex items-start gap-2">
                  <span className="mt-1 shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 text-purple-600">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="bg-white border rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-700 shadow-sm whitespace-pre-line">
                    {msg.text}
                  </div>
                </div>
              )}
              {msg.role === "user" && (
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm">
                  {msg.text}
                </div>
              )}

              {/* Car suggestions */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                  {msg.suggestions.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-400 pl-9">
            <span className="animate-pulse">AI is thinking</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleSend(s)}
            className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask: Best SUV under 10L, Car for Bangalore traffic..."
          className="flex-1 rounded-full"
        />
        <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

