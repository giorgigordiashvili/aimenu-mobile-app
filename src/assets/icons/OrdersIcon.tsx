import * as React from "react";
import Svg, { Path } from "react-native-svg";

function OrdersIcon() {
  return (
    <Svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M5.625 6.563l1.25 1.25L9.688 5m2.812 8.125v-8.25c0-1.05 0-1.575-.204-1.976a1.875 1.875 0 00-.82-.82c-.4-.204-.926-.204-1.976-.204h-4c-1.05 0-1.575 0-1.976.204-.353.18-.64.467-.82.82-.204.4-.204.926-.204 1.976v8.25l1.719-1.25 1.562 1.25 1.719-1.25 1.719 1.25 1.562-1.25 1.719 1.25z"
        stroke="#232D61"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default OrdersIcon;
