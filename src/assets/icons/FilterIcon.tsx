import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface Props {
  color?: string;
  size?: number;
}

function FilterIcon({ color = "#0F172B", size = 16 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M2 4h12M4 8h8M6 12h4"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default FilterIcon;
