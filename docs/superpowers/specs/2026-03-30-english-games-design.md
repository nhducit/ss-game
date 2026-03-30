# English Learning Games — Word Match & Listen & Pick

## Overview
Two additional English learning games for kids (ages 7-8), complementing the existing Spelling Bee. Both use the browser's Web Speech API and share the same word data from `spelling-bee/words.ts`.

## Game 1: Word Match (Memory)

A card-flipping memory game where kids match emoji cards with their English word cards.

### Mechanics
1. Grid of face-down cards (mix of emoji cards and English word cards)
2. Tap a card to flip it — if it's a word card, TTS speaks the word
3. Flip two cards: if they match (emoji + its English word), they stay face-up
4. If no match, both flip back after a short delay
5. Goal: match all pairs with fewest flips

### Layout
- Category picker screen (same as Spelling Bee)
- 4x3 grid = 6 pairs (subset of category words, shuffled each game)
- Cards show either an emoji or an English word
- Nav bar: back button, category name, moves counter, matches counter
- Completion modal with stats

### Key Details
- When a word card is flipped, TTS speaks it (reinforces pronunciation)
- Matched pairs get a green highlight
- Cards have a flip animation (CSS transform)
- Mobile-friendly: cards sized to fit viewport

## Game 2: Listen & Pick

A listening comprehension quiz where kids hear a word and pick the matching emoji.

### Mechanics
1. TTS speaks an English word automatically
2. Show 4 emoji options (1 correct + 3 distractors from same category)
3. Tap the correct emoji = score + next word
4. Tap wrong = shake + try again (no penalty, encourages learning)
5. Replay button to hear the word again
6. Progress through all words in category

### Layout
- Category picker screen (same pattern)
- Large speaker icon/button at top
- 2x2 grid of large emoji buttons below
- Score and progress in nav bar
- Completion screen with score

### Key Details
- Distractors are always from the same category (plausible wrong answers)
- After correct answer, briefly show the English word spelled out before advancing
- Slow TTS rate (0.7) for clarity

## Shared Architecture
- Both games reuse `src/games/spelling-bee/words.ts` (move to `src/games/english/words.ts`)
- Each game is a self-contained component following existing game patterns
- Routes: `/word-match`, `/listen-pick`

## Assumptions
- **Shared word data**: Moved to a shared `english/` directory since 3 games now use it
- **6 pairs for memory**: 12 cards fits well on mobile in a 4x3 grid; full category would be too many cards
- **No timer**: Kids shouldn't feel time pressure while learning
- **English-only UI**: No Vietnamese text in the interface (per user preference)
