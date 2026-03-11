import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface HomeIconProps {
  color?: string;
  size?: number;
}

function HomeIcon({ color = "#98A2B3", size = 22 }: HomeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M7.333 15.584h7.334M10.1 2.534L3.882 7.369c-.415.324-.623.485-.773.688-.132.179-.231.38-.291.596-.068.242-.068.505-.068 1.032v6.632c0 1.027 0 1.54.2 1.932.176.345.456.626.801.801.392.2.906.2 1.932.2h10.634c1.026 0 1.54 0 1.932-.2.345-.175.625-.456.801-.8.2-.393.2-.906.2-1.933V9.685c0-.527 0-.79-.068-1.032a1.833 1.833 0 00-.291-.596c-.15-.203-.358-.364-.773-.688L11.9 2.534c-.322-.25-.483-.376-.66-.424a.917.917 0 00-.48 0c-.177.048-.338.173-.66.424z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default HomeIcon;
