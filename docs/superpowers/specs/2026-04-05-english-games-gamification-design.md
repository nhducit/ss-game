# English Games Expansion + Gamification System

## Context

Educational game app for kids (ages 7-8). Currently has 3 English games (Spelling Bee, Word Match, Listen & Pick) with basic scoring, streaks, and per-category progress tracking with spaced repetition.

## New Games

### 1. Sentence Builder

**What:** Given a word + emoji, show one of its example sentences with words shuffled. Kid taps words in correct order to rebuild the sentence.

**Why this game:** The existing `sentences` data on every word is only shown *after* answering in Spelling Bee. This game makes sentences the primary learning mechanic, teaching grammar and word order.

**Flow:** Categories > Playing > Results (same 3-screen pattern as other games)

**Mechanics:**
- Show the emoji + target word at top
- Display the sentence with words shuffled as tappable chips
- Kid taps words in order to build the sentence
- Correct: green highlight, auto-advance after 2s with TTS reading the sentence
- Wrong word tapped: shake animation, no penalty (just can't place wrong word)
- Sentence is validated word-by-word as placed (not at the end)
- Score: same formula (10 + streak bonus)
- Uses smart word order from progress system
- Each word uses one random sentence from its sentences array

**Simplifications:**
- Strip punctuation for matching (case-insensitive), display with proper punctuation
- Words that appear multiple times in sentence: allow any instance

### 2. Hangman

**What:** Classic word guessing. Show emoji hint, blank spaces for letters, tap alphabet letters to guess.

**Flow:** Categories > Playing > Results

**Mechanics:**
- Show emoji as the hint
- Display `_ _ _ _` blanks for the word
- Show A-Z letter grid at bottom
- Correct letter: reveal all instances in the word, letter turns green
- Wrong letter: letter turns red/disabled, lose a life (max 6 lives)
- Visual: simple stick figure drawing that progresses with wrong guesses (head, body, left arm, right arm, left leg, right leg)
- Win: all letters revealed before 6 wrong guesses
- Lose: word revealed, show correct answer
- Score: 10 points per word won + streak bonus, 0 for lost words
- After correct/wrong: TTS speaks the word, show sentences

## Gamification System

### Daily Streak

**Storage key:** `daily-streak`
**Data:**
```ts
{ currentStreak: number, lastPlayDate: string (YYYY-MM-DD), longestStreak: number }
```
**Logic:**
- On any game completion (reaching results screen), check date
- Same day: no change
- Yesterday: increment streak
- Older: reset to 1
- Display on main menu as a flame badge with count

### XP + Levels

**Storage key:** `gamification`
**Data:**
```ts
{ totalXP: number, achievements: string[] }
```
**XP sources:** Every point scored in any game adds to totalXP
**Level thresholds:** 0=Beginner, 100=Explorer, 300=Learner, 600=Scholar, 1000=Champion, 2000=Master, 5000=Legend
**Display:** Level badge + XP progress bar on main menu

### Achievements

Unlockable milestones stored as string IDs in gamification data:

| ID | Name | Condition |
|----|------|-----------|
| first-game | First Steps | Complete any game |
| streak-3 | On Fire | 3-day streak |
| streak-7 | Week Warrior | 7-day streak |
| streak-30 | Monthly Master | 30-day streak |
| score-100 | Century | Reach 100 total XP |
| score-1000 | Grand | Reach 1000 total XP |
| perfect-spelling | Perfect Speller | Score 100% in Spelling Bee |
| perfect-listen | Sharp Ears | Score 100% in Listen & Pick |
| all-categories | Explorer | Play all categories |
| master-category | Category Master | Learn all words in any category |

**Display:** Achievement badges shown on main menu in a collapsible section. New achievements trigger a brief toast/animation.

## Assumptions

- **Sentence Builder validation**: Chose word-by-word validation (can only place the next correct word) over full-sentence validation at the end. Simpler for young kids - immediate feedback prevents frustration.
- **Hangman lives**: Chose 6 lives (standard hangman) over easier/harder variants. 6 is classic and gives enough room for kids to learn.
- **XP = score**: Chose to make XP equal to game score rather than a separate currency. Simpler mental model for kids.
- **No coins/shop**: Skipped virtual currency/shop system. Adds complexity without clear educational benefit for this age group.
- **Achievements on menu**: Chose to show on main menu rather than a separate profile page. Kids ages 7-8 benefit from seeing rewards immediately.
