import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function AppleIcon({
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
      <G clipPath="url(#clip0_213_1599)">
        <Path
          d="M9.01 3.525c.506-.626.853-1.492.76-2.359-.733.027-1.613.487-2.046.987a2.617 2.617 0 00-.633 1.972c.806.06 1.632-.333 1.919-.6zm3.385 6.071c.007-1.739 1.427-2.579 1.493-2.619-.813-1.186-2.08-1.346-2.526-1.366-1.072-.113-2.099.633-2.645.633-.547 0-1.4-.62-2.3-.6-1.179.02-2.265.687-2.872 1.747-1.226 2.119-.313 5.25.88 6.984.587.846 1.28 1.799 2.193 1.765.88-.033 1.212-.566 2.279-.566 1.06 0 1.36.566 2.265.547.947-.02 1.547-.853 2.126-1.706.66-.973.933-1.913.947-1.96-.02-.006-1.82-.7-1.84-2.859z"
          fill="#000"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_213_1599">
          <Path fill="#fff" d="M0 0H15.9939V15.9939H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default AppleIcon;
