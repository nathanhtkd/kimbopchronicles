"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface LyricsModalProps {
  lyrics: string;
  onClose: () => void;
}

export default function LyricsModal({ lyrics, onClose }: LyricsModalProps) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-4 text-center">Full Lyrics</h2>
        <div className="text-gray-700 mb-6 max-h-80 overflow-auto px-4">
          {lyrics}
        </div>
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
