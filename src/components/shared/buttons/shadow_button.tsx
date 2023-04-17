import { FC } from "react";

type ShadowButtonProps = {
  title: string;
  iconSvg?: FC;
  border?: string;
  bgColor?: string;
};

export const ShadowButton: FC<ShadowButtonProps> = ({ title }) => {
  return (
    <div className="bg-red-500">
      <h1>{title}</h1>
    </div>
  );
};
