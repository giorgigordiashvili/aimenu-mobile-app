import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function FbIcon({
  size = 16,
  width,
  height,
}: {
  size?: number;
  width?: number;
  height?: number;
}) {
  const iconWidth = width ?? size;
  const iconHeight = height ?? size;
  return (
    <Svg
      width={iconWidth}
      height={iconHeight}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G clipPath="url(#clip0_213_1596)">
        <Path
          d="M6.065 15.788V10.47H4.416V8.026h1.649V6.973c0-2.722 1.231-3.983 3.904-3.983.267 0 .636.027.978.068.256.026.51.07.76.13v2.216a5.75 5.75 0 00-.435-.024c-1.764 0-1.95 1.113-1.95 2.268v1.05h2.757l-1.27 2.447H9.321v5.318H6.065v-.675z"
          fill="#1877F2"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_213_1596">
          <Path fill="#fff" d="M0 0H15.9939V15.9939H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default FbIcon;
