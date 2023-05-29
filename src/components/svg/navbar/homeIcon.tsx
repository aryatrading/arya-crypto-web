import { SVGProps } from "react";

export function HomeHover(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 21 22" fill="none" {...props}>
      <path
        d="M19.579 8.914l-7.875-6.891a1.125 1.125 0 00-1.482 0l-7.875 6.89a1.125 1.125 0 00-.384.847v9.615c0 .621.504 1.125 1.125 1.125h4.5c.621 0 1.125-.504 1.125-1.125v-4.5c0-.622.504-1.125 1.125-1.125h2.25c.621 0 1.125.503 1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h4.5c.621 0 1.125-.504 1.125-1.125V9.76c0-.324-.14-.633-.384-.846z"
        fill="#5388EF"
        stroke="#5388EF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HomeDefault(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 21 22" fill="none" {...props}>
      <path
        d="M19.116 8.914L11.24 2.023a1.125 1.125 0 00-1.482 0l-7.875 6.89a1.125 1.125 0 00-.384.847v9.615c0 .621.504 1.125 1.125 1.125h4.5c.621 0 1.125-.504 1.125-1.125v-4.5c0-.622.504-1.125 1.125-1.125h2.25c.621 0 1.125.503 1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h4.5c.621 0 1.125-.504 1.125-1.125V9.76c0-.324-.14-.633-.384-.846z"
        fill="#6B7280"
        stroke="#6B7280"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default HomeDefault;
