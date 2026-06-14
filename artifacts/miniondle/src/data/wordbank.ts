export interface WordEntry {
  word: string;
  category: string;
  hint: string;
}

export const WORD_BANK: WordEntry[] = [
  // 4-letter Minion Names
  { word: "DAVE", category: "Minion Names", hint: "One of Gru's most loyal minions — often seen on missions with him in Despicable Me 2." },
  { word: "CARL", category: "Minion Names", hint: "The minion who runs around yelling 'bee do bee do' — he's basically a one-man fire alarm." },
  { word: "MARK", category: "Minion Names", hint: "A named background minion from the films." },
  { word: "PHIL", category: "Minion Names", hint: "The minion Lucy tasers in Despicable Me 2 — he keeps popping up across the franchise." },

  // 5-letter Minion Names
  { word: "KEVIN", category: "Minion Names", hint: "The tall, ambitious leader of the trio in the Minions movie — he's the responsible one." },
  { word: "JERRY", category: "Minion Names", hint: "A named minion who appears across multiple Despicable Me films." },
  { word: "LARRY", category: "Minion Names", hint: "The minion Darwin famously tried to steal a banana from." },
  { word: "DONNY", category: "Minion Names", hint: "A named minion from the Despicable Me franchise." },
  { word: "JORGE", category: "Minion Names", hint: "A named minion — his name is the Spanish form of George." },
  { word: "LANCE", category: "Minion Names", hint: "A named minion from the Despicable Me world." },

  // 6-letter Minion Names
  { word: "STUART", category: "Minion Names", hint: "The one-eyed, guitar-playing minion — easily distracted by shiny things. Stars in the Minions film." },
  { word: "DARWIN", category: "Minion Names", hint: "The one-eyed minion notorious for plotting to steal Larry's banana." },
  { word: "SAMSON", category: "Minion Names", hint: "A named minion recognised across the franchise." },
  { word: "GERALD", category: "Minion Names", hint: "A named minion mentioned by name in the films." },
  { word: "MIGUEL", category: "Minion Names", hint: "A named minion from the Despicable Me universe." },

  // 4-letter Characters & Villains
  { word: "LUCY", category: "Characters & Villains", hint: "Gru's wife and AVL agent — she tasers first and asks questions later." },
  { word: "HERB", category: "Characters & Villains", hint: "Scarlet Overkill's inventor husband — he builds all her gadgets and weapons." },

  // 5-letter Characters & Villains
  { word: "MARGO", category: "Characters & Villains", hint: "The eldest of the three orphaned sisters adopted by Gru — serious and responsible." },
  { word: "EDITH", category: "Characters & Villains", hint: "The middle sister — pink hat, tomboy energy, loves anything dangerous." },
  { word: "AGNES", category: "Characters & Villains", hint: "The youngest sister, obsessed with unicorns — she is so fluffy she could die." },
  { word: "BRATT", category: "Characters & Villains", hint: "The 80s-obsessed villain from Despicable Me 3 — a former child TV star who never got over cancellation." },
  { word: "CLIVE", category: "Characters & Villains", hint: "The villain assistant from Despicable Me 4 — Maxime Le Mal's robotic sidekick." },
  { word: "SILAS", category: "Characters & Villains", hint: "The head of the Anti-Villain League (AVL) — he recruits Gru as a spy in Despicable Me 2." },
  { word: "FRITZ", category: "Characters & Villains", hint: "Dru's butler in Despicable Me 3 — very efficient, very nervous." },

  // 6-letter Characters & Villains
  { word: "VECTOR", category: "Characters & Villains", hint: "The orange-tracksuit-wearing antagonist of the first film — real name Victor Perkins. Stole the Great Pyramid of Giza." },
  { word: "MAXIME", category: "Characters & Villains", hint: "The main villain of Despicable Me 4 — Maxime Le Mal, an old rival of Gru's with a cockroach theme." },

  // 4-letter Minionese
  { word: "NAJE", category: "Minionese", hint: "Means 'take it' — borrowed from Chinese. Heard when minions pass fruit to each other." },
  { word: "POKA", category: "Minionese", hint: "Multiple meanings depending on tone — can mean 'what?' or 'screw it.' Also spelled boka/boca." },

  // 5-letter Minionese
  { word: "BELLO", category: "Minionese", hint: "The standard Minion greeting — borrowed from Italian, meaning 'beautiful/hello.'" },
  { word: "PAPOY", category: "Minionese", hint: "Means 'toy' in Minionese — unique to Minionese with no direct real-language origin. Also spelled baboi." },
  { word: "TROPA", category: "Minionese", hint: "Means 'a group of friends' — borrowed from Tagalog and Spanish. First heard in the Minions movie." },
  { word: "BELLA", category: "Minionese", hint: "Means 'beautiful' — borrowed from Italian. Stuart uses it while flirting in 1968 New York." },
  { word: "STOPA", category: "Minionese", hint: "Means 'stop' — a Minionese version of the English word. Heard when Stuart tries to hitchhike." },

  // 6-letter Minionese
  { word: "GELATO", category: "Minionese", hint: "Italian for ice cream — one of the Minions' favourite foods and words." },
  { word: "KANPAI", category: "Minionese", hint: "Means 'cheers!' — from Japanese. Kevin and Phil say it while clinking bananas." },
  { word: "KEMARI", category: "Minionese", hint: "Means 'come here' — borrowed from Indonesian." },
  { word: "POULET", category: "Minionese", hint: "French for 'chicken' — part of the famous phrase 'poulet tikka masala' said by the Minions." },
];

export function getDailyWord(): WordEntry {
  // Get current time in IST (UTC+5:30)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);

  // Build date string YYYY-MM-DD in IST
  const year = istNow.getUTCFullYear();
  const month = String(istNow.getUTCMonth() + 1).padStart(2, "0");
  const day = String(istNow.getUTCDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  // Hash the date string deterministically
// Hash the date string deterministically
let hash = 0;
for (let i = 0; i < dateStr.length; i++) {
  hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
}

// Extra mixing so consecutive dates don't map to consecutive indices
hash ^= hash >>> 16;
hash = Math.imul(hash, 0x45d9f3b);
hash ^= hash >>> 16;
hash = Math.imul(hash, 0x45d9f3b);
hash ^= hash >>> 16;

const index = hash % WORD_BANK.length;

export function getWordleNumber(): number {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  const epoch = new Date("2026-06-11T00:00:00.000Z");
  return Math.floor((istNow.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function getTodayIST(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  const year = istNow.getUTCFullYear();
  const month = String(istNow.getUTCMonth() + 1).padStart(2, "0");
  const day = String(istNow.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
