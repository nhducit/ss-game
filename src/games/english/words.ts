export interface Word {
  english: string
  emoji: string
  sentences: string[]
}

export type Level = 'starters' | 'movers' | 'flyers'

export interface LevelInfo {
  id: Level
  name: string
  emoji: string
  description: string
}

export const levels: LevelInfo[] = [
  { id: 'starters', name: 'Starters', emoji: '🌱', description: 'Simple words (3-4 letters)' },
  { id: 'movers', name: 'Movers', emoji: '🚀', description: 'Medium words (4-6 letters)' },
  { id: 'flyers', name: 'Flyers', emoji: '✈️', description: 'Longer words (5-8 letters)' },
]

export interface Category {
  id: string
  name: string
  emoji: string
  words: Record<Level, Word[]>
}

export const categories: Category[] = [
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐾',
    words: {
      starters: [
        { english: 'cat', emoji: '🐱', sentences: ['The cat is sleeping.', 'I have a black cat.'] },
        { english: 'dog', emoji: '🐶', sentences: ['The dog is happy.', 'My dog likes to run.'] },
        { english: 'pig', emoji: '🐷', sentences: ['The pig is pink.', 'A pig lives on a farm.'] },
        { english: 'hen', emoji: '🐔', sentences: ['The hen has eggs.', 'A hen is a bird.'] },
        { english: 'cow', emoji: '🐮', sentences: ['The cow gives milk.', 'I see a big cow.'] },
        { english: 'ant', emoji: '🐜', sentences: ['The ant is small.', 'An ant can carry food.'] },
        { english: 'bat', emoji: '🦇', sentences: ['A bat can fly.', 'The bat sleeps at day.'] },
        { english: 'fox', emoji: '🦊', sentences: ['The fox is fast.', 'A fox has a long tail.'] },
      ],
      movers: [
        { english: 'fish', emoji: '🐟', sentences: ['The fish swims in water.', 'I caught a big fish.'] },
        { english: 'bird', emoji: '🐦', sentences: ['The bird can sing.', 'A bird has two wings.'] },
        { english: 'duck', emoji: '🦆', sentences: ['The duck swims in the pond.', 'A duck says quack.'] },
        { english: 'frog', emoji: '🐸', sentences: ['The frog can jump high.', 'A frog lives near water.'] },
        { english: 'bear', emoji: '🐻', sentences: ['The bear is very big.', 'A bear likes honey.'] },
        { english: 'lion', emoji: '🦁', sentences: ['The lion is the king.', 'A lion can roar loud.'] },
        { english: 'tiger', emoji: '🐯', sentences: ['The tiger has stripes.', 'A tiger runs very fast.'] },
        { english: 'horse', emoji: '🐴', sentences: ['The horse can run fast.', 'I want to ride a horse.'] },
        { english: 'whale', emoji: '🐋', sentences: ['The whale is very big.', 'A whale lives in the sea.'] },
        { english: 'sheep', emoji: '🐑', sentences: ['The sheep has soft wool.', 'I count sheep to sleep.'] },
      ],
      flyers: [
        { english: 'rabbit', emoji: '🐰', sentences: ['The rabbit has long ears.', 'My rabbit loves carrots.'] },
        { english: 'monkey', emoji: '🐵', sentences: ['The monkey climbs trees.', 'A monkey likes bananas.'] },
        { english: 'penguin', emoji: '🐧', sentences: ['The penguin lives in the cold.', 'A penguin cannot fly.'] },
        { english: 'dolphin', emoji: '🐬', sentences: ['The dolphin is very smart.', 'A dolphin jumps high.'] },
        { english: 'chicken', emoji: '🐔', sentences: ['The chicken lays eggs.', 'I like fried chicken.'] },
        { english: 'giraffe', emoji: '🦒', sentences: ['The giraffe has a long neck.', 'A giraffe is very tall.'] },
        { english: 'elephant', emoji: '🐘', sentences: ['The elephant is huge.', 'An elephant has a long trunk.'] },
        { english: 'butterfly', emoji: '🦋', sentences: ['The butterfly is beautiful.', 'A butterfly has big wings.'] },
      ],
    },
  },
  {
    id: 'colors',
    name: 'Colors',
    emoji: '🎨',
    words: {
      starters: [
        { english: 'red', emoji: '🔴', sentences: ['The apple is red.', 'I like red cars.'] },
        { english: 'blue', emoji: '🔵', sentences: ['The sky is blue.', 'I have a blue bag.'] },
        { english: 'pink', emoji: '🩷', sentences: ['Her dress is pink.', 'I like pink flowers.'] },
        { english: 'gray', emoji: '🩶', sentences: ['The cat is gray.', 'Clouds are gray today.'] },
        { english: 'gold', emoji: '🟡', sentences: ['The ring is gold.', 'I won a gold star.'] },
      ],
      movers: [
        { english: 'green', emoji: '🟢', sentences: ['The grass is green.', 'Frogs are green.'] },
        { english: 'white', emoji: '⚪', sentences: ['Snow is white.', 'The paper is white.'] },
        { english: 'black', emoji: '⚫', sentences: ['The night is black.', 'My shoes are black.'] },
        { english: 'brown', emoji: '🟤', sentences: ['The bear is brown.', 'I have brown hair.'] },
        { english: 'orange', emoji: '🟠', sentences: ['The orange is orange.', 'I like orange juice.'] },
        { english: 'purple', emoji: '🟣', sentences: ['Grapes are purple.', 'The flower is purple.'] },
        { english: 'yellow', emoji: '🟡', sentences: ['The sun is yellow.', 'Bananas are yellow.'] },
      ],
      flyers: [
        { english: 'silver', emoji: '🪙', sentences: ['The coin is silver.', 'I have a silver ring.'] },
        { english: 'golden', emoji: '✨', sentences: ['The sunset is golden.', 'She has golden hair.'] },
        { english: 'rainbow', emoji: '🌈', sentences: ['I see a rainbow in the sky.', 'A rainbow has many colors.'] },
        { english: 'turquoise', emoji: '🟦', sentences: ['The sea is turquoise.', 'I like turquoise stones.'] },
        { english: 'crimson', emoji: '🔴', sentences: ['The rose is crimson red.', 'The sky turned crimson.'] },
      ],
    },
  },
  {
    id: 'food',
    name: 'Food',
    emoji: '🍽️',
    words: {
      starters: [
        { english: 'egg', emoji: '🥚', sentences: ['I eat an egg.', 'The egg is white.'] },
        { english: 'jam', emoji: '🫙', sentences: ['I like jam on bread.', 'The jam is sweet.'] },
        { english: 'pie', emoji: '🥧', sentences: ['Mom made a pie.', 'The pie is yummy.'] },
        { english: 'nut', emoji: '🥜', sentences: ['I eat a nut.', 'The nut is small.'] },
        { english: 'pea', emoji: '🫛', sentences: ['I eat a green pea.', 'The pea is round.'] },
      ],
      movers: [
        { english: 'rice', emoji: '🍚', sentences: ['I eat rice every day.', 'Rice is white.'] },
        { english: 'milk', emoji: '🥛', sentences: ['I drink milk.', 'Milk is good for you.'] },
        { english: 'cake', emoji: '🎂', sentences: ['The cake is sweet.', 'I want birthday cake.'] },
        { english: 'apple', emoji: '🍎', sentences: ['The apple is red.', 'I eat an apple a day.'] },
        { english: 'bread', emoji: '🍞', sentences: ['I like bread and butter.', 'Bread is soft.'] },
        { english: 'water', emoji: '💧', sentences: ['I drink cold water.', 'Water is good for you.'] },
        { english: 'juice', emoji: '🧃', sentences: ['I drink orange juice.', 'Juice is sweet.'] },
        { english: 'candy', emoji: '🍬', sentences: ['The candy is sweet.', 'I love candy.'] },
      ],
      flyers: [
        { english: 'banana', emoji: '🍌', sentences: ['The banana is yellow.', 'Monkeys love bananas.'] },
        { english: 'cheese', emoji: '🧀', sentences: ['I like cheese on pizza.', 'The mouse eats cheese.'] },
        { english: 'cookie', emoji: '🍪', sentences: ['The cookie is crunchy.', 'I baked some cookies.'] },
        { english: 'chicken', emoji: '🍗', sentences: ['I like grilled chicken.', 'Chicken soup is warm.'] },
        { english: 'noodles', emoji: '🍜', sentences: ['I love eating noodles.', 'The noodles are hot.'] },
        { english: 'sandwich', emoji: '🥪', sentences: ['I made a sandwich.', 'The sandwich has cheese.'] },
        { english: 'pancake', emoji: '🥞', sentences: ['I eat pancakes for breakfast.', 'Pancakes are fluffy.'] },
      ],
    },
  },
  {
    id: 'family',
    name: 'Family',
    emoji: '👨‍👩‍👧‍👦',
    words: {
      starters: [
        { english: 'mom', emoji: '👩', sentences: ['My mom is kind.', 'I love my mom.'] },
        { english: 'dad', emoji: '👨', sentences: ['My dad is tall.', 'Dad reads to me.'] },
        { english: 'son', emoji: '👦', sentences: ['He is her son.', 'The son is young.'] },
        { english: 'boy', emoji: '👦', sentences: ['The boy can run.', 'He is a good boy.'] },
        { english: 'girl', emoji: '👧', sentences: ['The girl can sing.', 'She is a nice girl.'] },
      ],
      movers: [
        { english: 'baby', emoji: '👶', sentences: ['The baby is small.', 'The baby is cute.'] },
        { english: 'uncle', emoji: '👨‍🦱', sentences: ['My uncle is funny.', 'Uncle Tom visits us.'] },
        { english: 'aunt', emoji: '👩‍🦱', sentences: ['My aunt bakes cakes.', 'Aunt May is nice.'] },
        { english: 'friend', emoji: '🤝', sentences: ['She is my best friend.', 'A good friend helps you.'] },
        { english: 'child', emoji: '🧒', sentences: ['The child is happy.', 'Every child likes to play.'] },
        { english: 'twins', emoji: '👯', sentences: ['They are twins.', 'The twins look the same.'] },
      ],
      flyers: [
        { english: 'sister', emoji: '👧', sentences: ['My sister is older.', 'I play with my sister.'] },
        { english: 'brother', emoji: '👦', sentences: ['My brother is funny.', 'I have one brother.'] },
        { english: 'grandma', emoji: '👵', sentences: ['Grandma tells stories.', 'I visit grandma on Sunday.'] },
        { english: 'grandpa', emoji: '👴', sentences: ['Grandpa plays chess.', 'I love my grandpa.'] },
        { english: 'parents', emoji: '👫', sentences: ['My parents love me.', 'Parents take care of us.'] },
        { english: 'daughter', emoji: '👧', sentences: ['She is their daughter.', 'The daughter helps mom.'] },
        { english: 'husband', emoji: '👨', sentences: ['He is her husband.', 'The husband cooks dinner.'] },
      ],
    },
  },
  {
    id: 'body',
    name: 'Body',
    emoji: '🧍',
    words: {
      starters: [
        { english: 'eye', emoji: '👁️', sentences: ['I see with my eye.', 'She has blue eyes.'] },
        { english: 'ear', emoji: '👂', sentences: ['I hear with my ear.', 'The ear is small.'] },
        { english: 'arm', emoji: '💪', sentences: ['I wave my arm.', 'My arm is strong.'] },
        { english: 'leg', emoji: '🦵', sentences: ['I run with my legs.', 'My leg is long.'] },
        { english: 'toe', emoji: '🦶', sentences: ['I have ten toes.', 'My toe is small.'] },
      ],
      movers: [
        { english: 'head', emoji: '🗣️', sentences: ['I wear a hat on my head.', 'Nod your head yes.'] },
        { english: 'nose', emoji: '👃', sentences: ['I smell with my nose.', 'My nose is cold.'] },
        { english: 'mouth', emoji: '👄', sentences: ['I eat with my mouth.', 'Open your mouth wide.'] },
        { english: 'hand', emoji: '✋', sentences: ['I write with my hand.', 'Wave your hand hello.'] },
        { english: 'foot', emoji: '🦶', sentences: ['I walk with my feet.', 'My foot is big.'] },
        { english: 'hair', emoji: '💇', sentences: ['I brush my hair.', 'Her hair is long.'] },
        { english: 'teeth', emoji: '🦷', sentences: ['I brush my teeth.', 'My teeth are white.'] },
      ],
      flyers: [
        { english: 'finger', emoji: '☝️', sentences: ['I point with my finger.', 'I have ten fingers.'] },
        { english: 'elbow', emoji: '💪', sentences: ['I bump my elbow.', 'Bend your elbow.'] },
        { english: 'tongue', emoji: '👅', sentences: ['I taste with my tongue.', 'Stick out your tongue.'] },
        { english: 'shoulder', emoji: '🦺', sentences: ['My shoulder is sore.', 'Shrug your shoulders.'] },
        { english: 'stomach', emoji: '🤰', sentences: ['My stomach is full.', 'I feel butterflies in my stomach.'] },
        { english: 'forehead', emoji: '😊', sentences: ['Touch your forehead.', 'My forehead is warm.'] },
      ],
    },
  },
  {
    id: 'numbers',
    name: 'Numbers',
    emoji: '🔢',
    words: {
      starters: [
        { english: 'one', emoji: '1️⃣', sentences: ['I have one nose.', 'One plus one is two.'] },
        { english: 'two', emoji: '2️⃣', sentences: ['I have two hands.', 'Two cats are playing.'] },
        { english: 'six', emoji: '6️⃣', sentences: ['I am six years old.', 'Six is after five.'] },
        { english: 'ten', emoji: '🔟', sentences: ['I have ten fingers.', 'Count to ten.'] },
      ],
      movers: [
        { english: 'three', emoji: '3️⃣', sentences: ['I have three books.', 'A triangle has three sides.'] },
        { english: 'four', emoji: '4️⃣', sentences: ['A dog has four legs.', 'There are four seasons.'] },
        { english: 'five', emoji: '5️⃣', sentences: ['I have five pencils.', 'High five!'] },
        { english: 'seven', emoji: '7️⃣', sentences: ['There are seven days.', 'I am seven years old.'] },
        { english: 'eight', emoji: '8️⃣', sentences: ['The spider has eight legs.', 'I wake up at eight.'] },
        { english: 'nine', emoji: '9️⃣', sentences: ['Nine is before ten.', 'I have nine crayons.'] },
      ],
      flyers: [
        { english: 'eleven', emoji: '1️⃣1️⃣', sentences: ['There are eleven players.', 'Eleven comes after ten.'] },
        { english: 'twelve', emoji: '1️⃣2️⃣', sentences: ['There are twelve months.', 'Twelve eggs in a dozen.'] },
        { english: 'twenty', emoji: '2️⃣0️⃣', sentences: ['I can count to twenty.', 'Twenty is two tens.'] },
        { english: 'hundred', emoji: '💯', sentences: ['A hundred is a big number.', 'I scored a hundred points.'] },
        { english: 'thousand', emoji: '🔢', sentences: ['A thousand is very many.', 'There are a thousand stars.'] },
      ],
    },
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

/** Get words for a specific level from a category */
export function getWords(category: Category, level: Level): Word[] {
  return category.words[level]
}
