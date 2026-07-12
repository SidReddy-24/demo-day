export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Permissions: undefined;
  Accessibility: undefined;
  BiometricSetup: undefined;
  PinSetup: undefined;
  DashboardStub: undefined;
  SendMoney: undefined;
  AmountEntry: { recipientName: string; recipientUpi: string; recipientRisk: 'LOW' | 'MEDIUM' | 'HIGH' };
  PaymentConfirmation: { recipientName: string; recipientUpi: string; amount: number };
  FraudAnalysis: { recipientName: string; recipientUpi: string; amount: number };
  RiskWarning: {
    riskScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    explanation: string[];
    recipientName: string;
    recipientUpi: string;
    amount: number;
  };
  PaymentSuccess: { recipientName: string; amount: number };
  PaymentFailed: { reason: string };
  QrScanner: undefined;
  QrDetails: {
    qrData: string;
    riskScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    explanation: string[];
    recipientName: string;
  };
  ReportMerchant: { prefilledUpi?: string };
  ScamTimeline: { timeline: any[]; scamType: string };
  OtpGuardian: undefined;
};
