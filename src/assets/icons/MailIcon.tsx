import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
}

function MailIcon({ size = 16, color = "#90A1B9" }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M14.667 4.666L8.673 8.484a1.333 1.333 0 01-1.339 0l-6-3.818"
        stroke={color}
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.334 2.666H2.667c-.736 0-1.333.597-1.333 1.333v8c0 .737.597 1.334 1.333 1.334h10.667c.736 0 1.333-.597 1.333-1.334V4c0-.736-.597-1.333-1.333-1.333z"
        stroke={color}
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default MailIcon;
