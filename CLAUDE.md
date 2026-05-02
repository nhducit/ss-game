<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

## Game UX requirements

**Speaker button** — every game screen that shows a prompt, title, question,
or piece of content the child has to read MUST include a tappable speaker
button that speaks the title + question aloud (and, when relevant, the
concrete expression / word / sentence being asked about).

- Use `speak()` from `src/games/english/speak.ts` as the TTS primitive.
- Logic games use `<Speaker>` from `src/games/logic/Speaker.tsx`; other
  domains may inline the `Volume2` icon pattern used by Spelling Bee.
- Place the speaker next to the prompt so the connection is obvious.
- Kids may not read yet — audio is how they understand the task.

**Manual Next** — games MUST NOT auto-advance to the next question / word /
round. After a win, loss, or any answer reveal, the kid taps a visible
"Next" button to move on. Applies to every existing and new game.

- No `setTimeout(advanceWord, …)` or equivalent useEffect that fires the
  next item without a tap.
- Skip / Submit / Next buttons are the only ways forward (plus an explicit
  end-of-round transition to the results screen, which itself has buttons).
- Why: kids need to read the example sentences, hear the TTS finish, and
  process the result at their own pace. Auto-advance steals that time.

## Workflow

**Auto commit & push** — after finishing a coherent change the user has
accepted, automatically commit and push to `main` without waiting for an
explicit instruction.

- Run `pnpm typecheck` (TypeScript 7 native preview, `tsgo -b`) and confirm
  zero errors before staging. Do not commit if typecheck fails — fix the
  errors first.
- Run `pnpm lint` (oxlint) and `pnpm format:check` (oxfmt --check). Treat
  errors as blocking; warnings are fine. Run `pnpm format` to fix style.
- Stage only the files you actually touched (no `git add -A`).
- Write a focused commit message describing the why, not the what.
- `git pull --rebase` before pushing if the remote has moved on.
- Use `pnpm` for all package operations — never `npm` or `yarn`.
- Skip the commit only if the user explicitly says "don't commit" or the
  change is purely exploratory / WIP.
