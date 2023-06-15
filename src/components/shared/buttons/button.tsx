import { FC } from "react";
import React from "react";
import LoadingSpinner from "../loading-spinner/loading-spinner";

export interface IButtonProps extends React.HTMLProps<HTMLButtonElement> {
  isLoading?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}
export const Button: FC<IButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  isLoading = false,
  ...props
}) => (
  <button onClick={onClick} disabled={disabled} type={type} {...props}>
    {isLoading ? <LoadingSpinner /> : children}
  </button>
);

export default Button;
