export interface Word {
  english: string
  vietnamese: string
  emoji: string
}

export interface Category {
  id: string
  name: string
  nameVi: string
  emoji: string
  words: Word[]
}

export const categories: Category[] = [
  {
    id: 'animals',
    name: 'Animals',
    nameVi: 'Động vật',
    emoji: '🐾',
    words: [
      { english: 'cat', vietnamese: 'con mèo', emoji: '🐱' },
      { english: 'dog', vietnamese: 'con chó', emoji: '🐶' },
      { english: 'fish', vietnamese: 'con cá', emoji: '🐟' },
      { english: 'bird', vietnamese: 'con chim', emoji: '🐦' },
      { english: 'duck', vietnamese: 'con vịt', emoji: '🦆' },
      { english: 'frog', vietnamese: 'con ếch', emoji: '🐸' },
      { english: 'bear', vietnamese: 'con gấu', emoji: '🐻' },
      { english: 'lion', vietnamese: 'sư tử', emoji: '🦁' },
      { english: 'rabbit', vietnamese: 'con thỏ', emoji: '🐰' },
      { english: 'monkey', vietnamese: 'con khỉ', emoji: '🐵' },
      { english: 'tiger', vietnamese: 'con hổ', emoji: '🐯' },
      { english: 'pig', vietnamese: 'con heo', emoji: '🐷' },
    ],
  },
  {
    id: 'colors',
    name: 'Colors',
    nameVi: 'Màu sắc',
    emoji: '🎨',
    words: [
      { english: 'red', vietnamese: 'đỏ', emoji: '🔴' },
      { english: 'blue', vietnamese: 'xanh dương', emoji: '🔵' },
      { english: 'green', vietnamese: 'xanh lá', emoji: '🟢' },
      { english: 'pink', vietnamese: 'hồng', emoji: '🩷' },
      { english: 'white', vietnamese: 'trắng', emoji: '⚪' },
      { english: 'black', vietnamese: 'đen', emoji: '⚫' },
      { english: 'orange', vietnamese: 'cam', emoji: '🟠' },
      { english: 'purple', vietnamese: 'tím', emoji: '🟣' },
      { english: 'brown', vietnamese: 'nâu', emoji: '🟤' },
      { english: 'yellow', vietnamese: 'vàng', emoji: '🟡' },
    ],
  },
  {
    id: 'food',
    name: 'Food',
    nameVi: 'Thức ăn',
    emoji: '🍽️',
    words: [
      { english: 'rice', vietnamese: 'cơm', emoji: '🍚' },
      { english: 'milk', vietnamese: 'sữa', emoji: '🥛' },
      { english: 'egg', vietnamese: 'trứng', emoji: '🥚' },
      { english: 'cake', vietnamese: 'bánh', emoji: '🎂' },
      { english: 'apple', vietnamese: 'táo', emoji: '🍎' },
      { english: 'bread', vietnamese: 'bánh mì', emoji: '🍞' },
      { english: 'water', vietnamese: 'nước', emoji: '💧' },
      { english: 'juice', vietnamese: 'nước ép', emoji: '🧃' },
      { english: 'candy', vietnamese: 'kẹo', emoji: '🍬' },
      { english: 'banana', vietnamese: 'chuối', emoji: '🍌' },
    ],
  },
  {
    id: 'family',
    name: 'Family',
    nameVi: 'Gia đình',
    emoji: '👨‍👩‍👧‍👦',
    words: [
      { english: 'mom', vietnamese: 'mẹ', emoji: '👩' },
      { english: 'dad', vietnamese: 'bố', emoji: '👨' },
      { english: 'baby', vietnamese: 'em bé', emoji: '👶' },
      { english: 'sister', vietnamese: 'chị/em gái', emoji: '👧' },
      { english: 'brother', vietnamese: 'anh/em trai', emoji: '👦' },
      { english: 'grandma', vietnamese: 'bà', emoji: '👵' },
      { english: 'grandpa', vietnamese: 'ông', emoji: '👴' },
      { english: 'uncle', vietnamese: 'chú/bác', emoji: '👨‍🦱' },
      { english: 'aunt', vietnamese: 'cô/dì', emoji: '👩‍🦱' },
      { english: 'friend', vietnamese: 'bạn', emoji: '🤝' },
    ],
  },
  {
    id: 'body',
    name: 'Body',
    nameVi: 'Cơ thể',
    emoji: '🧍',
    words: [
      { english: 'head', vietnamese: 'đầu', emoji: '🗣️' },
      { english: 'eye', vietnamese: 'mắt', emoji: '👁️' },
      { english: 'ear', vietnamese: 'tai', emoji: '👂' },
      { english: 'nose', vietnamese: 'mũi', emoji: '👃' },
      { english: 'mouth', vietnamese: 'miệng', emoji: '👄' },
      { english: 'hand', vietnamese: 'tay', emoji: '✋' },
      { english: 'foot', vietnamese: 'bàn chân', emoji: '🦶' },
      { english: 'leg', vietnamese: 'chân', emoji: '🦵' },
      { english: 'arm', vietnamese: 'cánh tay', emoji: '💪' },
      { english: 'hair', vietnamese: 'tóc', emoji: '💇' },
    ],
  },
  {
    id: 'numbers',
    name: 'Numbers',
    nameVi: 'Số đếm',
    emoji: '🔢',
    words: [
      { english: 'one', vietnamese: 'một', emoji: '1️⃣' },
      { english: 'two', vietnamese: 'hai', emoji: '2️⃣' },
      { english: 'three', vietnamese: 'ba', emoji: '3️⃣' },
      { english: 'four', vietnamese: 'bốn', emoji: '4️⃣' },
      { english: 'five', vietnamese: 'năm', emoji: '5️⃣' },
      { english: 'six', vietnamese: 'sáu', emoji: '6️⃣' },
      { english: 'seven', vietnamese: 'bảy', emoji: '7️⃣' },
      { english: 'eight', vietnamese: 'tám', emoji: '8️⃣' },
      { english: 'nine', vietnamese: 'chín', emoji: '9️⃣' },
      { english: 'ten', vietnamese: 'mười', emoji: '🔟' },
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
