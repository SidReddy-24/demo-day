import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Platform } from 'react-native';

// Set up server base URLs.
// On physical devices, 'localhost' refers to the phone. Expo provides tools to detect machine IP.
// For hackathon purposes, we use localhost/10.0.2.2 (android emulator) but provide an auto-mocking system.
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5001'; // Default Android emulator host loopback
  }
  return 'http://localhost:5001';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to force mocking locally when backend isn't running
let forceMock = true;

export const setMockMode = (mode: boolean) => {
  forceMock = mode;
};

export const isMockMode = () => forceMock;

// Helper to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mutable local mock database for offline demo capability
 */
const localReports = [
  {
    upiId: 'claims.rewards@secure',
    category: 'Lottery / Rewards Fraud',
    description: 'Attempts to collect secure PIN inputs by offering fake scratch card bonuses.',
    timestamp: '1 hour ago'
  },
  {
    upiId: 'billpay.board@apco',
    category: 'Fake Utility / Bill Scheme',
    description: 'Issues spoofed disconnection alerts requesting immediate payment overrides.',
    timestamp: 'Yesterday'
  }
];

const isLocalBlacklisted = (upi: string) => {
  const clean = upi.toLowerCase().trim();
  return localReports.some(r => r.upiId.toLowerCase().trim() === clean) || clean.includes('scam');
};

const getLocalReportDetails = (upi: string) => {
  const clean = upi.toLowerCase().trim();
  return localReports.find(r => r.upiId.toLowerCase().trim() === clean) || {
    category: 'Flagged Merchant',
    description: 'Associated with community threat flags.'
  };
};

/**
 * Mock data definitions representing the Flask API responses
 */
