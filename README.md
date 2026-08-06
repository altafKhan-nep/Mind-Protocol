# MindProtocol (Mind-Protocol)

A calm, guided journaling app that helps students and early-career professionals do a short daily mental reset with structured check-ins, reflection prompts, and progress insights.

## Key Features

- Guided onboarding (age, gender, role, reminder setup)
- Daily reminder flow for consistent practice
- Pre-session check-in with sliders
- Structured journal-writing experience
- Home dashboard for session progress and trends
- Cross-platform app experience through Expo (iOS, Android, Web)

## App Flow (How It Works)

1. Complete onboarding (age, gender, role)
2. Set a preferred daily reminder time
3. Start a session from the home dashboard
4. Do a pre-session check-in using sliders
5. Write reflections in guided journal prompts
6. Repeat daily and track continuity in the dashboard

## Tech Stack

- **Language:** TypeScript
- **Framework:** React Native + Expo + Expo Router
- **State Management:** Zustand
- **Networking:** Axios
- **Storage/Data:** Expo SQLite (native)
- **Platforms:** iOS, Android, Web

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Expo-compatible device/simulator (Android Studio / Xcode optional)

### Install

```bash
git clone https://github.com/altafKhan-nep/Mind-Protocol.git
cd Mind-Protocol/app
npm install
```

### Run

```bash
# From /app
npm run start
npm run android
npm run ios
npm run web
```

If script names differ in your local copy, run:

```bash
npm run
```

...and use the scripts listed in `package.json`.

## Project Structure (High-Level)

```text
Mind-Protocol/
├── README.md
├── app/                     # Main Expo + React Native app
│   ├── app/                 # Route screens (Expo Router)
│   ├── assets/              # App icons and static assets
│   ├── constants/           # Theme and system constants
│   ├── data/                # Static app data
│   ├── lib/                 # Core services/utilities
│   ├── stores/              # Zustand state stores
│   └── package.json
├── audio/                   # Audio assets
└── logo/                    # Branding assets
```

## App Demo Screenshots

> **Note:** Screenshot files were not found in this repository at the paths below. Maintainers should place the images in `assets/screenshots/` using the exact filenames shown.

### 1) Onboarding – Age
<p align="center">
  <img src="assets/screenshots/01-age.png" width="260" alt="Onboarding – Age" />
</p>

### 2) Onboarding – Gender
<p align="center">
  <img src="assets/screenshots/02-gender.png" width="260" alt="Onboarding – Gender" />
</p>

### 3) Onboarding – Role
<p align="center">
  <img src="assets/screenshots/03-role.png" width="260" alt="Onboarding – Role" />
</p>

### 4) Reminder Time
<p align="center">
  <img src="assets/screenshots/04-reminder-time.png" width="260" alt="Reminder Time" />
</p>

### 5) Home Dashboard
<p align="center">
  <img src="assets/screenshots/05-home-dashboard.png" width="260" alt="Home Dashboard" />
</p>

### 6) Pre-session Check-in (sliders)
<p align="center">
  <img src="assets/screenshots/06-pre-session-checkin.png" width="260" alt="Pre-session Check-in (sliders)" />
</p>

### 7) Journal Writing Screen
<p align="center">
  <img src="assets/screenshots/07-journal-writing.png" width="260" alt="Journal Writing Screen" />
</p>

## Roadmap

- [ ] Improve onboarding personalization depth
- [ ] Expand journaling prompt variations
- [ ] Add export/share options for personal entries
- [ ] Add optional cloud backup with privacy controls
- [ ] Add richer dashboard analytics and trends

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Make focused changes
4. Run the available project scripts/tests
5. Open a pull request with a clear description

## License

This project is licensed under the MIT License. See [app/LICENSE](app/LICENSE).

## Contact / Support

For ideas, issues, or support requests, please open a GitHub issue in this repository.
