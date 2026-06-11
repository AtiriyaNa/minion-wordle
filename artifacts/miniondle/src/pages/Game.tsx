import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { GameBoard } from "@/components/GameBoard";
import { Keyboard } from "@/components/Keyboard";
import { HintModal } from "@/components/HintModal";
import { WinModal } from "@/components/WinModal";
import { evaluateGuess, getKeyboardColors, MAX_GUESSES } from "@/lib/gameLogic";
import type { GuessLetter } from "@/lib/gameLogic";
import { getDailyWord, getTodayIST, getWordleNumber } from "@/data/wordbank";

interface State {
  guesses: GuessLetter[][];
  currentGuess: string;
  gameOver: boolean;
  won: boolean;
  hint1Unlocked: boolean;
  hint2Unlocked: boolean;
  streak: number;
  savedDate: string;
}

const STORAGE_KEY = "miniondle_state";

function loadState(): State | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as State;
  } catch {
    return null;
  }
}

function saveState(state: State) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getInitialState(): State {
  const today = getTodayIST();
  const saved = loadState();

  if (saved && saved.savedDate === today) {
    return saved;
  }

  const streak = saved?.won && saved?.savedDate === getPreviousDay(today)
    ? saved.streak
    : saved?.streak && saved?.savedDate === getPreviousDay(today) ? saved.streak : 0;

  return {
    guesses: [],
    currentGuess: "",
    gameOver: false,
    won: false,
    hint1Unlocked: false,
    hint2Unlocked: false,
    streak,
    savedDate: today,
  };
}

function getPreviousDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split("T")[0];
}

type Action =
  | { type: "TYPE"; key: string }
  | { type: "BACKSPACE" }
  | { type: "SUBMIT"; answer: string }
  | { type: "UNLOCK_HINT"; num: 1 | 2 };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TYPE": {
      if (state.gameOver) return state;
      const wordEntry = getDailyWord();
      if (state.currentGuess.length >= wordEntry.word.length) return state;
      return { ...state, currentGuess: state.currentGuess + action.key };
    }
    case "BACKSPACE": {
      if (state.gameOver) return state;
      return { ...state, currentGuess: state.currentGuess.slice(0, -1) };
    }
    case "SUBMIT": {
      if (state.gameOver) return state;
      const { answer } = action;
      if (state.currentGuess.length !== answer.length) return state;

      const evaluated = evaluateGuess(state.currentGuess, answer);
      const newGuesses = [...state.guesses, evaluated];
      const won = evaluated.every((l) => l.state === "correct");
      const gameOver = won || newGuesses.length >= MAX_GUESSES;
      const streak = won ? state.streak + 1 : state.streak;

      return {
        ...state,
        guesses: newGuesses,
        currentGuess: "",
        gameOver,
        won,
        streak,
      };
    }
    case "UNLOCK_HINT": {
      if (action.num === 1) return { ...state, hint1Unlocked: true };
      return { ...state, hint2Unlocked: true };
    }
    default:
      return state;
  }
}

function getNextResetLabel(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);

  // Next midnight IST = tomorrow at 00:00 IST
  const nextMidnightIST = new Date(
    Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate() + 1, 0, 0, 0)
    - istOffset
  );

  const d = new Date(nextMidnightIST.getTime() + istOffset);
  const day = d.getUTCDate();
  const month = d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
  const year = d.getUTCFullYear();
  return `12:00 AM IST · ${day} ${month} ${year}`;
}