const mockEndpoints: Record<string, (data?: any) => any> = {
  '/login': (data) => {
    const { email } = data || {};
    return {
      status: 'success',
      token: 'mock-jwt-token-12345',
      user: {
        id: 'user_01',
        name: email ? email.split('@')[0] : 'Demo User',
        email: email || 'demo@sentinelpay.ai',
        phone: '+91 98765 43210',
        upiId: `${email ? email.split('@')[0] : 'demouser'}@sentinelpay`,
        trustScore: 98,
      },
    };
  },
  '/register': (data) => {
    const { name, email, phone } = data || {};
    return {
      status: 'success',
      token: 'mock-jwt-token-registered',
      user: {
        id: 'user_02',
        name: name || 'New User',
        email: email || 'new@sentinelpay.ai',
        phone: phone || '+91 99999 88888',
        upiId: `${name ? name.toLowerCase().replace(/\s+/g, '') : 'newuser'}@sentinelpay`,
        trustScore: 95,
      },
    };
  },
  '/check-device': () => {
    return {
      status: 'success',
      deviceTrust: {
        score: 96,
        rootDetected: false,
        developerMode: true, // typical for devs running simulator/expo
        vpnActive: false,
        overlayDetected: false,
        biometricsEnrolled: true,
        riskLevel: 'LOW',
        reasons: ['Developer mode enabled (acceptable for test environment)'],
      },
    };
  },
  '/check-risk': (data) => {
    const { amount, recipientUpi, activeCall, safeMode } = data || {};
    const upiClean = (recipientUpi || '').toLowerCase().trim();
    
    // Default safe response
    let riskScore = 12;
    let riskLevel = 'LOW';
    let confidence = 92.5;
    let scamType = 'None';
    let explanation = [
      'Transaction size falls within normal bounds',
      'Recipient UPI shows high trust score across the network',
      'Device signature matches registered profile'
    ];
    let timeline = [
      { time: '02:01', event: 'Device session verified clean', type: 'SECURITY' },
      { time: '02:10', event: 'Normal keyboard typing rhythm behavior logged', type: 'BIOMETRIC' },
      { time: '02:12', event: 'Transaction initialized within normal timing bounds', type: 'PAYMENT' }
    ];

    // High risk: local blacklisted or containing scam
    if (isLocalBlacklisted(upiClean)) {
      const details = getLocalReportDetails(upiClean);
      riskScore = 96;
      riskLevel = 'HIGH';
      confidence = 97.8;
      scamType = upiClean.includes('claims') ? 'Lottery Scam' : 'Fake Utility Bill Scam';
      explanation = [
        `Recipient UPI matches threat database (${details.category})`,
        'This receiver node has active community fraud reports',
        details.description,
        activeCall ? 'CRITICAL: High-value transaction attempted during active voice call' : 'Risk signature: suspicious dynamic billing entity'
      ];
      timeline = [
        { time: '09:12', event: 'Suspicious incoming call from unverified sender', type: 'CALL' },
        { time: '09:18', event: 'Scam SMS received with payment link warning', type: 'SMS' },
        { time: '09:20', event: `New Beneficiary '${upiClean}' added to clipboard`, type: 'APP' },
        { time: '09:21', event: `High-value payment attempt to unverified target`, type: 'PAYMENT' }
      ];
      if (activeCall) {
        timeline.push({ time: '09:22', event: 'Active phone call context active during authorization', type: 'CALL' });
      }
    }
    // High risk: payment during active call
    else if (activeCall) {
      riskScore = 88;
      riskLevel = 'HIGH';
      confidence = 94.2;
      scamType = 'Digital Arrest / Social Engineering Scam';
      explanation = [
        'Payment initiated during a live voice call (Social Engineering signature)',
        'Unverified target recipient added in the current session',
        'Large transfer velocity detected under active call pressure'
      ];
      timeline = [
        { time: '09:05', event: 'Voice call established with unknown caller (+91 90812 77123)', type: 'CALL' },
        { time: '09:08', event: 'OTP received via background SMS scanner', type: 'SMS' },
        { time: '09:11', event: 'UPI transaction dialog focused under call context', type: 'PAYMENT' }
      ];
    }
    // Medium risk: Safe mode violation
    else if (safeMode && amount >= 2000) {
      riskScore = 72;
      riskLevel = 'MEDIUM';
      confidence = 89.0;
      scamType = 'Safe Mode Restriction Violation';
      explanation = [
        'Safe Mode is enabled: transfers above ₹2,000 to new recipients are restricted',
        'Recipient trust passport rating is pending network verification',
        'Adds extra verification layer to prevent elderly/novice financial coercion'
      ];
      timeline = [
        { time: '10:00', event: 'Safe Mode protection activated by user', type: 'SECURITY' },
        { time: '10:05', event: `Transfer of ₹${amount} initiated to new target`, type: 'PAYMENT' },
        { time: '10:06', event: 'Safe Mode threshold restriction triggered', type: 'SECURITY' }
      ];
    }
    // Medium risk: general high amount
    else if (amount >= 10000) {
      riskScore = 65;
      riskLevel = 'MEDIUM';
      confidence = 88.2;
      scamType = 'Investment / Job Scam';
      explanation = [
        'Unusually high value transfer compared to your standard user profile',
        'Target recipient has limited interaction history with your account',
        'Device is operating on a cellular connection without a verified GPS lock'
      ];
      timeline = [
        { time: '08:00', event: 'Normal device startup verification', type: 'SECURITY' },
        { time: '08:30', event: 'Large amount entered into payment field', type: 'PAYMENT' }
      ];
    }

    return {
      riskScore,
      riskLevel,
      confidence,
      scamType,
      explanation,
      timeline
    };
  },
  '/check-qr': (data) => {
    const { qrData } = data || {};
    const upiClean = (qrData || '').toLowerCase().trim();
    const name = upiClean.split('@')[0].replace('.', ' ').toUpperCase();

    if (isLocalBlacklisted(upiClean)) {
      const details = getLocalReportDetails(upiClean);
      return {
        riskScore: 96,
        riskLevel: 'HIGH',
        recipientName: name,
        explanation: [
          `Flagged under: ${details.category}`,
          'Ecosystem status: Community Blacklisted',
          details.description
        ]
      };
    }

    return {
      riskScore: 14,
      riskLevel: 'LOW',
      recipientName: name,
      explanation: [
        'Scanned signature matches registered NPCI merchant guidelines',
        'Optimal trust rating in community database',
        'No active warning reports filed'
      ]
    };
  },
  '/report-merchant': (data) => {
    const { upiId, category, description } = data || {};
    localReports.unshift({
      upiId: upiId || 'unknown@upi',
      category: category || 'General Scam',
      description: description || 'Flagged by community report.',
      timestamp: 'Just now'
    });
    return {
      status: 'success',
      message: 'Report logged successfully'
    };
  },
  '/check-community': () => {
    return {
      status: 'success',
      reports: localReports,
      totalReports: 1400 + localReports.length
    };
  },
  '/check-graph': () => {
    return {
      nodes: [
        { id: 'user', label: 'Your Profile', status: 'SAFE', x: 160, y: 60 },
        { id: 'mule1', label: 'Intermediary A', status: 'WARNING', x: 80, y: 160 },
        { id: 'mule2', label: 'Intermediary B', status: 'SAFE', x: 240, y: 160 },
        { id: 'scam_hub', label: 'Scam Ring Node', status: 'DANGER', x: 80, y: 280 },
        { id: 'vendor', label: 'Merchant Target', status: 'SAFE', x: 240, y: 280 }
      ],
      edges: [
        { from: 'user', to: 'mule1' },
        { from: 'user', to: 'mule2' },
        { from: 'mule1', to: 'scam_hub' },
        { from: 'mule2', to: 'vendor' }
      ]
    };
  }
};

/**
 * Custom request wrapper that handles either real HTTP requests
 * or fallback mocks with network latency simulation.
 */
export const request = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  const url = config.url || '';
  
  if (forceMock) {
    console.log(`[API Mock] Intercepted request to: ${url}`);
    await delay(1200); // Simulate network roundtrip latency

    const handler = mockEndpoints[url];
    if (handler) {
      return handler(config.data) as T;
    }
    throw new Error(`Mock endpoint not found for: ${url}`);
  }

  try {
    const response: AxiosResponse<T> = await api(config);
    return response.data;
  } catch (error: any) {
    console.warn(`[API Connection] Real request failed for ${url}. Falling back to Mock Engine.`, error.message);
    
    // Auto fallback to mocks on failure
    await delay(800);
    const handler = mockEndpoints[url];
    if (handler) {
      return handler(config.data) as T;
    }
    throw error;
  }
};
