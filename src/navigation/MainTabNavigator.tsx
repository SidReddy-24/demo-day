import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, Text, Pressable, useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { HomeIcon, ProfileIcon, QrScanIcon } from '../components/Icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// Import Screens
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 84 : 74;
const BUBBLE_SIZE = 48;
const QR_BUTTON_SIZE = 58;

// 3 visual slots: [Home(0)] [QR(1-centre)] [Profile(2)]
// Navigator has only 2 routes: index 0 → visual slot 0, index 1 → visual slot 2
const getVisualSlotX = (navigatorIndex: number, slotWidth: number) => {
  const visualSlot = navigatorIndex === 0 ? 0 : 2;
  return visualSlot * slotWidth + (slotWidth - BUBBLE_SIZE) / 2;
};

// Sliding lime bubble
const SlidingBubble = ({ index, slotWidth }: { index: number; slotWidth: number }) => {
  const translateX = useSharedValue(getVisualSlotX(index, slotWidth));
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);

  useEffect(() => {
    const targetX = getVisualSlotX(index, slotWidth);
    translateX.value = withSpring(targetX, { damping: 15, stiffness: 100 });
    scaleX.value = withSequence(
      withTiming(1.2, { duration: 90 }),
      withSpring(1, { damping: 12, stiffness: 140 })
    );
    scaleY.value = withSequence(
      withTiming(0.84, { duration: 90 }),
      withSpring(1, { damping: 12, stiffness: 140 })
    );
  }, [index, slotWidth]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scaleX: scaleX.value },
      { scaleY: scaleY.value },
    ],
  }));

  return <Animated.View style={[styles.bubble, style]} />;
};

// Icon with 3-step bounce on focus
const TabIcon = ({ focused, children }: { focused: boolean; children: React.ReactNode }) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (focused) {
      scale.value = withSequence(
        withSpring(0.85, { damping: 10, stiffness: 200 }),
        withSpring(1.05, { damping: 8, stiffness: 160 }),
        withSpring(1, { damping: 12, stiffness: 140 })
      );
      translateY.value = withSpring(-2, { damping: 12, stiffness: 140 });
    } else {
      scale.value = withSpring(1, { damping: 14, stiffness: 150 });
      translateY.value = withSpring(0, { damping: 14, stiffness: 150 });
    }
  }, [focused]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
};

// Elevated centre QR button
const QrCentreButton = ({ slotWidth }: { slotWidth: number }) => {
  const navigation = useNavigation<any>();
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.88, { damping: 10, stiffness: 220 }),
      withSpring(1.06, { damping: 8, stiffness: 180 }),
      withSpring(1, { damping: 12, stiffness: 150 })
    );
    navigation.navigate('QrScanner');
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.qrSlot, { width: slotWidth }]}>
      <Animated.View style={animStyle}>
        <Pressable onPress={handlePress} style={styles.qrButton}>
          <QrScanIcon color="#1c1c1e" size={26} />
        </Pressable>
      </Animated.View>
      <Text style={styles.qrLabel}>Scan</Text>
    </View>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const { width: screenWidth } = useWindowDimensions();
  const [tabBarWidth, setTabBarWidth] = useState(screenWidth);
  const slotWidth = tabBarWidth / 3;

  const renderTab = (route: any, navigatorIndex: number) => {
    const { options } = descriptors[route.key];
    const label = options.tabBarLabel ?? options.title ?? route.name;
    const isFocused = state.index === navigatorIndex;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const iconColor = isFocused ? '#1c1c1e' : '#9ca3af';
    const size = 22;
    let icon = null;
    switch (route.name) {
      case 'HomeTab':
        icon = <HomeIcon color={iconColor} size={size} focused={isFocused} />;
        break;
      case 'ProfileTab':
        icon = <ProfileIcon color={iconColor} size={size} focused={isFocused} />;
        break;
    }

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        style={[styles.tabButton, { width: slotWidth }]}
      >
        <View style={styles.iconZone}>
          <TabIcon focused={isFocused}>{icon}</TabIcon>
        </View>
        <Text
          style={[styles.label, { color: isFocused ? '#bef264' : '#6b7280' }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      onLayout={(e) => setTabBarWidth(e.nativeEvent.layout.width)}
      style={styles.tabBar}
    >
      <SlidingBubble index={state.index} slotWidth={slotWidth} />

      {/* Home — slot 0 */}
      {renderTab(state.routes[0], 0)}

      {/* QR scan — centre slot 1 */}
      <QrCentreButton slotWidth={slotWidth} />

      {/* Profile — slot 2 */}
      {renderTab(state.routes[1], 1)}
    </View>
  );
};

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderTopWidth: 1,
    borderTopColor: '#2e2e30',
    height: TAB_BAR_HEIGHT,
    paddingBottom: Platform.OS === 'ios' ? 16 : 8,
    paddingTop: 6,
    position: 'relative',
    alignItems: 'center',
  },
  bubble: {
    position: 'absolute',
    top: 4,
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: '#bef264',
    shadowColor: '#bef264',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconZone: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
    letterSpacing: 0.2,
  },
  qrSlot: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  qrButton: {
    width: QR_BUTTON_SIZE,
    height: QR_BUTTON_SIZE,
    borderRadius: QR_BUTTON_SIZE / 2,
    backgroundColor: '#bef264',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    shadowColor: '#bef264',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#1c1c1e',
  },
  qrLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#bef264',
    letterSpacing: 0.2,
    marginTop: 3,
  },
});
