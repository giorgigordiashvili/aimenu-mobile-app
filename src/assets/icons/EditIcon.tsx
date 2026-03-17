import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function EditIcon() {
  return (
    <Svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G clipPath="url(#clip0_213_2426)">
        <Path
          d="M8.69 4.828L6.759 2.897m-5.552 7.482l1.634-.181c.2-.022.3-.034.393-.064a.97.97 0 00.234-.112c.082-.054.153-.125.295-.267l6.375-6.376a1.366 1.366 0 00-1.931-1.93L1.832 7.823a2.044 2.044 0 00-.267.295.965.965 0 00-.113.234c-.03.093-.041.193-.063.392l-.182 1.634z"
          stroke="#45556C"
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_213_2426">
          <Path fill="#fff" d="M0 0H11.5862V11.5862H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default EditIcon;
