import { useEffect, useRef } from "react";

export interface Feeling {
  emoji: string;
  label: string;
}

export const FEELINGS: Feeling[] = [
  { emoji: "😊", label: "happy" },
  { emoji: "😍", label: "loved" },
  { emoji: "😢", label: "sad" },
  { emoji: "😎", label: "cool" },
  { emoji: "🥳", label: "celebrating" },
  { emoji: "😴", label: "tired" },
  { emoji: "😡", label: "angry" },
  { emoji: "🤔", label: "thoughtful" },
  { emoji: "🙏", label: "grateful" },
  { emoji: "🎉", label: "excited" },
  { emoji: "😋", label: "hungry" },
  { emoji: "🥰", label: "blessed" },
];

interface EmojiPickerProps {
  onSelect: (feeling: Feeling) => void;
  onClose: () => void;
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-3"
    >
      <p className="text-xs font-semibold text-gray-500 mb-2">How are you feeling?</p>
      <div className="grid grid-cols-4 gap-1">
        {FEELINGS.map((feeling) => (
          <button
            key={feeling.label}
            type="button"
            onClick={() => onSelect(feeling)}
            title={feeling.label}
            className="flex flex-col items-center gap-1 rounded-lg p-2 hover:bg-gray-100"
          >
            <span className="text-xl leading-none">{feeling.emoji}</span>
            <span className="text-[10px] text-gray-500 capitalize truncate w-full text-center">
              {feeling.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
