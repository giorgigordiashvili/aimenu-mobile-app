import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ChevronIcon() {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M4.375 6.563l4.375 4.375 4.375-4.376"
        stroke="#fff"
        strokeWidth={1.45833}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ChevronIcon;
