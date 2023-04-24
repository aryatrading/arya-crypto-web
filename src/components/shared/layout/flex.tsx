import clsx from "clsx";
import { FC } from "react";
import { FlexComponentType } from "./flex.type";

export const Row: FC<FlexComponentType> = ({
    children,
    className,
    reference
}) => <div className={clsx("flex flex-row", className)} ref={reference}>{children}</div>;

export const Col: FC<FlexComponentType> = ({
    className,
    children,
    reference
}) => <div className={clsx('flex flex-col', className)} ref={reference}>{children}</div>;