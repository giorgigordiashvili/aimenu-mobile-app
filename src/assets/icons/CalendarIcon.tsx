import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
}

function CalendarIcon({ size = 16, color = "#90A1B9" }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G
        clipPath="url(#clip0_213_4721)"
        stroke={color}
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M5.333 1.334v2.667M10.666 1.334v2.667M12.667 2.666H3.333C2.597 2.666 2 3.263 2 3.999v9.334c0 .736.597 1.333 1.333 1.333h9.334c.736 0 1.333-.597 1.333-1.333V3.999c0-.736-.597-1.333-1.333-1.333zM2 6.666h12" />
      </G>
      <Defs>
        <ClipPath id="clip0_213_4721">
          <Path fill="#fff" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default CalendarIcon;
