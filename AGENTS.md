This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Related projects

This app is one of several separate repos (each with its own git history) that make up the Flot Boutique / buyFromUs system. They live next to this one on the dev machine; read them to confirm a contract, but only edit them when the task clearly involves them.

| Project | Path | Role |
|---|---|---|
| **API** (`buyFromUs`) | `~/Desktop/buyFromUs` | Symfony + API Platform backend: catalog, orders, auth. Its own `AGENTS.md` is the reference. |
| **Storefront** (`buyFrom`) | `~/Desktop/buyFrom` | Customer web app (Next.js): products, checkout, order tracking, receipts. |
| **Admin** (`FAdmin`) | `~/Desktop/FAdmin` | Admin dashboard (Next.js): catalog, pricing/markup, categories. |
| **Scrapper** | `~/Desktop/scrapper` | Microservice that scrapes retailer product pages. Reached by the API through RabbitMQ only; the app never calls it. |

### Backend contract

- The app talks to the API through `EXPO_PUBLIC_API_URL` (`src/config.ts`, `src/api/client.ts`). Never print or commit `.env.local` values.
- Before adding or changing an API call, read the matching controller in `~/Desktop/buyFromUs/src/Controller` to confirm the route, method, payload and response shape. Don't guess them.
- Mobile auth uses `/api/mobile/auth/*` (`MobileAppAuthController`): `login`, `register`, `2fa/verify`, `2fa/resend`, `refresh`, `logout`, `google`. Tokens travel in the JSON body, not cookies. The refresh token is rotated on every refresh and kept in `expo-secure-store` (`src/auth/refresh-token-store.ts`). These routes are public: never send an `Authorization` header to them (`src/api/client.ts` strips it). Password reset is handled on the web.
- Backend changes are made in that repo, not this one. If a task needs a new or changed endpoint, say so and make the change there only when asked.
