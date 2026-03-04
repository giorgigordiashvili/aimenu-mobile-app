import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function ChefIcon() {
  return (
    <Svg
      width={10}
      height={10}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G
        clipPath="url(#clip0_213_3409)"
        stroke="#62748E"
        strokeWidth={0.832772}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M7.078 8.744a.416.416 0 00.417-.417V6.1c0-.19.131-.352.302-.434a1.666 1.666 0 00-.888-3.16 2.082 2.082 0 00-3.825 0 1.666 1.666 0 00-.889 3.16c.171.082.303.243.303.433v2.228a.416.416 0 00.416.417h4.164zM2.498 7.078h4.997" />
      </G>
      <Defs>
        <ClipPath id="clip0_213_3409">
          <Path fill="#fff" d="M0 0H9.99327V9.99327H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default ChefIcon;
