# CLAUDE.md — Party Game Mobile Client

> ⚠️ Keep this file up to date. If you add new screens, change folder structure, rename conventions, or introduce new libraries, update the relevant section of this file before or immediately after making the change.

---

## Project Overview

A React Native (Expo) mobile client for a real-time multiplayer party game. Players create or join rooms, take turns asking questions, submit answers, and match answers to participants. All user persistence is handled via AsyncStorage on-device. Real-time communication is handled via Socket.io connecting to a separate backend repository.

---

## Tech Stack

- **Framework:** Expo (managed workflow)
- **Language:** TypeScript
- **State Management:** Zustand
- **Persistence:** AsyncStorage
- **Networking:** socket.io-client
- **Navigation:** Expo Router (file-based routing inside `/app`)

---

## Repository Scope

This repository contains **only the mobile client**. The Socket.io backend lives in a separate repository. The server URL is configured via environment variable.

```
EXPO_PUBLIC_SERVER_URL=http://localhost:3001
```

Set this in a `.env` file at the project root.

---

## Project Structure

```
/
├── app/                        ← Expo Router entry point & route files
│   └── ...                     ← Route files managed by Expo Router
├── screens/                    ← Full-page screen components (PascalCase)
│   ├── Welcome.tsx
│   ├── CreateRoom.tsx
│   ├── HostLobby.tsx
│   ├── GuestLobby.tsx
│   ├── AskPhase.tsx
│   ├── AnswerPhase.tsx
│   ├── MatchingPhase.tsx
│   ├── RoundLeaderboard.tsx
│   └── FinalResults.tsx
├── components/                 ← Reusable UI components (PascalCase)
├── hooks/                      ← Custom React hooks (camelCase, 'use' prefix)
├── utils/
│   ├── helpers.ts              ← Pure helper/utility functions
│   ├── callbacks.ts            ← Reusable callback functions
│   ├── constants.ts            ← App-wide constants (colors, dimensions, etc.)
│   ├── types.ts                ← All TypeScript type declarations
│   └── interfaces.ts           ← All TypeScript interface declarations
├── store/                      ← Zustand stores
├── assets/                     ← Images, fonts, icons
├── .env                        ← Environment variables (not committed)
└── CLAUDE.md                   ← This file
```

> `screens/`, `components/`, `hooks/`, and `utils/` all live at the **same level** as the `app/` folder.

---

## Screens

| #   | File                           | Description                                                                    |
| --- | ------------------------------ | ------------------------------------------------------------------------------ |
| 01  | `screens/Welcome.tsx`          | Entry screen — username input, create or join room options                     |
| 02  | `screens/CreateRoom.tsx`       | Host sets minimum capacity (3–10) and game settings                            |
| 03  | `screens/HostLobby.tsx`        | Host waits for players; sees player list; can start game once min capacity met |
| 04  | `screens/GuestLobby.tsx`       | Guest enters room ID, waits for host to start                                  |
| 05  | `screens/AskPhase.tsx`         | Current round's asker submits a question (30s default)                         |
| 06  | `screens/AnswerPhase.tsx`      | All other players submit answers (30s default)                                 |
| 07  | `screens/MatchingPhase.tsx`    | Each player drags/assigns shuffled answers to participant names                |
| 08  | `screens/RoundLeaderboard.tsx` | Scores revealed after each round; shows correct matches                        |
| 09  | `screens/FinalResults.tsx`     | Final leaderboard after all rounds complete                                    |

---

## Responsiveness

The app should look good in all mobile devices. Styling of app should be adjusted accordingly.

---

## File & Naming Conventions

| Type               | Convention                               | Location                  |
| ------------------ | ---------------------------------------- | ------------------------- |
| Screens            | `PascalCase.tsx`                         | `/screens`                |
| Components         | `PascalCase.tsx`                         | `/components`             |
| Hooks              | `useCamelCase.ts`                        | `/hooks`                  |
| Helper functions   | named exports                            | `/utils/helpers.ts`       |
| Callback functions | named exports                            | `/utils/callbacks.ts`     |
| Constants          | named exports (UPPER_SNAKE or camelCase) | `/utils/constants.ts`     |
| Type declarations  | named exports (`type`)                   | `/utils/types.ts`         |
| Interfaces         | named exports (`interface`)              | `/utils/interfaces.ts`    |
| Zustand stores     | `useCamelCaseStore.ts`                   | `/store`                  |

### Import Rules

Always use the `@/` alias when importing from project modules:

```ts
import … from '@/utils/helpers'
import … from '@/utils/interfaces'
import … from '@/utils/callbacks'
import … from '@/utils/types'
import … from '@/utils/constants'
import … from '@/screens'
import … from '@/store'
import … from '@/components'
import … from '@/hooks'
```

---

## State Management (Zustand Stores)

- `useUserStore` — username, game history (persisted via AsyncStorage)
- `useRoomStore` — roomId, players[], hostId, game settings
- `useGameStore` — current phase, round number, question, answers, matches, scores

---

## Socket Events

### Client → Server

| Event             | Payload                                       |
| ----------------- | --------------------------------------------- |
| `create_room`     | `{ username, minCapacity }`                   |
| `join_room`       | `{ roomId, username }`                        |
| `start_game`      | `{ roomId, settings }`                        |
| `submit_question` | `{ roomId, question }`                        |
| `submit_answer`   | `{ roomId, answer }`                          |
| `submit_matches`  | `{ roomId, matches: { answerId: playerId } }` |

### Server → Client

| Event               | Payload                                            |
| ------------------- | -------------------------------------------------- |
| `room_created`      | `{ roomId, hostId }`                               |
| `player_joined`     | `{ players[] }`                                    |
| `player_left`       | `{ players[] }`                                    |
| `game_started`      | `{ settings, rounds }`                             |
| `phase_changed`     | `{ phase, timeLeft, roundNumber, askerIndex }`     |
| `answers_collected` | `{ answers: [{ id, text }] }` — shuffled, no names |
| `round_results`     | `{ correctMatches, scores }`                       |
| `game_over`         | `{ finalScores }`                                  |

---

## Game Rules (Client Must Enforce in UI)

- Room minimum capacity: **3**, maximum: **10**
- Number of rounds = number of participants (or a host-chosen multiple)
- Round duration: configurable by host, default **30 seconds**
- Timers are **server-authoritative** — never start a timer on the client independently
- Answers are sent **shuffled and anonymous** to the matching phase

---

## Key Patterns

- Always use the `useSocket` hook (`/hooks/useSocket.ts`) for all socket interactions — never use raw socket instances directly in components
- All timer countdowns are driven by `timeLeft` values received from the server via `phase_changed` events
- AsyncStorage keys: `@user:profile`, `@user:gameHistory`
- Do not store room or game state in AsyncStorage — it is ephemeral per session

---

## Running the App

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone. Make sure your phone and computer are on the same Wi-Fi network.

Set `EXPO_PUBLIC_SERVER_URL` in `.env` to point to your running backend server.

---

## What NOT to Do

- Do not add any authentication or authorization logic
- Do not use a database (SQLite, Firebase, Supabase, etc.) — AsyncStorage only
- Do not start timers on the client — trust server-sent `timeLeft` values
- Do not commit `.env` to version control
- Do not place screen components inside the `/app` folder — screens live in `/screens`, and `/app` only contains Expo Router route files that import from `/screens`

---

## Updating This File

Update `CLAUDE.md` whenever any of the following change:

- A screen is added, removed, or renamed
- A new folder or file convention is introduced
- A new library or major dependency is added
- Socket event names or payloads change
- Game rules or phase logic changes
- Environment variable names change
- The folder structure is reorganized
