import * as React from "react";
import Svg, { Path } from "react-native-svg";

function BillingIcon() {
  return (
    <Svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M13.75 6.25H1.25m5.625 2.5H3.75m-2.5-3.625v4.75c0 .7 0 1.05.136 1.318.12.235.311.426.547.546.267.136.617.136 1.317.136h8.5c.7 0 1.05 0 1.318-.136a1.25 1.25 0 00.546-.546c.136-.268.136-.618.136-1.318v-4.75c0-.7 0-1.05-.136-1.317a1.25 1.25 0 00-.546-.547c-.268-.136-.618-.136-1.318-.136h-8.5c-.7 0-1.05 0-1.317.136a1.25 1.25 0 00-.547.547c-.136.267-.136.617-.136 1.317z"
        stroke="#232D61"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BillingIcon;
