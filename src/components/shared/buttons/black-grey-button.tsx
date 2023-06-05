import { FC } from "react";
import Button from "./button";
import clsx from "clsx";
import { IButtonProps } from "./button";


interface SelectableButton extends IButtonProps {
    isActive?: boolean,
}

const BlackGreyButton: FC<SelectableButton> = ({ children, isActive, ...props }) => {
    return (
        <Button className={clsx("w-full py-3.5 rounded-lg font-bold text-sm", { "bg-blue-3 text-blue-1": isActive, "bg-black-2 text-grey-8": !isActive, })} {...props}>
            {children}
        </Button>
    )
}

export default BlackGreyButton;