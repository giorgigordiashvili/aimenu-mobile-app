import * as React from "react";
import Svg, { Path } from "react-native-svg";

function FavoritesIcon() {
  return (
    <Svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        clipRule="evenodd"
        d="M7.496 3.21c-1.25-1.461-3.334-1.854-4.9-.516C1.032 4.03.812 6.268 2.04 7.85c1.022 1.316 4.116 4.09 5.13 4.988.114.1.17.15.236.17.058.018.121.018.18 0 .065-.02.122-.07.235-.17 1.014-.898 4.108-3.672 5.13-4.988 1.23-1.582 1.036-3.833-.556-5.156-1.593-1.324-3.65-.945-4.9.516z"
        stroke="#232D61"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default FavoritesIcon;
