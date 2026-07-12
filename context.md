# SentinelPay AI Fintech Prototype Development: Handover Context

This document outlines the current architecture, design choices, micro-interaction features, and key source code paths for the **SentinelPay AI Fintech Prototype** application.

---

## 🎨 Visual System & Theme

We have established a unified, high-contrast yet comfortable dark-light hybrid presentation language across the application:
1. **Warm Light Base Background**: The top section of each page is rendered on a light warm pinkish-ivory canvas (`#fff8f5`).
2. **Soft Charcoal Lower Sheet**: Everything below the top dashboard/headers is wrapped in a full-bleed rounded slate-charcoal container (`#1c1c1e`) with a `borderTopLeftRadius: 36` and `borderTopRightRadius: 36`.
3. **Muted Contrast Inset Cards**: To prevent eye strain, cards inside the dark charcoal bottom sections are styled as warm off-white/ivory rectangles (`#f7f6f2`), providing clear, flat legibility without high-contrast neon-white glare.
4. **Zero Light Bleeds**: Subpixel rounding gaps at the bottom of the screens are sealed by pushing the black container slightly under the bottom tab bar boundaries using `marginBottom: -20` and extending `paddingBottom` to `100`.
5. **No Emojis**: All generic emojis have been replaced by flat, clean SVG path vector graphics.

---

## 🧭 Navigation & Headroom Layouts

* **`AppNavigator.tsx`**: Sets the default Stack Navigator card background transitions to match the warm ivory theme (`#fff8f5`).
* **`MainTabNavigator.tsx`**: 
  * Tab bar is a fully custom `CustomTabBar` component. Height: `84px` (iOS) / `74px` (Android).
  * **Horizontal Sliding Bubble**: A single absolute `SlidingBubble` component (lime green `#bef264`, `48×48px` circle) slides horizontally via `translateX` spring to the active tab's center. It uses a subtle squash-stretch (`scaleX 1.2 → 1`, `scaleY 0.84 → 1`) during travel.
  * **Icon Bounce**: Each icon is wrapped in a `TabIcon` component that fires a three-step spring sequence on focus (`0.85 → 1.05 → 1`) with a small upward nudge (`translateY -2px`).
  * **Color System**: Active icon shifts to charcoal `#1c1c1e` to contrast against the lime bubble. Active label turns lime `#bef264`. Inactive icon is muted `#9ca3af`.
  * **Clean Layout**: Each tab button uses a simple flex-column layout (`iconZone` of `48×48px` + `label` below). No broken absolute positioning — bubble sits in `position: absolute` at the tabBar root level with `top: 4`.


---

## ✨ Micro-Interactions & Gimmicks

We have implemented several premium details to make the application feel alive and responsive:

### 1. Focus-Triggered Staggered Animations
Each screen's root `ScrollView` is keyed to React Navigation's `useIsFocused` hook (`key={isFocused ? 'active' : 'inactive'}`). 
* When the user taps between bottom navigation tabs, the screen completely remounts and replays all entering layout animations.
* The lower charcoal sheets rise with a slow, heavy iOS-style spring (`SlideInDown.springify().damping(17).stiffness(50).mass(1.2)`).
* All internal components (cards, text, buttons) fade in and slide up sequentially from top to bottom using staggered delay intervals (`100ms` to `600ms`) with an `800ms` duration.

### 2. Available Balance Privacy Toggle (`DashboardScreen.tsx`)
* Tapping the Available Balance card toggles its visibility state.
* Smoothly transitions the balance display between the actual amount (`₹1,12,340.00`) and a private mask (`₹ ••••••••`), showing a dynamic eye icon (`👁️` / `👁️‍🗨️`).

### 3. Active System Integrity Monitor Pulse (`DashboardScreen.tsx`)
* The **System Integrity** grid card contains a Reanimated looping status dot.
* The dot dynamically glows/pulses green (`#22c55e`) when the device environment score is safe ($\ge 80$), shifting to amber/orange (`#f97316`) when overrides (root/jailbreak) are enabled.

### 4. Interactive Cybersecurity Terminal Console (`SecurityCenterScreen.tsx`)
* Tapping **Run System Integrity Audit** triggers a scanning sequence.
* Displays a green monospace diagnostic feed (`📡`) cycling through staggered logs:
  1. *Initializing security environment diagnostics...*
  2. *Auditing local kernel hashes & binary integrity...*
  3. *Scanning network ports for active VPN masking tunnels...*
  4. *Sweeping package namespaces for screen overlay hijacks...*
* Upon calculation completion, the custom feed clears and triggers the audit report.

### 5. Live Threat Ticker Feed (`AnalyticsScreen.tsx`)
* A monospace text console ticker cycles through live explainable AI warnings, network hop logs, and TLS routing signature validations every 3.5 seconds.

### 6. Two-Stage Cascading Threat Graph (`AnalyticsScreen.tsx`)
* **SVG Keypad Nodes Center**: Centered the graph Svg (`width="340"` with `alignSelf: 'center'`) to make the network diagram perfectly balanced inside the dark container. Node labels are increased to `fontSize="12"` and bolded.
* **Cascading Packets**: Data packets (lime green circles) flow sequentially:
  * *Phase 1 (Progress $0.0 \to 0.5$)*: Packets travel from `Your Profile` to the two middle nodes, then disappear.
  * *Phase 2 (Progress $0.5 \to 1.0$)*: Packets spawn at the middle nodes and travel down to the bottom nodes.
* **Red-Shift Pathway Contagion**:
  * During Phase 2, the left-hand packet (active threat route) turns **warning red** (`#ef4444`) while the right packet remains green.
  * Simultaneously, the middle-left node (`Intermediary A`) dynamically switches its fill color to **red** while the warning packet is passing through, simulating threat transmission.

---

## 🛠️ Verification Status

* All code edits have been compiled and verified type-safe via `npx tsc --noEmit` with zero errors.
* The metro bundler and Python Flask backend are running cleanly.
