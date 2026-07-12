class MockDatabase:
    # Prefilled list of scam reports
    reports = [
        {
            "upiId": "claims.rewards@secure",
            "category": "Lottery / Rewards Fraud",
            "description": "Attempts to collect secure PIN inputs by offering fake scratch card bonuses.",
            "timestamp": "1 hour ago"
        },
        {
            "upiId": "billpay.board@apco",
            "category": "Fake Utility / Bill Scheme",
            "description": "Issues spoofed disconnection alerts requesting immediate payment overrides.",
            "timestamp": "Yesterday"
        }
    ]

    @classmethod
    def get_all_reports(cls) -> list:
        return cls.reports

    @classmethod
    def add_report(cls, upi_id: str, category: str, description: str) -> None:
        cls.reports.insert(0, {
            "upiId": upi_id,
            "category": category,
            "description": description or "Community-flagged threat behavior.",
            "timestamp": "Just now"
        })

    @classmethod
    def is_blacklisted(cls, upi_id: str) -> bool:
        upi_clean = upi_id.lower().strip()
        for r in cls.reports:
            if r["upiId"].lower().strip() == upi_clean:
                return True
        return False

    @classmethod
    def get_report_details(cls, upi_id: str) -> dict:
        upi_clean = upi_id.lower().strip()
        for r in cls.reports:
            if r["upiId"].lower().strip() == upi_clean:
                return r
        return {}
