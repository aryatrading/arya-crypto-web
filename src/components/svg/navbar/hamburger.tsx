import { SVGProps } from "react";

function HamburgerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" {...props}>
      <path
        d="M1 13H15"
        stroke={props.color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 7H15"
        stroke={props.color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 1H15"
        stroke={props.color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default HamburgerIcon;
