import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface ProfileIconProps {
  color?: string;
  size?: number;
}

function ProfileIcon({ color = "#98A2B3", size = 22 }: ProfileIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M4.873 17.819a3.668 3.668 0 013.377-2.235h5.5c1.517 0 2.82.92 3.377 2.235m-2.46-9.11a3.667 3.667 0 11-7.334 0 3.667 3.667 0 017.334 0zm5.5 2.291a9.167 9.167 0 11-18.333 0 9.167 9.167 0 0118.333 0z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ProfileIcon;
