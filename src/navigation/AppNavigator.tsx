import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

// Import Screens
import { SplashScreen } from '../screens/auth/SplashScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { PermissionsScreen } from '../screens/auth/PermissionsScreen';
import { AccessibilityScreen } from '../screens/auth/AccessibilityScreen';
import { BiometricSetupScreen } from '../screens/auth/BiometricSetupScreen';
import { PinSetupScreen } from '../screens/auth/PinSetupScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { SendMoneyScreen } from '../screens/main/SendMoneyScreen';
import { AmountEntryScreen } from '../screens/main/AmountEntryScreen';
import { PaymentConfirmationScreen } from '../screens/main/PaymentConfirmationScreen';
import { FraudAnalysisScreen } from '../screens/main/FraudAnalysisScreen';
import { RiskWarningScreen } from '../screens/main/RiskWarningScreen';
import { PaymentSuccessScreen } from '../screens/main/PaymentSuccessScreen';
import { PaymentFailedScreen } from '../screens/main/PaymentFailedScreen';
import { QrScannerScreen } from '../screens/main/QrScannerScreen';
import { QrDetailsScreen } from '../screens/main/QrDetailsScreen';
import { ReportMerchantScreen } from '../screens/main/ReportMerchantScreen';
import { ScamTimelineScreen } from '../screens/main/ScamTimelineScreen';
import { OtpGuardianScreen } from '../screens/main/OtpGuardianScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff8f5' },
          gestureEnabled: false, // Ensure users navigate through security steps sequentially
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Permissions" component={PermissionsScreen} />
        <Stack.Screen name="Accessibility" component={AccessibilityScreen} />
        <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
        <Stack.Screen name="PinSetup" component={PinSetupScreen} />
        <Stack.Screen name="DashboardStub" component={MainTabNavigator} />
        <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
        <Stack.Screen name="AmountEntry" component={AmountEntryScreen} />
        <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} />
        <Stack.Screen name="FraudAnalysis" component={FraudAnalysisScreen} />
        <Stack.Screen name="RiskWarning" component={RiskWarningScreen} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
        <Stack.Screen name="PaymentFailed" component={PaymentFailedScreen} />
        <Stack.Screen name="QrScanner" component={QrScannerScreen} />
        <Stack.Screen name="QrDetails" component={QrDetailsScreen} />
        <Stack.Screen name="ReportMerchant" component={ReportMerchantScreen} />
        <Stack.Screen name="ScamTimeline" component={ScamTimelineScreen} />
        <Stack.Screen name="OtpGuardian" component={OtpGuardianScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
