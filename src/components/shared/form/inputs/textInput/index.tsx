import { FC } from "react";
import { Field } from "formik";

import { Col } from "../../../layout/flex";

import "./input.module.scss";

export const TextInput: FC<{ label: string, type: string, name: string, placeholder?: string | null, disabled?: boolean, labelClassName?: string, className?: string }> = ({ label, labelClassName, ...props }) => (
    <Col className="gap-4">
        {label && <label className={labelClassName ? labelClassName : "block text-sm text-white font-semibold"}>{label}</label>}
        <Field max={new Date().toISOString().split('T')[0]} className={props.className ? props.className : "text-base rounded-lg text-start block w-full overflow-auto lg:w-full p-2.5 bg-grey-3 placeholder-grey-1 h-[48px] justify-center text-white border-none"} {...props} />
    </Col>
);

export default TextInput;