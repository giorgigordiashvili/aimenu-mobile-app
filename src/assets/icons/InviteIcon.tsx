import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
}

function InviteIcon({ size = 24, color = "#fff" }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M19 21v-6m-3 3h6m-10-3H8c-1.864 0-2.796 0-3.53.305a4 4 0 00-2.166 2.164C2 18.204 2 19.136 2 21M15.5 3.29a4.001 4.001 0 010 7.42M13.5 7a4 4 0 11-8 0 4 4 0 018 0z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default InviteIcon;
