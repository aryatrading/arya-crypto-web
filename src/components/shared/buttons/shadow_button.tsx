import { FC } from "react";
import { twMerge } from "tailwind-merge";

type ShadowButtonProps = {
  title?: string | null;
  iconSvg?: any;
  border?: string;
  bgColor?: string;
  onClick: Function;
  textColor: string;
  px?: string;
  py?: string;
  textSize?: string;
  className?: string;
  showBadge?: boolean;
};

export const ShadowButton: FC<ShadowButtonProps> = ({
  title,
  iconSvg,
  border,
  bgColor,
  onClick,
  textColor,
  px = "px-5",
  py = "py-2.5",
  textSize = "text-base",
  className,
  showBadge = false,
}) => {
  return (
    <div
      className={twMerge(
        "flex flex-row items-center gap-2 justify-center hover:cursor-pointer",
        px,
        py,
        border ?? "",
        bgColor,
        className
      )}
      onClick={() => onClick!()}
    >
      {iconSvg ?? null}
      {title && (
        <span className={twMerge(`font-semibold text-sm`, textColor, textSize)}>
          {title}
        </span>
      )}
      {showBadge ? <div className="w-2 h-2 bg-red-500 rounded -mt-5" /> : null}
    </div>
  );
};
