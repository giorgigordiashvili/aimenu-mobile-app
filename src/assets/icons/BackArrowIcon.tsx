import * as React from "react";
import Svg, { Path } from "react-native-svg";

function BackArrowIcon() {
  return (
    <Svg
      width={7}
      height={12}
      viewBox="0 0 7 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M5.833 10.833l-5-5 5-5"
        stroke="#000"
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BackArrowIcon;
