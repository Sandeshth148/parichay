# Local Testing Guide

## Two-player testing on one machine

The easiest way to test the full two-player flow locally is to open the app in **two different browser windows/profiles** so each has its own Firebase session.

### Setup

1. Start the dev server:

   ```
   cd frontend
   npm run dev
   ```

   App runs at `http://localhost:5173`

2. Open **Window A** in your normal Chrome profile.
3. Open **Window B** in an **Incognito window** (Ctrl+Shift+N) — this gives it a separate cookie/auth session.

---

## Create two demo Firebase accounts

Do this once from the Firebase console or from the app's own sign-up flow.

| Account          | Email                 | Password    |
| ---------------- | --------------------- | ----------- |
| Player 1 (Host)  | `demo1@parichay.test` | `Demo1234!` |
| Player 2 (Guest) | `demo2@parichay.test` | `Demo1234!` |

> **Note:** Firebase Auth rejects non-email domains for email/password sign-in on some projects.  
> If `@parichay.test` doesn't work, use `sandeshth148+demo1@gmail.com` / `sandeshth148+demo2@gmail.com` — both deliver to your Gmail inbox via the `+` alias trick.

---

## Step-by-step test flow

### Window A (Player 1)

1. Sign in as `demo1`.
2. Click **Create Room** → a 6-character room code appears on screen (e.g. `ABC123`).
3. Copy the room code.

### Window B (Player 2)

1. Sign in as `demo2`.
2. Click **Join Room** → paste `ABC123` → press Join.

### Back to Window A

- The waiting screen should immediately change to the game board.
- Both windows now show the same room in real time.

---

## What to test

| Scenario                                     | How                                                                                                                      |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Card flip only works on active player's turn | Click a card in Window B when it's Player 1's turn — card should not flip                                                |
| Discussed card visible to both players       | Window A marks a card Discussed → Window B should show it flipped green                                                  |
| Skip works                                   | Skip a card → it appears orange on both sides                                                                            |
| Level complete banner                        | Discuss/skip all 16 cards → inline banner appears, cards still visible                                                   |
| Level advance                                | Click "Next Level" in Window A → both windows jump to Level 2                                                            |
| Per-level progress preserved                 | Go to Level 2, flip some cards, go back to Level 1 → Level 1 cards still in same state                                   |
| Room history on Dashboard                    | After creating rooms, sign out and back in → "Resume" section shows previous rooms                                       |
| 404 on refresh                               | Navigate to a room URL and hit F5 → should load correctly (production/Vercel only; Vite dev server handles this locally) |

---

## Routing note (local vs production)

- **Locally:** Vite's dev server handles client-side routing automatically — no 404s.
- **Production (Vercel):** `frontend/vercel.json` contains the SPA rewrite rule that fixes 404s on refresh.

---

## Quick reset between test runs

To start fresh without creating a new room, you can delete the test room document directly in Firebase Console:

`Firestore → rooms → [room-id] → Delete document`

Or just create a new room from the Dashboard — old rooms show up in the "Resume" section.
