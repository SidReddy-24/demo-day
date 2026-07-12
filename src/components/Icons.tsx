import React from 'react';
import Svg, { Path, Rect, Circle, Line, G } from 'react-native-svg';

interface IconProps {
  color: string;
  size?: number;
  focused?: boolean;
}

export const HomeIcon: React.FC<IconProps> = ({ color, size = 24, focused }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 10.182v9.818a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 20v-9.818a1.5 1.5 0 00-.547-1.155l-7.5-6.136a1.5 1.5 0 00-1.906 0l-7.5 6.136A1.5 1.5 0 003 10.182z"
      stroke={color}
      strokeWidth={focused ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={focused ? `${color}20` : 'none'}
    />
    <Path
      d="M9 21v-6a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 15v6"
      stroke={color}
      strokeWidth={focused ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SecurityIcon: React.FC<IconProps> = ({ color, size = 24, focused }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke={color}
      strokeWidth={focused ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={focused ? `${color}20` : 'none'}
    />
    <Path
      d="M9 11l2 2 4-4"
      stroke={color}
      strokeWidth={focused ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CommunityIcon: React.FC<IconProps> = ({ color, size = 24, focused }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="6"
      r="3"
      stroke={color}
      strokeWidth={focused ? 2.2 : 1.8}
      fill={focused ? color : 'none'}
    />
    <Circle
      cx="6"
      cy="16"
      r="3"
      stroke={color}
      strokeWidth={focused ? 2.2 : 1.8}
      fill={focused ? color : 'none'}
    />
    <Circle
      cx="18"
      cy="16"
      r="3"
      stroke={color}
      strokeWidth={focused ? 2.2 : 1.8}
      fill={focused ? color : 'none'}
    />
    <Line
      x1="10"
      y1="8.5"
      x2="8"
      y2="13.5"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Line
      x1="14"
      y1="8.5"
      x2="16"
      y2="13.5"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Line
      x1="9"
      y1="16"
      x2="15"
      y2="16"
      stroke={color}
      strokeWidth={1.2}
      strokeDasharray="2,2"
    />
  </Svg>
);

export const AnalyticsIcon: React.FC<IconProps> = ({ color, size = 24, focused }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="12"
      width="4"
      height="8"
      rx="1"
      stroke={color}
      strokeWidth={focused ? 2.2 : 1.8}
      fill={focused ? `${color}20` : 'none'}
    />
    <Rect
      x="10"
      y="7"
      width="4"
      height="13"
      rx="1"
      stroke={color}
      strokeWidth={focused ? 2.2 : 1.8}
      fill={focused ? `${color}20` : 'none'}
    />
    <Rect
      x="17"
      y="3"
      width="4"
      height="17"
      rx="1"
      stroke={color}
      strokeWidth={focused ? 2.2 : 1.8}
      fill={focused ? `${color}20` : 'none'}
    />
  </Svg>
);

export const QrScanIcon: React.FC<IconProps> = ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Top-left corner */}
    <Path d="M3 9V5a2 2 0 012-2h4" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    {/* Top-right corner */}
    <Path d="M21 9V5a2 2 0 00-2-2h-4" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    {/* Bottom-left corner */}
    <Path d="M3 15v4a2 2 0 002 2h4" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    {/* Bottom-right corner */}
    <Path d="M21 15v4a2 2 0 01-2 2h-4" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    {/* Center scan line */}
    <Path d="M7 12h10" stroke={color} strokeWidth={2} strokeLinecap="round" />
    {/* Small center dot */}
    <Rect x="10.5" y="10.5" width="3" height="3" rx="0.5" fill={color} />
  </Svg>
);

export const ProfileIcon: React.FC<IconProps> = ({ color, size = 24, focused }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="8"
      r="4"
      stroke={color}
      strokeWidth={focused ? 2.2 : 1.8}
      fill={focused ? `${color}20` : 'none'}
    />
    <Path
      d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
      stroke={color}
      strokeWidth={focused ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ArrowSendIcon: React.FC<IconProps> = ({ color, size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 5L5 19M5 19H15M5 19V9"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ArrowReceiveIcon: React.FC<IconProps> = ({ color, size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 19L19 5M19 5H9M19 5V15"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
