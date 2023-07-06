import { FC } from "react";
import { Field } from "formik";

import { Col } from "../../../layout/flex";

import "./input.module.scss";

export const TextInput:FC<{label: string, type: string, name: string, placeholder?: string}> = ({label, ...props}) => (
    <Col className="gap-2">
        {label && <label htmlFor={label} className="block text-sm text-white font-semibold">{label}</label>}
        <Field id={label} autoComplete='on' className=" border  text-sm rounded-lg block w-full p-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" {...props} />
    </Col>
);

export default TextInput;