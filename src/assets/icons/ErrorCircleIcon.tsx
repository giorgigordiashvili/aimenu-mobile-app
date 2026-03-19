import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ErrorCircleIcon() {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
      <Path
        d="M0 40C0 17.909 17.909 0 40 0s40 17.909 40 40-17.909 40-40 40S0 62.091 0 40z"
        fill="#FF2323"
      />
      <Path
        d="M50.496 29.5l-21.002 21m0-21l21.002 21"
        stroke="#fff"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ErrorCircleIcon;
