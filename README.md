# SentinelPay AI 🛡️
> AI-Powered Secure UPI Demonstration Application (Version: MVP 1.0)

---

## ⚠️ Important Hackathon Disclaimer
This application is **strictly a hackathon/demo prototype**. 
* **NO** real UPI transactions occur.
* **NO** NPCI integrations or Bank APIs are connected.
* **NO** payment gateways are used.
* **All banking actions, security scores, fraud results, and dashboard metrics use realistic mock data generated via the Flask server and local fallback handlers.**

---

## 🎨 Design Philosophy (Apple + Revolut Minimalist)
* **Colors**: Pure Stark White backgrounds with a prominent Crimson Red brand accent (`#D32F2F`) and neutral grays.
* **Components**: Rounded cards, subtle soft shadows, custom inputs with focus state outlines, and action badges.
* **Micro-animations**: Scale-down bounce feedback on presses using React Native Reanimated.

---

## 🛠️ Technology Stack
### Frontend
* **Core**: React Native, Expo (SDK 57), TypeScript
* **Navigation**: React Navigation (Stack)
* **State Management**: Zustand with persistent `AsyncStorage` middleware
* **Networking**: Axios client with local mock engines
* **Styling & Motion**: React Native Reanimated, SVG, system typography scale

### Backend
* **Core**: Python Flask with CORS enabled
* **Analysis**: NetworkX, NumPy, Pandas, Scikit-Learn, Faker

---

## 📂 Project Structure
```
. (Workspace Root - Expo Project)
├── App.tsx             # App Bootstrap & Navigation Root
├── app.json            # Expo App Config
├── tsconfig.json       # TypeScript Config
├── src/                # Frontend Source Code
│   ├── assets/         # Screen assets and icons
│   ├── components/     # Reusable UI (Button, Card, Input, RiskBadge, Loading, ErrorScreen)
│   ├── navigation/     # App Navigation configuration & Stack registration
│   ├── screens/        # UI Screen files (Splash, Onboarding, Login, Permissions, PIN, etc.)
│   ├── services/       # Axios client with automated Mock API Engine fallback
│   ├── store/          # Persistent Zustand Store (useAuthStore)
│   ├── theme/          # Design system tokens (colors, typography, spacing, shadows)
│   └── types/          # Type declarations (Navigation typings)
└── backend/            # Python Flask Backend
    ├── run.py          # Flask entry point
    ├── api/            # API Route blueprints
    └── requirements.txt# Backend dependencies
```

---

## 🚀 Getting Started

### 📱 1. Running the React Native Application
Install frontend packages and start the Expo Bundler:
```bash
# Install packages
npm install

# Launch Expo Server
npm run start
```
From the Expo menu, you can press:
* `i` to launch the iOS Simulator
* `a` to launch the Android Emulator
* Scan the QR code using your mobile device running **Expo Go**

### 🐍 2. Running the Flask Backend
Install dependencies and launch the Flask server:
```bash
cd backend

# (Optional) Set up a virtual environment
python -m venv venv
source venv/bin/activate # On Windows use: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Start Server
python run.py
```
The server will run on `http://localhost:5000`. If the server is offline or unreachable, the React Native application will automatically fall back to its internal **Mock API Engine** to ensure a flawless demo experience.

---

## 🛡️ Implemented Workflows (Phase 1 & 2)
1. **Interactive Splash**: Auto-routes the user based on setup state.
2. **Disclaimer & Onboarding**: Multi-slide horizontal carousel outlining sandbox limits.
3. **Mock Auth**: Profile sign-up & log-in simulating API interaction.
4. **Interactive Permissions**: Explains the fraud monitoring benefit of granting SMS, Location, and Alerts.
5. **System Diagnostics**: Sweeps system characteristics to detect overlay apps, root binaries, developer ADB configurations, and VPN states.
6. **PIN & Biometrics**: Secure custom PIN keypad setup and FaceID enrollment simulations.
