import clsx from "clsx";
import { FC } from "react";
import { FlexComponentType } from "./flex.type";

export const Row: FC<FlexComponentType> = ({
    children,
    className,
    ...props
}) => <div {...props} className={clsx("flex flex-row", className)}>{children}</div>;

export const Col: FC<FlexComponentType> = ({
    className,
    children,
    ...props
}) => <div {...props} className={clsx('flex flex-col', className)}>{children}</div>;