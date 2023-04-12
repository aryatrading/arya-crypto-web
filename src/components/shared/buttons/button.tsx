import clsx from "clsx";
import { FC } from "react";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import { ButtonProps } from "./button.types";
import "./button.module.scss";



export const Button:FC<ButtonProps> = ({
    children,
    className,
    onClick,
    type = 'button',
    disabled = false,
    form,
    id,
    isLoading
}) => (
    <button id={id} className={clsx(className)} onClick={onClick} disabled={disabled} type={type} form={form}>
        {isLoading ? <LoadingSpinner /> : children}
    </button>
);

export default Button;