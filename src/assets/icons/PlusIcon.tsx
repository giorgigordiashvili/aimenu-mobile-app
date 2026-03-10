import * as React from "react";
import Svg, { Path } from "react-native-svg";

function PlusIcon() {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M3.332 7.996h9.329M7.996 3.332v9.329"
        stroke="#90A1B9"
        strokeWidth={1.33266}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default PlusIcon;
