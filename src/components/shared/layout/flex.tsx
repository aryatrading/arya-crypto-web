import clsx from "clsx";
import { FC } from "react";
import { FlexComponentType } from "./flex.type";

export const Row: FC<FlexComponentType> = ({
    children,
    className,
    reference,
    ...props
}) => <div className={clsx("flex flex-row", className)} ref={reference} {...props}>{children}</div>;

export const Col: FC<FlexComponentType> = ({
    className,
    children,
    reference,
    ...props
}) => <div className={clsx('flex flex-col', className)} ref={reference} {...props}>{children}</div>;