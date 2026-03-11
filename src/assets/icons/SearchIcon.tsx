import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface SearchIconProps {
  color?: string;
  size?: number;
}

function SearchIcon({ color = "#98A2B3", size = 22 }: SearchIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M12.993 13.992l-2.892-2.891M6.33 12.66A5.33 5.33 0 106.33 2a5.33 5.33 0 000 10.66z"
        stroke={color}
        strokeWidth={1.33266}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SearchIcon;
