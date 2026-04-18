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
