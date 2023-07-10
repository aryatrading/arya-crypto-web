import { SVGProps } from "react";

export function PortfolioDefault(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 21 21" fill="none" {...props}>
      <path
        d="M10.5 20a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.833 17.361L10.5 10.5V1M10.5 10.5H20"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}



export function PortfolioHover(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M18 10.5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z"
        fill="#5388EF"
        stroke="#5388EF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.833 17.361L9.5 10.5V1M9.5 10.5H19"
        className="dark:stroke-black-2 stroke-white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default PortfolioHover;
