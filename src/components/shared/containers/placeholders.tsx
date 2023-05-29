import { FC } from "react";

interface compProps {
  content: string;
}

export const Placeholder: FC<compProps> = ({ content }) => {
  return (
    <div className="h-40 flex justify-center items-center">
      <p className="font-semibold text-lg">{content}</p>
    </div>
  );
};
