import * as React from "react";

function UserDefaultIcon(props:React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 22 22" fill="none" {...props}>
      <path
        d="M10.71 21.418c5.914 0 10.708-4.794 10.708-10.709C21.418 4.795 16.624 0 10.71 0 4.795 0 0 4.795 0 10.71c0 5.914 4.795 10.708 10.71 10.708z"
        fill="#6B7280"
      />
      <path
        d="M10.708 12.44c-2.689 0-4.868 1.453-4.868 3.245h9.735c0-1.792-2.179-3.245-4.867-3.245zM10.708 10.277a2.704 2.704 0 100-5.409 2.704 2.704 0 000 5.409z"
        fill="#F9FAFB"
      />
    </svg>
  );
}

export default UserDefaultIcon;
