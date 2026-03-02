import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function PhoneIcon() {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G clipPath="url(#clip0_213_1930)">
        <Path
          d="M9.217 11.04a.666.666 0 00.808-.202l.236-.31a1.333 1.333 0 011.067-.533h1.998a1.333 1.333 0 011.333 1.333v1.999a1.333 1.333 0 01-1.333 1.333A11.994 11.994 0 011.333 2.666a1.333 1.333 0 011.332-1.333h2a1.333 1.333 0 011.332 1.333v1.999a1.333 1.333 0 01-.533 1.066l-.312.234a.666.666 0 00-.195.821 9.328 9.328 0 004.26 4.254z"
          stroke="#90A1B9"
          strokeWidth={1.33266}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_213_1930">
          <Path fill="#fff" d="M0 0H15.992V15.992H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default PhoneIcon;
