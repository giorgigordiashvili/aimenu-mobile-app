import * as React from "react";
import Svg, { Path } from "react-native-svg";

function CheckCircleIcon() {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
      <Path
        d="M0 40C0 17.909 17.909 0 40 0s40 17.909 40 40-17.909 40-40 40S0 62.091 0 40z"
        fill="#7CCF00"
      />
      <Path
        d="M51.995 31l-16.5 16.5-7.5-7.5"
        stroke="#fff"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CheckCircleIcon;
