import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  hint: string;
  hint1Unlocked: boolean;
  hint2Unlocked: boolean;
  onUnlockHint: (hintNum: 1 | 2, password: string) => boolean;
}

export function HintModal({
  isOpen,
  onClose,
  category,
  hint,
  hint1Unlocked,
  hint2Unlocked,
  onUnlockHint,
}: HintModalProps) {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");

  function tryUnlock1() {
    const ok = onUnlockHint(1, password1);
    if (!ok) {
      setError1("Wrong password! 🙈");
      setTimeout(() => setError1(""), 2000);
    }
    setPassword1("");
  }

  function tryUnlock2() {
    const ok = onUnlockHint(2, password2);
    if (!ok) {
      setError2("Wrong password! 🙈");
      setTimeout(() => setError2(""), 2000);
    }
    setPassword2("");
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-sm mx-4 mb-4 sm:mb-0 bg-minion-panel rounded-2xl shadow-2xl border border-minion-border overflow-hidden"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="bg-minion-blue px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💡</span>
                <h2 className="text-white font-extrabold text-lg tracking-wide">Hints</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white text-2xl leading-none font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* Hint 1 - Category */}
              <div className="bg-minion-cardbg rounded-xl border border-minion-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🍌</span>
                  <span className="font-bold text-minion-dark text-sm uppercase tracking-wide">Hint 1 — Category</span>
                </div>
                {hint1Unlocked ? (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-minion-dark font-semibold text-base"
                  >
                    {category}
                  </motion.p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-minion-muted text-xs">Enter the secret password to unlock:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && tryUnlock1()}
                        placeholder="secret password..."
                        className="flex-1 bg-white border border-minion-border rounded-lg px-3 py-2 text-sm text-minion-dark placeholder:text-minion-muted focus:outline-none focus:border-minion-blue"
                      />
                      <button
                        onClick={tryUnlock1}
                        className="bg-minion-blue text-white font-bold px-3 py-2 rounded-lg text-sm hover:bg-minion-blue/90 active:scale-95 transition-all"
                      >
                        Go
                      </button>
                    </div>
                    {error1 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-xs font-semibold"
                      >
                        {error1}
                      </motion.p>
                    )}
                  </div>
                )}
              </div>

              {/* Hint 2 - Full Hint */}
              <div className="bg-minion-cardbg rounded-xl border border-minion-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🥽</span>
                  <span className="font-bold text-minion-dark text-sm uppercase tracking-wide">Hint 2 — Full Hint</span>
                </div>
                {hint2Unlocked ? (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-minion-dark font-semibold text-sm leading-relaxed"
                  >
                    {hint}
                  </motion.p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-minion-muted text-xs">Enter the secret password to unlock:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && tryUnlock2()}
                        placeholder="secret password..."
                        className="flex-1 bg-white border border-minion-border rounded-lg px-3 py-2 text-sm text-minion-dark placeholder:text-minion-muted focus:outline-none focus:border-minion-blue"
                      />
                      <button
                        onClick={tryUnlock2}
                        className="bg-minion-blue text-white font-bold px-3 py-2 rounded-lg text-sm hover:bg-minion-blue/90 active:scale-95 transition-all"
                      >
                        Go
                      </button>
                    </div>
                    {error2 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-xs font-semibold"
                      >
                        {error2}
                      </motion.p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
