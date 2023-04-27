import { FC } from "react";

type ShadowButtonProps = {
  title: string;
  iconSvg?: any;
  border?: string;
  bgColor?: string;
  onClick: Function;
  textColor: string;
};

export const ShadowButton: FC<ShadowButtonProps> = ({
  title,
  iconSvg,
  border,
  bgColor,
  onClick,
  textColor,
}) => {
  return (
    <div
      className={`flex flex-row items-center gap-2 justify-center px-5 py-2.5 ${
        border ?? ""
      } ${bgColor} hover:cursor-pointer`}
      onClick={() => onClick!()}
    >
      {iconSvg ?? null}
      <h1 className={`${textColor} font-semibold text-sm`}>{title}</h1>
    </div>
  );
};
