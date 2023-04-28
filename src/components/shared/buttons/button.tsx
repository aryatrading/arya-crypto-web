import { FC } from "react";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import React from "react";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  isLoading?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}
export const Button: FC<ButtonProps> = ({
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
