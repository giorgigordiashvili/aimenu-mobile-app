import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface CardArrowProps {
  color?: string;
}

function CardArrow({ color = "#000" }: CardArrowProps) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M7.5 15l5-5-5-5"
        stroke={color}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CardArrow;
