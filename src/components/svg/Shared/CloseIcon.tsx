
function CloseIcon(props:React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 14 14" fill="none" {...props}>
      <path
        d="M13 13L1 1M13 1L1 13"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default CloseIcon;
