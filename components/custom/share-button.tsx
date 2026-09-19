"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        if (navigator.share) {
          await navigator.share({
            title: title,
            url: window.location.href,
          });
          return;
        }
      } catch {
        // Fallback to clipboard
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-xl text-xs font-semibold h-8"
      onClick={handleShare}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Copied Link!
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" /> Share
        </>
      )}
    </Button>
  );
}
