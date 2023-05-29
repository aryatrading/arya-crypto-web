import * as React from "react";

function LineGraphIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M19 1l-8 7-4-4-6 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export default LineGraphIcon;
