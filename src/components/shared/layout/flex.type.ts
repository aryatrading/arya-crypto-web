import { HTMLAttributes, LegacyRef, DetailedHTMLProps } from "react";

export interface FlexComponentType extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    reference?:LegacyRef<HTMLDivElement> | undefined;
}
