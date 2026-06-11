import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { GuessLetter } from "@/lib/gameLogic";
import { MAX_GUESSES } from "@/lib/gameLogic";
import { getWordleNumber, getTodayIST } from "@/data/wordbank";

interface WinModalProps {
  isOpen: boolean;
  won: boolean;
  answer: string;
  guesses: GuessLetter[][];
  onClose: () => void;
}

function buildEmojiGrid(guesses: GuessLetter[][]): string {
  return guesses
    .map((row) =>
      row
        .map(({ state }) => {
          if (state === "correct") return "🟩";
          if (state === "present") return "🟨";
          return "⬛";
        })
        .join("")
    )
    .join("\n");
}

export function WinModal({ isOpen, won, answer, guesses, onClose }: WinModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !won) return;
    return () => {
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
    };
  }, [isOpen, won]);

  const wordleNum = getWordleNumber();
  const dateStr = getTodayIST().split("-").reverse().join("/"); // DD/MM/YYYY
  const score = won ? `${guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  const emojiGrid = buildEmojiGrid(guesses);

  const shareText = `🍌 Miniondle #${wordleNum} — ${dateStr}\n${score}\n\n${emojiGrid}`;

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = shareText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-sm mx-4 mb-0 bg-minion-panel rounded-t-3xl sm:rounded-3xl shadow-2xl border border-minion-border overflow-hidden"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >
            {/* Header */}
            <div className={`px-5 py-4 flex items-center justify-between ${won ? "bg-minion-green" : "bg-minion-gray"}`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{won ? "🎉" : "😢"}</span>
                <h2 className="text-white font-extrabold text-xl tracking-wide">
                  {won ? "Bello!" : "Bee-do Bee-do!"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white text-2xl leading-none font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* Score + answer */}
              <div className="text-center">
                <p className="text-minion-muted text-xs uppercase tracking-widest font-semibold">
                  Miniondle #{wordleNum} · {dateStr}
                </p>
                {won ? (
                  <>
                    <p className="text-minion-dark font-extrabold text-3xl mt-1">
                      {score} 🍌
                    </p>
                    <p className="text-minion-muted text-sm mt-1">
                      The word was <span className="font-bold text-minion-dark uppercase tracking-wider">{answer}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-minion-dark font-extrabold text-3xl mt-1">X/6 😭</p>
                    <p className="text-minion-muted text-sm mt-1">
                      The word was <span className="font-bold text-minion-dark uppercase tracking-wider">{answer}</span>
                    </p>
                  </>
                )}
              </div>

              {/* Emoji grid preview */}
              <div className="bg-minion-cardbg border border-minion-border rounded-xl p-3 text-center">
                <p className="font-mono text-xl leading-6 tracking-wider whitespace-pre">{emojiGrid}</p>
              </div>

              {/* YouTube Victory Song */}
              {won && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl overflow-hidden border-2 border-minion-yellow shadow-lg"
                >
                  <div className="bg-minion-yellow/20 px-3 py-2 flex items-center gap-2">
                    <span className="text-base">🎵</span>
                    <span className="text-xs font-bold text-minion-dark uppercase tracking-wide">Victory Bop!</span>
                  </div>
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      ref={iframeRef}
                      className="absolute inset-0 w-full h-full"
                      src="https://www.youtube.com/embed/M7FIvfx5J10?autoplay=1&rel=0"
                      title="Minions Victory Song"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              )}

              {/* Share button */}
              <button
                onClick={handleShare}
                className="w-full bg-minion-blue text-white font-extrabold py-3 rounded-xl text-base tracking-wide hover:bg-minion-blue/90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>{copied ? "✅" : "🍌"}</span>
                {copied ? "Copied!" : "Share Result"}
              </button>

              <p className="text-center text-xs text-minion-muted">
                New word every day at 12:00 AM IST
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
