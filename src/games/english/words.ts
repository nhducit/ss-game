export interface Word {
  english: string
  emoji: string
}

export interface Category {
  id: string
  name: string
  emoji: string
  words: Word[]
}

export const categories: Category[] = [
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐾',
    words: [
      { english: 'cat', emoji: '🐱' },
      { english: 'dog', emoji: '🐶' },
      { english: 'fish', emoji: '🐟' },
      { english: 'bird', emoji: '🐦' },
      { english: 'duck', emoji: '🦆' },
      { english: 'frog', emoji: '🐸' },
      { english: 'bear', emoji: '🐻' },
      { english: 'lion', emoji: '🦁' },
      { english: 'rabbit', emoji: '🐰' },
      { english: 'monkey', emoji: '🐵' },
      { english: 'tiger', emoji: '🐯' },
      { english: 'pig', emoji: '🐷' },
    ],
  },
  {
    id: 'colors',
    name: 'Colors',
    emoji: '🎨',
    words: [
      { english: 'red', emoji: '🔴' },
      { english: 'blue', emoji: '🔵' },
      { english: 'green', emoji: '🟢' },
      { english: 'pink', emoji: '🩷' },
      { english: 'white', emoji: '⚪' },
      { english: 'black', emoji: '⚫' },
      { english: 'orange', emoji: '🟠' },
      { english: 'purple', emoji: '🟣' },
      { english: 'brown', emoji: '🟤' },
      { english: 'yellow', emoji: '🟡' },
    ],
  },
  {
    id: 'food',
    name: 'Food',
    emoji: '🍽️',
    words: [
      { english: 'rice', emoji: '🍚' },
      { english: 'milk', emoji: '🥛' },
      { english: 'egg', emoji: '🥚' },
      { english: 'cake', emoji: '🎂' },
      { english: 'apple', emoji: '🍎' },
      { english: 'bread', emoji: '🍞' },
      { english: 'water', emoji: '💧' },
      { english: 'juice', emoji: '🧃' },
      { english: 'candy', emoji: '🍬' },
      { english: 'banana', emoji: '🍌' },
    ],
  },
  {
    id: 'family',
    name: 'Family',
    emoji: '👨‍👩‍👧‍👦',
    words: [
      { english: 'mom', emoji: '👩' },
      { english: 'dad', emoji: '👨' },
      { english: 'baby', emoji: '👶' },
      { english: 'sister', emoji: '👧' },
      { english: 'brother', emoji: '👦' },
      { english: 'grandma', emoji: '👵' },
      { english: 'grandpa', emoji: '👴' },
      { english: 'uncle', emoji: '👨‍🦱' },
      { english: 'aunt', emoji: '👩‍🦱' },
      { english: 'friend', emoji: '🤝' },
    ],
  },
  {
    id: 'body',
    name: 'Body',
    emoji: '🧍',
    words: [
      { english: 'head', emoji: '🗣️' },
      { english: 'eye', emoji: '👁️' },
      { english: 'ear', emoji: '👂' },
      { english: 'nose', emoji: '👃' },
      { english: 'mouth', emoji: '👄' },
      { english: 'hand', emoji: '✋' },
      { english: 'foot', emoji: '🦶' },
      { english: 'leg', emoji: '🦵' },
      { english: 'arm', emoji: '💪' },
      { english: 'hair', emoji: '💇' },
    ],
  },
  {
    id: 'numbers',
    name: 'Numbers',
    emoji: '🔢',
    words: [
      { english: 'one', emoji: '1️⃣' },
      { english: 'two', emoji: '2️⃣' },
      { english: 'three', emoji: '3️⃣' },
      { english: 'four', emoji: '4️⃣' },
      { english: 'five', emoji: '5️⃣' },
      { english: 'six', emoji: '6️⃣' },
      { english: 'seven', emoji: '7️⃣' },
      { english: 'eight', emoji: '8️⃣' },
      { english: 'nine', emoji: '9️⃣' },
      { english: 'ten', emoji: '🔟' },
    ],
  },
]

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
