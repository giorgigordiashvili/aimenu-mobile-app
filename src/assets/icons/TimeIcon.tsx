import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function TimeIcon() {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G
        clipPath="url(#clip0_213_4732)"
        stroke="#90A1B9"
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M8 4v4l2.667 1.333" />
        <Path d="M8 14.666A6.667 6.667 0 108 1.333a6.667 6.667 0 000 13.333z" />
      </G>
      <Defs>
        <ClipPath id="clip0_213_4732">
          <Path fill="#fff" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default TimeIcon;
