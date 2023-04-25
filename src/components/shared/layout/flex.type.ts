import { HTMLAttributes } from "react";
import { DetailedHTMLProps } from "react";
import { LegacyRef } from "react";

export interface FlexComponentType extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    reference?:LegacyRef<HTMLDivElement> | undefined;
}
