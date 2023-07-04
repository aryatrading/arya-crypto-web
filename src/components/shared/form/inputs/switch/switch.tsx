import { FC } from "react";
import * as Switch from '@radix-ui/react-switch';
import clsx from "clsx";

const SwitchInput: FC<{ checked: boolean, onClick?: () => void, bigSize?: boolean }> = ({ bigSize = false, checked, onClick }) => {
    return (
        <Switch.Root checked={checked} onClick={onClick} className={clsx({ "w-[25px] h-[8px]": !bigSize, "w-[40px] h-[20px]": bigSize }, "dark:bg-blue-3 bg-grey-1 rounded-full relative data-[state=checked]:bg-blue-4 outline-none cursor-pointer")}>
            <Switch.Thumb className={clsx({ "w-[15px] h-[15px]": !bigSize, "w-[20px] h-[20px] mt-1": bigSize }, "block dark:bg-white bg-grey-8 rounded-full transition-transform duration-100 translate-x-[-7.5px] translate-y-[-3.5px] will-change-transform data-[state=checked]:translate-x-[20px]")} />
        </Switch.Root>
    )
}

export default SwitchInput;