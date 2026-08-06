# MindProtocol

A daily 15-minute mental-reset journaling app for college students and early-career professionals. Guided AI-powered sessions help users check in with themselves, name what they’re feeling, and leave with a small positive shift.

**1st Runner-Up at HackFusion 2026.**  
Designed with trauma-informed UX principles. Private by default — all data stays on device.

---

## Features

- **Guided Daily Sessions** — Structured 5-step flow:
  1) pre-session sliders  
  2) diagnostic conversation  
  3) journaling prompts  
  4) post-session sliders  
  5) reflection
- **AI-Powered Prompts** — Groq-hosted LLM generates personalized journaling prompts from in-session responses.
- **Crisis Detection** — Dual-layer safety:
  - local keyword matching
  - LLM-based SAFE/CRISIS classifier
- **Voice Input** — Speech-to-text via Web Speech API (web) and `@react-native-voice/voice` (native).
- **Ambient Audio** — Bundled lo-fi tracks with play/pause toggle during journaling.
- **Insights Dashboard** — Daily, weekly, monthly trends with streak tracking.
- **Cross-Platform** — iOS, Android, and Web via Expo.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo ~57, React Native 0.86, React 19 |
| Language | TypeScript 6.0 |
| Routing | Expo Router (file-based) |
| State Management | Zustand |
| Storage | `expo-sqlite` (native), `localStorage` (web) |
| AI | Groq API (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`) |
| HTTP Client | Axios |
| Audio | expo-av |
| Voice | `@react-native-voice/voice`, Web Speech API |
| Notifications | expo-notifications (local daily reminders) |
| Animations | react-native-reanimated, react-native-gesture-handler |

---

## Project Structure

```bash
MindProtocol/
├── app/
│   ├── constants/
│   │   ├── theme.ts
│   │   └── systemPrompt.ts
│   ├── data/
│   │   └── therapists.ts
│   ├── lib/
│   │   ├── db.ts
│   │   ├── db.native.ts
│   │   ├── db.web.ts
│   │   ├── groq.ts
│   │   ├── notifications.ts
│   │   └── useVoiceInput.ts
│   ├── stores/
│   │   ├── userStore.ts
│   │   └── sessionStore.ts
│   └── app/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── onboarding.tsx
│       ├── session-time.tsx
│       ├── crisis.tsx
│       └── (tabs)/
│           ├── index.tsx
│           ├── session.tsx
│           └── dashboard.tsx
├── logo/
├── audio/
└── uidessign.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- For iOS: Xcode + CocoaPods
- For Android: Android Studio + SDK
- For Web voice input: Chrome or Edge recommended

### Installation

```bash
git clone https://github.com/altafKhan-nep/Mind-Protocol.git
cd Mind-Protocol/app
npm install
```

### Environment Variables

Create `app/.env`:

```env
EXPO_PUBLIC_GROQ_API_KEY=gsk_your_key_here
```

Get your key from: [https://console.groq.com](https://console.groq.com)

### Run the App

```bash
# from app/ directory
npm start
npm run ios
npm run android
npm run web
```

---

## How It Works

### Session Flow

1. **Pre-Session Sliders**  
   User rates mood, mental noise, focus, and energy (0–100).

2. **Diagnostic Conversation**  
   User answers progressive deepening questions with AI follow-ups.

3. **Journaling**  
   User writes through 3 prompts:
   - Externalize
   - Name
   - Reframe

4. **Post-Session Sliders**  
   User re-rates the same metrics.

5. **Completion**  
   App displays emotional shift + concise AI reflection.

---

## AI Architecture

| Prompt Type | Model | Purpose |
|---|---|---|
| Journaling Prompts | `llama-3.3-70b-versatile` | Generate 3 progressive prompts |
| Crisis Check | `llama-3.1-8b-instant` | Binary SAFE/CRISIS classification |
| Follow-up Questions | `llama-3.1-8b-instant` | Adaptive diagnostic deepening |
| Session Reflection | `llama-3.1-8b-instant` | Post-session summary |

---

## Safety & Privacy

- Local keyword detection for self-harm/hopelessness/violence signals
- LLM classifier for ambiguous distress language
- Crisis support screen with Nepal-specific hotlines and therapist directory
- No social comparison, no streak pressure copy, no guilt mechanisms
- **Data remains on device** (`SQLite` native / `localStorage` web)
- AI requests are stateless and scoped to current interaction only

---

## Design Principles

- **Trauma-informed UX** — gentle, non-judgmental interaction design
- **One action per screen** — reduced cognitive load
- **WCAG 2.2 AA aligned** — contrast, tap targets, accessibility support
- **Calming visual system** — desaturated palette with restrained accents

---

## License

MIT — see [app/LICENSE](app/LICENSE)

---

## Author
**Hack Fusion Project Made My team** 
**Altaf Khan**  
**Sujan Dhakal**  
**Danish Ekbal Ahmad**  
**Ujjwal Pyakhurel**  
