import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
}

function ShieldIcon({ size = 16, color = "#3C6300" }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G
        clipPath="url(#clip0_213_2469)"
        stroke={color}
        strokeWidth={1.33266}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M13.326 8.662c0 3.332-2.332 4.997-5.104 5.964a.666.666 0 01-.446-.007c-2.779-.96-5.111-2.625-5.111-5.957V3.998a.666.666 0 01.666-.667c1.333 0 2.999-.8 4.158-1.812a.78.78 0 011.013 0c1.166 1.02 2.825 1.812 4.158 1.812a.667.667 0 01.666.667v4.664z" />
        <Path d="M5.997 7.996L7.33 9.329l2.665-2.666" />
      </G>
      <Defs>
        <ClipPath id="clip0_213_2469">
          <Path fill="#fff" d="M0 0H15.992V15.992H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default ShieldIcon;
