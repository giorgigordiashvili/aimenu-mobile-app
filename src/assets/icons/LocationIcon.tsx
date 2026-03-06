import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

interface LocationIconProps {
  color?: string;
}

function LocationIcon({ color = "#62748E" }: LocationIconProps) {
  return (
    <Svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G
        clipPath="url(#clip0_213_3448)"
        stroke={color}
        strokeWidth={0.999781}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M9.998 4.999c0 2.496-2.77 5.095-3.699 5.898a.5.5 0 01-.6 0c-.93-.803-3.7-3.402-3.7-5.898a4 4 0 017.999 0z" />
        <Path d="M5.999 6.499a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </G>
      <Defs>
        <ClipPath id="clip0_213_3448">
          <Path fill="#fff" d="M0 0H11.9974V11.9974H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default LocationIcon;
