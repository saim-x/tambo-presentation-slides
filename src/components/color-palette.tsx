"use client";
import { Copy } from "lucide-react";
import { useState } from "react";

interface ColorPaletteProps {
  colors: string[];
  paletteName: string;
}

export default function ColorPalette({ colors, paletteName }: ColorPaletteProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // Defensive programming: handle cases where colors might be undefined or not an array
  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{paletteName || "Color Palette"}</h3>
        <div className="text-gray-500 text-center py-8">
          <p>No colors available</p>
          <p className="text-sm mt-2">Please provide a valid array of hex color codes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{paletteName}</h3>
      <div className="grid grid-cols-2 gap-3">
        {colors.map((color, index) => (
          <div
            key={index}
            className="group cursor-pointer"
            onClick={() => copyToClipboard(color)}
          >
            <div
              className="w-full h-20 rounded-lg mb-2 group-hover:scale-105 transition-transform"
              style={{ backgroundColor: color }}
            />
            <div className="flex items-center justify-between text-sm">
              <span className="font-mono text-gray-700">{color}</span>
              <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </div>
            {copiedColor === color && (
              <div className="text-xs text-green-600 mt-1">Copied!</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}