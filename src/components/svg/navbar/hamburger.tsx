import { SVGProps } from "react";

function HamburgerIcon(props:SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" {...props}>
      <path d="M1 13H15" stroke="#558AF2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M1 7H15" stroke="#558AF2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M1 1H15" stroke="#558AF2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export default HamburgerIcon;