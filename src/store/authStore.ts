import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isOnboarded: boolean;
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    upiId: string;
    trustScore: number;
  } | null;
  token: string | null;
  permissions: {
    sms: boolean;
    location: boolean;
    notifications: boolean;
  };
  accessibilityChecked: boolean;
  deviceTrustScore: number;
  biometricsEnabled: boolean;
  pinCode: string | null;
  vpnActive: boolean;
  rootDetected: boolean;
  activeCall: boolean;
  safeMode: boolean;
  
  // Actions
  setOnboarded: (val: boolean) => void;
  login: (user: NonNullable<AuthState['user']>, token: string) => void;
  logout: () => void;
  setPermissions: (sms: boolean, location: boolean, notifications: boolean) => void;
  setAccessibilityChecked: (val: boolean) => void;
  setDeviceTrustScore: (score: number) => void;
  setBiometricsEnabled: (val: boolean) => void;
  setPinCode: (pin: string | null) => void;
  setVpnActive: (val: boolean) => void;
  setRootDetected: (val: boolean) => void;
  setActiveCall: (val: boolean) => void;
  setSafeMode: (val: boolean) => void;
  resetAll: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isOnboarded: false,
      isAuthenticated: false,
      user: null,
      token: null,
      permissions: {
        sms: false,
        location: false,
        notifications: false,
      },
      accessibilityChecked: false,
      deviceTrustScore: 100,
      biometricsEnabled: false,
      pinCode: null,
      vpnActive: false,
      rootDetected: false,
      activeCall: false,
      safeMode: false,

      setOnboarded: (val) => set({ isOnboarded: val }),
      login: (user, token) => set({ isAuthenticated: true, user, token }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
      setPermissions: (sms, location, notifications) =>
        set({ permissions: { sms, location, notifications } }),
      setAccessibilityChecked: (val) => set({ accessibilityChecked: val }),
      setDeviceTrustScore: (score) => set({ deviceTrustScore: score }),
      setBiometricsEnabled: (val) => set({ biometricsEnabled: val }),
      setPinCode: (pin) => set({ pinCode: pin }),
      setVpnActive: (val) => set({ vpnActive: val }),
      setRootDetected: (val) => set({ rootDetected: val }),
      setActiveCall: (val) => set({ activeCall: val }),
      setSafeMode: (val) => set({ safeMode: val }),
      resetAll: () =>
        set({
          isOnboarded: false,
          isAuthenticated: false,
          user: null,
          token: null,
          permissions: { sms: false, location: false, notifications: false },
          accessibilityChecked: false,
          deviceTrustScore: 100,
          biometricsEnabled: false,
          pinCode: null,
          vpnActive: false,
          rootDetected: false,
          activeCall: false,
          safeMode: false,
        }),
    }),
    {
      name: 'sentinelpay-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
