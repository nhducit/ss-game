# Spelling Bee (Đánh Vần) — English Learning Game

## Overview
A spelling game for Vietnamese children (ages 7-8) learning English. The browser speaks an English word using the Web Speech API, shows a Vietnamese hint, and the child taps scrambled letters to spell it correctly.

## Core Mechanics
1. **Listen**: Browser speaks an English word at slow speed (rate 0.7)
2. **See hint**: Vietnamese translation + emoji displayed
3. **Spell**: Tap scrambled letter tiles in the correct order
4. **Feedback**: Correct letter = green + slots into answer; wrong = shake animation
5. **Complete**: Word spelled correctly = celebration animation + points
6. **Next**: Auto-advance to next word after brief pause

## Features
- **Replay audio**: Tap speaker button to hear word again
- **Categories**: Animals, Colors, Food, Family, Body, Numbers
- **Category picker**: Start screen to choose a category
- **Score**: Points per word, streak bonus display
- **Progress**: Shows current word number / total in category
- **Skip**: Option to skip a word
- **Vietnamese hints**: Show Vietnamese translation to bridge understanding

## Word Data
Each word entry: `{ english, vietnamese, emoji }`

Categories (10-12 words each, 3-6 letters, age-appropriate):
- **Animals**: cat, dog, fish, bird, duck, frog, bear, lion, rabbit, monkey, tiger, elephant
- **Colors**: red, blue, green, pink, white, black, orange, purple, brown, yellow
- **Food**: rice, milk, egg, cake, apple, bread, water, juice, candy, banana
- **Family**: mom, dad, baby, sister, brother, grandma, grandpa, uncle, aunt
- **Body**: head, eye, ear, nose, mouth, hand, foot, leg, arm, hair
- **Numbers**: one, two, three, four, five, six, seven, eight, nine, ten

## Text-to-Speech
- Use `window.speechSynthesis` + `SpeechSynthesisUtterance`
- Language: `en-US`
- Rate: 0.7 (slow for kids)
- Require user interaction before first speak (button tap)
- Handle `voiceschanged` event for voice loading

## UI Layout
- **Nav bar**: Back button, category name, score badge, progress indicator
- **Main area**:
  - Emoji (large, centered)
  - Vietnamese hint text
  - Answer slots (empty boxes that fill as letters are tapped)
  - Speaker button (replay audio)
  - Scrambled letter tiles (shuffled)
- **Completion modal**: Score summary, option to replay category or pick new one

## Assumptions
- **Single player only**: No multiplayer needed for an educational tool
- **No persistent storage**: Scores reset on page reload (matches existing games)
- **Shuffled order**: Words within a category are shuffled each playthrough
- **Letter tiles include only the word's letters**: No extra distractor letters (age-appropriate simplicity)
- **Mobile-first**: Primary use case is on a phone/tablet
