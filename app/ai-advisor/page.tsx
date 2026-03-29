import AIChat from "@/components/ai-chat/AIChat";
import { Sparkles } from "lucide-react";

export default function AIAdvisorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl sm:text-3xl font-bold">AI Car Advisor</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Tell me your needs and I&apos;ll find the best cars for you.
        </p>
      </div>
      <AIChat />
    </div>
  );
}

