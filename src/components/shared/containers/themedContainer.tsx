import { FC } from "react";

type ThemedContainerProps = {
  colorClass: string;
  textColor: string;
  content: string;
};

export const ThemedContainer: FC<ThemedContainerProps> = ({
  colorClass,
  textColor,
  content,
}) => {
  return (
    <div
      className={`mt-5 ml-5 flex items-center justify-center w-20 h-8 rounded ${colorClass} ${textColor}`}
    >
      {content}
    </div>
  );
};
