import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function StarIcon() {
  return (
    <Svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G clipPath="url(#clip0_213_3402)">
        <Path
          d="M5.761 1.147a.265.265 0 01.475 0l1.155 2.34a1.061 1.061 0 00.797.579l2.583.378a.265.265 0 01.147.452L9.05 6.714a1.061 1.061 0 00-.305.94l.44 2.569a.265.265 0 01-.385.28L6.492 9.289a1.06 1.06 0 00-.987 0l-2.308 1.214a.264.264 0 01-.384-.28l.44-2.57a1.06 1.06 0 00-.306-.939L1.08 4.896a.265.265 0 01.147-.453l2.582-.377a1.06 1.06 0 00.798-.58l1.154-2.339z"
          fill="#F0B100"
          stroke="#F0B100"
          strokeWidth={0.999781}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_213_3402">
          <Path fill="#fff" d="M0 0H11.9974V11.9974H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default StarIcon;
