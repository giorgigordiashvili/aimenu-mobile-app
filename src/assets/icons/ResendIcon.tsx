import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ResendIcon() {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M1.667 8.333S3.337 6.057 4.695 4.7a7.5 7.5 0 11-1.902 7.385m-1.126-3.75v-5m0 5h5"
        stroke="#757575"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ResendIcon;
