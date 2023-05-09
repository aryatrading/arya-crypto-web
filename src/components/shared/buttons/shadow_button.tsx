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
}) => {
  return (
    <div
      className={`flex flex-row items-center gap-2 justify-center ${px} ${py} ${
        border ?? ""
      } ${bgColor} hover:cursor-pointer`}
      onClick={() => onClick!()}
    >
      {iconSvg ?? null}
      <h3 className={`${textColor} font-semibold text-sm`}>{title}</h3>
    </div>
  );
};
