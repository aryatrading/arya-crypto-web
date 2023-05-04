import { FC, useCallback } from "react";

import { Col, Row } from "../../../layout/flex";
import { CloseIcon } from "../../../../svg/close";
import Button from "../../../buttons/button";


export const InputWithTag: FC<{ label: string, placeholder?: string, symbol?: string, onChange?: any, value?: string | number, onClear?: any }> = ({ label, symbol, ...props }) => {
    const onClear = useCallback(() => {
        if (props?.onClear) {
            props.onClear();
        }
    }, [props]);
    return (
        <Col className="gap-2 relative">
            {label && <label className="block text-sm text-grey-1 font-light">{label}</label>}
            <Row className="flex h-[50px]">
                <span className="inline-flex rounded-l-xl items-center px-5 text-2xl border-[2px] border-r-0 text-yellow-1 bg-grey-3 border-grey-2">
                    {symbol || "$"}
                </span>
                <input type="number" min={0} className="rounded-none rounded-r-lg bg-black-1 caret-yellow-1 text-white border-[2px] focus:ring-transparent focus:border-grey-2 block flex-1 min-w-0 w-full text-sm p-2.5 border-l-0 border-grey-2" placeholder={props?.placeholder || ''} {...props} />

                {!!props.value && <Button className="absolute right-3 bottom-[16px] bg-grey-3 px-1.5 py-1.5 rounded-xl" onClick={onClear}>
                    <CloseIcon />
                </Button>}
            </Row>
        </Col>
    )
};

export default InputWithTag;