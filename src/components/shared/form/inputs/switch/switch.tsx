import { FC } from "react";
import * as Switch from '@radix-ui/react-switch';

const SwitchInput: FC<{ checked: boolean, onClick?: () => void }> = ({ checked, onClick }) => {
    return (
        <Switch.Root checked={checked} onClick={onClick} className="w-[25px] h-[8px] bg-blue-3 rounded-full relative data-[state=checked]:bg-blue-4 outline-none cursor-pointer">
            <Switch.Thumb className="block w-[15px] h-[15px] bg-white rounded-full transition-transform duration-100 translate-x-[-7.5px] translate-y-[-3.5px] will-change-transform data-[state=checked]:translate-x-[20px]" />
        </Switch.Root>
    )
}

export default SwitchInput;