export function Game() {
  const wordEntry = getDailyWord();
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
  const [shake, setShake] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [winOpen, setWinOpen] = useState(false);
  const [revealRow, setRevealRow] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const prevGuessCount = useRef(state.guesses.length);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Reveal animation and win/lose modal
  useEffect(() => {
    if (state.guesses.length > prevGuessCount.current) {
      const row = state.guesses.length - 1;
      setRevealRow(row);
      const revealDuration = wordEntry.word.length * 120 + 500;
      const timer = setTimeout(() => {
        setRevealRow(null);
        if (state.gameOver) {
          setTimeout(() => setWinOpen(true), 200);
        }
      }, revealDuration);
      prevGuessCount.current = state.guesses.length;
      return () => clearTimeout(timer);
    }
  }, [state.guesses.length, state.gameOver, wordEntry.word.length]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  const handleKey = useCallback((key: string) => {
    if (state.gameOver) return;
    dispatch({ type: "TYPE", key: key.toUpperCase() });
  }, [state.gameOver]);

  const handleBackspace = useCallback(() => {
    dispatch({ type: "BACKSPACE" });
  }, []);

  const handleEnter = useCallback(() => {
    if (state.gameOver) return;
    const answer = wordEntry.word;
    if (state.currentGuess.length < answer.length) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      showToast(`Word must be ${answer.length} letters`);
      return;
    }
    dispatch({ type: "SUBMIT", answer });
  }, [state.gameOver, state.currentGuess, wordEntry.word]);

  // Physical keyboard support — skip when focus is inside an input or textarea
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Enter") handleEnter();
      else if (e.key === "Backspace") handleBackspace();
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleEnter, handleBackspace, handleKey]);

  function tryUnlockHint(num: 1 | 2, password: string): boolean {
    const passwords: Record<1 | 2, string> = {
      1: "minions are sexy",
      2: "proud minion lover",
    };
    if (password.toLowerCase().trim() === passwords[num]) {
      dispatch({ type: "UNLOCK_HINT", num });
      return true;
    }
    return false;
  }

  const keyColors = getKeyboardColors(state.guesses);

  return (
    <div className="h-dvh flex flex-col bg-minion-bg select-none overflow-hidden">
      <Header onHintOpen={() => setHintOpen(true)} streak={state.streak} />

      {/* Word length indicator + day info */}
      <div className="flex flex-col items-center pt-3 pb-1 gap-1">
        <div className="bg-minion-blue/10 border border-minion-blue/20 rounded-full px-4 py-1.5 flex items-center gap-2">
          <span className="text-minion-blue text-xs font-bold uppercase tracking-widest">
            {wordEntry.word.length}-Letter Word
          </span>
          <span className="text-minion-muted text-xs">·</span>
          <span className="text-minion-muted text-xs">
            {state.guesses.length}/{MAX_GUESSES} guesses
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-minion-muted font-semibold">
          <span className="text-minion-blue font-bold">#{getWordleNumber()}</span>
          <span>·</span>
          <span>Next word: {getNextResetLabel()}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex flex-col items-center justify-center py-2 px-2 gap-3">
        <GameBoard
          guesses={state.guesses}
          currentGuess={state.currentGuess}
          wordLength={wordEntry.word.length}
          shake={shake}
          revealRow={revealRow}
        />

        {/* Minion image strip */}
        <div className="flex items-center justify-center gap-3 mt-1">
          {["🍌", "👁️", "🎤"].map((em, i) => (
            <motion.span
              key={i}
              className="text-2xl"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
            >
              {em}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Keyboard */}
      <div className="w-full max-w-lg mx-auto">
        <Keyboard
          onKey={handleKey}
          onEnter={handleEnter}
          onBackspace={handleBackspace}
          keyColors={keyColors}
        />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-minion-dark text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Modal */}
      <HintModal
        isOpen={hintOpen}
        onClose={() => setHintOpen(false)}
        category={wordEntry.category}
        hint={wordEntry.hint}
        hint1Unlocked={state.hint1Unlocked}
        hint2Unlocked={state.hint2Unlocked}
        onUnlockHint={tryUnlockHint}
      />

      {/* Footer */}
      <div className="w-full text-right px-4 pt-2 pb-1.5 bg-minion-blue/10 border-t border-minion-border mt-1">
        <p className="text-minion-muted text-[11px] font-semibold tracking-wide">
          Designed by <span className="text-minion-blue font-bold">Atiriya Narayan</span>
        </p>
      </div>

      {/* Win/Lose Modal */}
      <WinModal
        isOpen={winOpen}
        won={state.won}
        answer={wordEntry.word}
        guesses={state.guesses}
        onClose={() => setWinOpen(false)}
      />
    </div>
  );
}
