import { FC } from "react";
import { Field } from "formik";

import { Col } from "../../../layout/flex";

import "./input.module.scss";

export const TextInput:FC<{label: string, type: string, name: string, placeholder?: string}> = ({label, ...props}) => (
    <Col className="gap-2">
        {label && <label className="block text-sm dark:text-white font-semibold">{label}</label>}
        <Field className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...props} />
    </Col>
);

export default TextInput;