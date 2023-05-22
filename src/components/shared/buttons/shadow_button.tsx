import { FC } from "react";

type ShadowButtonProps = {
  title: string;
  iconSvg?: any;
  border?: string;
  bgColor?: string;
  onClick: Function;
  textColor: string;
  px?: string;
  py?: string;
  textSize?: string;
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
  showBadge = false,
}) => {
  return (
    <div
      className={`flex flex-row items-center gap-2 justify-center ${px} ${py} ${
        border ?? ""
      } ${bgColor} hover:cursor-pointer`}
      onClick={() => onClick!()}
    >
      {iconSvg ?? null}
      <span className={`${textColor} ${textSize} font-semibold text-sm`}>
        {title}
      </span>
      {/* {showBadge === true ? (
        <div className="w-2 h-2 bg-red-1 rounded-full -mt-5" />
      ) : null} */}
    </div>
  );
};
