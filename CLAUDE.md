# CLAUDE.md

@AGENTS.md

`AGENTS.md` (imported above) is the source of truth for the stack, commands and conventions. Keep shared project facts there and put only Claude-specific guidance in this file.

## Claude Code notes

- The API is `~/Desktop/buyFromUs` (Symfony), the web storefront is `~/Desktop/buyFrom` and the admin is `~/Desktop/FAdmin`. See "Related projects" in `AGENTS.md`. They are separate git repos: a commit here never includes changes from them, and you should say so when you edit one.
- Read the relevant backend controller before wiring or changing an API call; don't assume payload or response shapes.
- Don't read, print or write values from `.env.local`.
- UI text is French. Reuse `colors` from `src/theme/colors.ts`, and keep screens split into small components under `src/view/<feature>/` with routes in `src/app/` only re-exporting them.
- Run `npx tsc --noEmit` and `npx expo lint` before saying a task is done. If a check can't be run, say so instead of reporting success.
- Commit only when asked. Branch is `dev`; `main` is the PR target.
