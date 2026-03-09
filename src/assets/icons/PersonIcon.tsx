import * as React from "react";
import Svg, { Path } from "react-native-svg";

function PersonIcon() {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M10.667 14v-1.333A2.667 2.667 0 008 10H4a2.667 2.667 0 00-2.667 2.667V14M10.666 2.086a2.667 2.667 0 010 5.163M14.666 14v-1.334a2.667 2.667 0 00-2-2.58M6 7.333A2.667 2.667 0 106 2a2.667 2.667 0 000 5.333z"
        stroke="#90A1B9"
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default PersonIcon;
