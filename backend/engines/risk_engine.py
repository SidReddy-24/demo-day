from mock.database import MockDatabase

class RiskEngine:
    @staticmethod
    def evaluate_transaction(amount: float, recipient_upi: str, active_call: bool = False, safe_mode: bool = False) -> dict:
        upi_clean = recipient_upi.lower().strip()

        # Feature Scoring Weights (Simulating a simple tree classifier output)
        base_score = 10.0
        factors = []
        timeline = [
            { "time": "02:01", "event": "Device session verified clean", "type": "SECURITY" },
            { "time": "02:10", "event": "Normal keyboard typing rhythm behavior logged", "type": "BIOMETRIC" }
        ]

        scam_type = "None"
        risk_level = "LOW"

        # Check 1: Recipient Verification (Blacklist)
        recipient_blacklisted = MockDatabase.is_blacklisted(upi_clean) or 'scam' in upi_clean
        if recipient_blacklisted:
            base_score += 55.0
            factors.append("Recipient matches local threat database (Community-flagged)")
            timeline.append({ "time": "02:11", "event": "Recipient UPI matched with threat database", "type": "SECURITY" })
        else:
            timeline.append({ "time": "02:11", "event": "Recipient UPI cleared reputation checks", "type": "SECURITY" })

        # Check 2: Active phone call context (Social Engineering marker)
        if active_call:
            base_score += 40.0
            factors.append("Payment initiated during active voice call (Social Engineering vector)")
            timeline.append({ "time": "02:12", "event": "Active call correlation flagged by telephony listener", "type": "CALL" })
            scam_type = "Digital Arrest / Impersonation Scam"
        
        # Check 3: Large amount threshold
        if amount >= 10000.0:
            base_score += 20.0
            factors.append("Transaction amount exceeds standard user deviation threshold")
            timeline.append({ "time": "02:13", "event": f"Transaction value ₹{amount} labeled as outlier", "type": "PAYMENT" })
            if scam_type == "None":
                scam_type = "High-Value Transfer Risk"
        elif amount >= 2000.0 and safe_mode:
            base_score += 15.0
            factors.append("Safe Mode active: Restriction on transfers ≥ ₹2,000 to new recipients")
            timeline.append({ "time": "02:13", "event": "Safe Mode restriction triggered for amount", "type": "SECURITY" })
            scam_type = "Safe Mode Protection Event"

        # Check 4: Dynamic target categories based on keyword mapping
        if recipient_blacklisted:
            if 'reward' in upi_clean or 'free' in upi_clean:
                scam_type = "Lottery / Fake Reward Scam"
            elif 'bill' in upi_clean or 'power' in upi_clean:
                scam_type = "Fake Utility Bill / Disconnection Scam"
            elif 'kyc' in upi_clean or 'bank' in upi_clean:
                scam_type = "Fake KYC Verification Scam"
            else:
                scam_type = "Investment / Task Scam"

        # Cap risk score
        risk_score = min(int(base_score), 99)

        # Categorize threat thresholds
        if risk_score >= 80:
            risk_level = "HIGH"
        elif risk_score >= 50:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
            factors = [
                "Transaction size falls within normal bounds",
                "Recipient UPI shows high trust score across the network",
                "Device signature matches registered profile"
            ]

        # Ensure timeline always has a final action
        timeline.append({ "time": "02:14", "event": f"Risk assessment finalized with score: {risk_score}", "type": "SECURITY" })

        # Calculate mock confidence interval
        confidence = 90.0 + (risk_score % 10) * 0.98

        return {
            "riskScore": risk_score,
            "riskLevel": risk_level,
            "confidence": round(confidence, 1),
            "scamType": scam_type,
            "explanation": factors,
            "timeline": timeline
        }

