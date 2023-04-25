import { LegacyRef, MutableRefObject } from "react";

export interface FlexComponentType {
    children?: any;
    className?: string;
    reference?:LegacyRef<HTMLDivElement> | undefined;
    id?: string;
}
