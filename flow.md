# SentinelPay AI - Interactive Demonstration Guide

This guide outlines the complete user demonstration flows available in **SentinelPay AI (MVP 1.0)**. Use these flows to showcase the application's secure UPI prevention layers, dynamic risk calculators, and machine learning visualization dashboards.

---

## 🚀 Flow 1: Secure Onboarding & Environment Audits
* **Goal**: Demonstrate how the application sweeps system environments for active threats before unlocking the payment dashboard.
* **Steps**:
  1. Open the application. You are greeted by the **Splash Screen** displaying the hackathon disclaimer.
  2. Tap **Get Started** -> Navigates to the **Onboarding Carousel**.
  3. Swiping to the end opens the **Welcome Screen** prompting you to login or register.
  4. Tap **Sign In** -> Enter any email and password ($\ge$ 6 characters) -> Tap **Sign In**.
  5. The application initiates the **Accessibility Scan** and **Integrity Sweeper** to audit for screen overlays or jailbroken device configurations.
  6. Tap **Continue** -> Complete the **Biometrics Setup** and choose a **Passcode PIN** using the custom keypad.
  7. **Result**: Your environment status is saved to Zustand state, and the main **Dashboard** is unlocked.

---

## 💸 Flow 2: Low-Risk Payment Flow (Bypass Verification)
* **Goal**: Demonstrate a normal, friction-free transaction to a verified payee.
* **Steps**:
  1. From the Dashboard, tap **Send Money**.
  2. Under *Recent Profiles*, select **Rohit Sharma** (flagged with a green `LOW` risk badge).
  3. Enter any standard amount (e.g., `₹500`) using the custom keypad and tap **Proceed**.
  4. Review the details (Funding Source: *HDFC Bank Simulator*) and tap **Verify & Execute**.
  5. The **Sentinel AI scan** animates, scanning system tunnels and querying the backend risk engine.
  6. **Result**: Since the target payee is verified and the transaction size is normal, the system skips all overrides and lands directly on **Payment Success**.

---

## ⚠️ Flow 3: Medium-Risk Payment Flow (Biometric Override)
* **Goal**: Demonstrate how the AI risk engine intercepts high-value outliers and prompts explainable AI warning overlays.
* **Steps**:
  1. From the Dashboard, tap **Send Money**.
  2. Select **Rohit Sharma** (`rohit45@okaxis`).
  3. Enter a high-value amount (e.g., `₹15,000`) and tap **Proceed**.
  4. Confirm the transaction details and tap **Verify & Execute**.
  5. The AI scans transaction outliers and flags the value as unusual.
  6. **Result**: Lands on the **Orange Security Alert** page. It displays three threat score details (e.g., "Unusually high value transfer"). Tap **Override with Biometrics** -> Confirm the popup check -> Lands on **Payment Success**.

---

## 🚫 Flow 4: High-Risk Payment Flow (Automatic Block)
* **Goal**: Demonstrate how the system completely blockades utility scam vectors.
* **Steps**:
  1. From the Dashboard, tap **Send Money**.
  2. Under *Recent Profiles*, select **Electricity Board Support** (flagged with a red `HIGH` risk badge).
  3. Enter any amount (e.g., `₹4,250`) and tap **Proceed**.
  4. Tap **Verify & Execute** on the checkout card.
  5. **Result**: The AI engine intercepts the blacklist node and redirects to the **Crimson Block Overlay**. The transaction button is disabled, explainable parameters are shown, and the user is provided with options to **Cancel & Report Scammer**.

---

## 🔍 Flow 5: QR Scanner & Threat Scoring
* **Goal**: Scan simulated QR codes and analyze risk score calculations.
* **Steps**:
  1. From the Dashboard, tap **Scan QR**.
  2. Tap the emulator control **Scan Scam QR (Electricity Board)**.
  3. **Result**: Opens the **Scan Analysis** sheet. It displays the payee target, calculates a **96/100 threat score**, and prints security warnings. Tapping "Report Merchant" redirects to the reporting dashboard.

---

## 🛡️ Flow 6: Device Vulnerability Override Loops
* **Goal**: Demonstrate the dynamic feedback loops between device compliance configurations and dashboard safety alerts.
* **Steps**:
  1. Go to the **Security** tab. Tap **Run System Integrity Audit** -> Displays **98% (Optimal)**.
  2. Toggle **Simulate Root / Jailbreak** to *Active*.
  3. Tap **Run System Integrity Audit** -> Recalculates and displays **58% (Warning)**.
  4. Return to the **Home** tab -> Note that the dashboard dial updates to warn you that your device environment is vulnerable.

---

## 🕸️ Flow 7: Dynamic Scammer Reporting & NetworkX Graphing
* **Goal**: Report a custom scammer, refresh the community database, and examine transaction paths to cash-out mule nodes.
* **Steps**:
  1. Go to the **Community** tab -> Tap **Report Fraud Merchant**.
  2. Input a custom address (e.g., `scam.refund@ybl`), select a category, tap **Upload Proof Screenshot**, and tap **Submit**.
  3. Pull-to-refresh the **Ecosystem Reports** feed -> The newly reported target appears at the top.
  4. Go to the **Analytics** tab -> The **NetworkX visualizer** maps your profile nodes, warning intermediaries, and malicious cash-out blocks.
  5. Go to **Send Money** -> Input the custom address `scam.refund@ybl` -> Press **Verify** -> Triggers the **High Risk** warning overlay because the target is now dynamically blacklisted.

---

## 🚨 Flow 8: Panic Button Suspension Loop
* **Goal**: Demonstrate how users can instantly freeze accounts and halt payment routing in an emergency.
* **Steps**:
  1. From the Dashboard header, tap the red **🚨 FREEZE** button.
  2. **Result**: Triggers a notification popup warning that all active UPI handles are frozen, emergency bank protocols are engaged, and the terminal has suspended outgoing transactions.
