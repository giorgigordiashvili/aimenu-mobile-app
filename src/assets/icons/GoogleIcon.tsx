import * as React from "react";
import Svg, { Path } from "react-native-svg";

function GoogleIcon({
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
      <Path
        d="M13.928 6.797h-5.93v2.4h3.398c-.134.733-.6 1.399-1.266 1.799l1.999 1.532c1.2-1.132 1.866-2.732 1.866-4.598 0-.4-.067-.733-.067-1.133z"
        fill="#4285F4"
      />
      <Path
        d="M7.997 13.995c1.6 0 2.999-.533 3.998-1.466l-1.999-1.533c-.533.333-1.2.6-2 .6-1.532 0-2.865-1.067-3.331-2.466l-1.933 1.533c1 1.932 2.999 3.265 5.265 3.265v.067z"
        fill="#34A853"
      />
      <Path
        d="M4.665 9.13c-.133-.4-.2-.867-.2-1.333 0-.467.067-.933.2-1.333L2.732 4.931c-.533.933-.8 1.933-.8 3.066 0 1.133.267 2.132.8 3.065L4.665 9.53v-.4z"
        fill="#FBBC05"
      />
      <Path
        d="M7.997 4.198c.866 0 1.666.334 2.266.933L11.995 3.4c-1.066-1-2.465-1.466-3.998-1.466-2.266 0-4.265 1.332-5.265 3.265l1.933 1.533c.466-1.4 1.8-2.466 3.332-2.466v-.067z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export default GoogleIcon;
