import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface DropdownArrowIconProps {
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
}

function DropdownArrowIcon({
  width = 12,
  height = 6,
  color = "#677C98",
  opacity = 0.5,
}: DropdownArrowIconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 12 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M1 1l5 4 5-4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      />
    </Svg>
  );
}

export default DropdownArrowIcon;
