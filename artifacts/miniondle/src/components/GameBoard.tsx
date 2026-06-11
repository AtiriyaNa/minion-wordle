import { motion, AnimatePresence } from "framer-motion";
import type { GuessLetter, LetterState } from "@/lib/gameLogic";
import { MAX_GUESSES } from "@/lib/gameLogic";

interface GameBoardProps {
  guesses: GuessLetter[][];
  currentGuess: string;
  wordLength: number;
  shake: boolean;
  revealRow: number | null;
}

const tileColors: Record<LetterState, string> = {
  correct: "bg-minion-green border-minion-green text-white",
  present: "bg-minion-yellow border-minion-yellow text-minion-dark",
  absent: "bg-minion-gray border-minion-gray text-white",
  empty: "bg-transparent border-minion-border text-minion-dark",
  pending: "bg-transparent border-minion-accent text-minion-dark",
};

interface TileProps {
  letter: string;
  state: LetterState;
  index: number;
  isRevealing: boolean;
  delay: number;
}

function Tile({ letter, state, isRevealing, delay }: TileProps) {
  return (
    <motion.div
      className={`
        flex items-center justify-center
        font-extrabold uppercase select-none
        border-2 rounded-md
        ${tileColors[state]}
        aspect-square w-full
      `}
      style={{ fontSize: "clamp(1rem, 5vw, 1.75rem)" }}
      animate={
        isRevealing
          ? {
              rotateX: [0, -90, 0],
              transition: { duration: 0.5, delay, ease: "easeInOut" },
            }
          : {}
      }
      initial={false}
    >
      {letter}
    </motion.div>
  );
}

export function GameBoard({ guesses, currentGuess, wordLength, shake, revealRow }: GameBoardProps) {
  const rows: { letters: { letter: string; state: LetterState }[]; isRevealing: boolean }[] = [];

  for (let i = 0; i < MAX_GUESSES; i++) {
    if (i < guesses.length) {
      rows.push({
        letters: guesses[i],
        isRevealing: revealRow === i,
      });
    } else if (i === guesses.length) {
      const letters = Array(wordLength)
        .fill(null)
        .map((_, j) => ({
          letter: currentGuess[j] || "",
          state: currentGuess[j] ? ("pending" as LetterState) : ("empty" as LetterState),
        }));
      rows.push({ letters, isRevealing: false });
    } else {
      rows.push({
        letters: Array(wordLength).fill({ letter: "", state: "empty" as LetterState }),
        isRevealing: false,
      });
    }
  }

  const maxTileSize = wordLength <= 5 ? "max-w-[64px]" : "max-w-[56px]";

  return (
    <div className="flex flex-col items-center gap-1.5 w-full px-2">
      {rows.map((row, rowIdx) => (
        <motion.div
          key={rowIdx}
          className="flex gap-1.5 w-full justify-center"
          animate={shake && rowIdx === guesses.length ? { x: [0, -8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {row.letters.map((tile, colIdx) => (
            <div key={colIdx} className={`flex-1 ${maxTileSize}`}>
              <AnimatePresence mode="wait">
                {tile.letter ? (
                  <motion.div
                    key={tile.letter + colIdx + rowIdx + tile.state}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.1 }}
                    className="w-full h-full"
                  >
                    <Tile
                      letter={tile.letter}
                      state={tile.state}
                      index={colIdx}
                      isRevealing={row.isRevealing}
                      delay={colIdx * 0.12}
                    />
                  </motion.div>
                ) : (
                  <Tile
                    letter={tile.letter}
                    state={tile.state}
                    index={colIdx}
                    isRevealing={row.isRevealing}
                    delay={colIdx * 0.12}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
