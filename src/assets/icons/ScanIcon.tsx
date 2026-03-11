import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface ScanIconProps {
  color?: string;
  size?: number;
}

function ScanIcon({ color = "#98A2B3", size = 22 }: ScanIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M7.333 2.75h-1.65c-1.026 0-1.54 0-1.932.2a1.833 1.833 0 00-.801.801c-.2.392-.2.906-.2 1.932v1.65M7.333 19.25h-1.65c-1.026 0-1.54 0-1.932-.2a1.834 1.834 0 01-.801-.801c-.2-.392-.2-.906-.2-1.932v-1.65m16.5-7.334v-1.65c0-1.026 0-1.54-.2-1.932a1.834 1.834 0 00-.801-.801c-.392-.2-.906-.2-1.932-.2h-1.65m4.583 11.917v1.65c0 1.026 0 1.54-.2 1.932a1.834 1.834 0 01-.801.801c-.392.2-.906.2-1.932.2h-1.65m0-8.25a3.667 3.667 0 11-7.334 0 3.667 3.667 0 017.334 0z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ScanIcon;
