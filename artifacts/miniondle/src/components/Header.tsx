import { motion } from "framer-motion";

interface HeaderProps {
  onHintOpen: () => void;
  streak: number;
}

export function Header({ onHintOpen, streak }: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b border-minion-border bg-minion-blue">
      <div className="w-10" />
      <motion.div
        className="flex flex-col items-center"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-white font-extrabold text-2xl tracking-widest uppercase leading-none font-display">
          Miniondle
        </h1>
        <p className="text-minion-yellow text-[10px] font-semibold tracking-widest uppercase opacity-80 mt-0.5">
          A Minions Word Game
        </p>
      </motion.div>
      <div className="flex items-center gap-3">
        {streak > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-base">🔥</span>
            <span className="text-white font-bold text-sm">{streak}</span>
          </div>
        )}
        <button
          onClick={onHintOpen}
          className="w-10 h-10 rounded-full bg-minion-yellow flex items-center justify-center text-minion-dark font-extrabold text-lg hover:bg-minion-yellow/90 active:scale-90 transition-all shadow-md"
          aria-label="Get a hint"
        >
          💡
        </button>
      </div>
    </header>
  );
}
