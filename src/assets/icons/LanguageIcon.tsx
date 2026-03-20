import * as React from "react";
import Svg, { Path } from "react-native-svg";

function LanguageIcon() {
  return (
    <Svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M1.25 7.5h12.5m-12.5 0a6.25 6.25 0 006.25 6.25M1.25 7.5A6.25 6.25 0 017.5 1.25m6.25 6.25a6.25 6.25 0 01-6.25 6.25m6.25-6.25A6.25 6.25 0 007.5 1.25m0 0A9.563 9.563 0 0110 7.5a9.563 9.563 0 01-2.5 6.25m0-12.5A9.563 9.563 0 005 7.5a9.563 9.563 0 002.5 6.25"
        stroke="#232D61"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default LanguageIcon;
