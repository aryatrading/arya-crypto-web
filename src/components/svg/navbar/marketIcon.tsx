
import { SVGProps } from "react";

export function MarketDefault (props:SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 22 21" fill="none" {...props}>
      <circle cx={11.461} cy={10.5} r={9.5} stroke="#F9FAFB" strokeWidth={2} />
      <rect
        x={10.361}
        y={6.88}
        width={2.2}
        height={7.24}
        rx={1.1}
        fill="#F9FAFB"
        stroke="#F9FAFB"
        strokeWidth={2}
      />
    </svg>
  );
}

export function MarketHover(props:SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="10.5" cy="10.5" r="9.5" fill="#5388EF" stroke="#5388EF" stroke-width="2"/>
      <rect x="8.40039" y="5.87988" width="4.2" height="9.24" rx="2.1" fill="#121212"/>
    </svg>

  );
}

