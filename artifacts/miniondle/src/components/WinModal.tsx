import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

interface WinModalProps {
  isOpen: boolean;
  won: boolean;
  answer: string;
  guessCount: number;
  onClose: () => void;
}

export function WinModal({ isOpen, won, answer, guessCount, onClose }: WinModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!isOpen || !won) return;
    // Stop video when modal closes
    return () => {
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
    };
  }, [isOpen, won]);

  const shareText = won
    ? `🍌 Miniondle — I guessed today's word "${answer}" in ${guessCount} ${guessCount === 1 ? "try" : "tries"}! Bello! 🎉`
    : `🍌 Miniondle — I couldn't guess today's word! 😭 The answer was "${answer}".`;

  function handleShare() {
    if (navigator.share) {
      navigator.share({ text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Copied to clipboard!");
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
              {won ? (
                <div className="text-center">
                  <motion.p
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-minion-dark font-extrabold text-2xl uppercase tracking-widest"
                  >
                    {answer}
                  </motion.p>
                  <p className="text-minion-muted text-sm mt-1">
                    Solved in <span className="font-bold text-minion-blue">{guessCount}</span> {guessCount === 1 ? "guess" : "guesses"}!
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-minion-muted text-sm">The word was:</p>
                  <p className="text-minion-dark font-extrabold text-2xl uppercase tracking-widest mt-1">{answer}</p>
                </div>
              )}

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
                <span>🍌</span> Share Result
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
