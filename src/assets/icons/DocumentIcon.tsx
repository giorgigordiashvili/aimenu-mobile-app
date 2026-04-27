import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
}

function DocumentIcon({ size = 42, color = "#232D61" }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M15.657 18.266l3.48 3.479 7.827-7.828m7.828 22.614V13.57c0-2.923 0-4.384-.569-5.5a5.218 5.218 0 00-2.28-2.281c-1.117-.57-2.578-.57-5.5-.57H15.308c-2.923 0-4.384 0-5.5.57a5.219 5.219 0 00-2.281 2.28c-.569 1.117-.569 2.578-.569 5.5v22.963l4.784-3.479 4.349 3.48 4.784-3.48 4.784 3.48 4.349-3.48 4.783 3.48z"
        stroke={color}
        strokeWidth={4.175}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default DocumentIcon;
