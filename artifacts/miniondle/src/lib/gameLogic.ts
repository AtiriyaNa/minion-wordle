export type LetterState = "correct" | "present" | "absent" | "empty" | "pending";

export interface GuessLetter {
  letter: string;
  state: LetterState;
}

export interface GameState {
  answer: string;
  guesses: GuessLetter[][];
  currentGuess: string;
  gameOver: boolean;
  won: boolean;
  savedDate: string;
}

export function evaluateGuess(guess: string, answer: string): GuessLetter[] {
  const result: GuessLetter[] = Array(answer.length).fill(null).map((_, i) => ({
    letter: guess[i] || "",
    state: "absent" as LetterState,
  }));

  const answerLetters = answer.split("");
  const guessLetters = guess.split("");
  const usedInAnswer = new Array(answer.length).fill(false);
  const usedInGuess = new Array(guess.length).fill(false);

  // First pass: mark correct positions
  for (let i = 0; i < answer.length; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      result[i].state = "correct";
      usedInAnswer[i] = true;
      usedInGuess[i] = true;
    }
  }

  // Second pass: mark present (wrong position)
  for (let i = 0; i < guess.length; i++) {
    if (usedInGuess[i]) continue;
    for (let j = 0; j < answer.length; j++) {
      if (!usedInAnswer[j] && guessLetters[i] === answerLetters[j]) {
        result[i].state = "present";
        usedInAnswer[j] = true;
        usedInGuess[i] = true;
        break;
      }
    }
  }

  return result;
}

export function getKeyboardColors(guesses: GuessLetter[][]): Record<string, LetterState> {
  const colors: Record<string, LetterState> = {};
  const priority: Record<LetterState, number> = {
    correct: 3,
    present: 2,
    absent: 1,
    empty: 0,
    pending: 0,
  };

  for (const guess of guesses) {
    for (const { letter, state } of guess) {
      if (!letter) continue;
      const existing = colors[letter];
      if (!existing || priority[state] > priority[existing]) {
        colors[letter] = state;
      }
    }
  }

  return colors;
}

export const MAX_GUESSES = 6;
