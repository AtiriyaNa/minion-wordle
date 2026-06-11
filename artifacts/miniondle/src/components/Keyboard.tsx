import { motion } from "framer-motion";
import type { LetterState } from "@/lib/gameLogic";

interface KeyboardProps {
  onKey: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  keyColors: Record<string, LetterState>;
}

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const stateClass: Record<LetterState, string> = {
  correct: "bg-minion-green text-white border-minion-green",
  present: "bg-minion-yellow text-minion-dark border-minion-yellow",
  absent: "bg-minion-gray text-white border-minion-gray",
  empty: "bg-minion-keybg text-minion-dark border-minion-keyborder",
  pending: "bg-minion-keybg text-minion-dark border-minion-keyborder",
};

export function Keyboard({ onKey, onEnter, onBackspace, keyColors }: KeyboardProps) {
  function handleKey(key: string) {
    if (key === "ENTER") onEnter();
    else if (key === "⌫") onBackspace();
    else onKey(key);
  }

  return (
    <div className="flex flex-col items-center gap-1.5 w-full px-1 pb-2">
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1 justify-center w-full">
          {row.map((key) => {
            const state = keyColors[key] ?? "empty";
            const isWide = key === "ENTER" || key === "⌫";
            return (
              <motion.button
                key={key}
                whileTap={{ scale: 0.92 }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleKey(key);
                }}
                className={`
                  ${isWide ? "px-2 min-w-[52px]" : "flex-1 max-w-[40px]"}
                  h-14 rounded-md font-bold uppercase text-xs border
                  flex items-center justify-center select-none
                  touch-manipulation cursor-pointer
                  transition-colors duration-200
                  ${stateClass[state as LetterState]}
                `}
              >
                {key}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
