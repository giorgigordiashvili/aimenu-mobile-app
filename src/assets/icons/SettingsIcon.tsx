import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SettingsIcon() {
  return (
    <Svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M12.5 13.125c0-.872 0-1.308-.108-1.663a2.5 2.5 0 00-1.666-1.667c-.355-.107-.791-.107-1.664-.107H5.938c-.873 0-1.309 0-1.664.107a2.5 2.5 0 00-1.666 1.667c-.108.355-.108.79-.108 1.663m7.813-8.438a2.813 2.813 0 11-5.626 0 2.813 2.813 0 015.625 0z"
        stroke="#232D61"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SettingsIcon;
