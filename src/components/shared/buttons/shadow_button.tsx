import { FC } from "react";

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
}) => {
  return (
    <div
      className={`flex flex-row items-center gap-2 justify-center ${px} ${py} ${
        border ?? ""
      } ${bgColor} hover:cursor-pointer`}
      onClick={() => onClick!()}
    >
      {iconSvg ?? null}
      {title && <span className={`${textColor} ${textSize} font-semibold text-sm`}>{title}</span>}
    </div>
  );
};
