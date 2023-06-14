import React from 'react';
import * as Switch from '@radix-ui/react-switch';
import { twMerge } from 'tailwind-merge';
import _ from 'lodash';

interface ISwitchDemo {
    beforeLabel?:string,
    afterLabel?:string,
    labelClassName?:string,
    checked:boolean,
    onCheckedChange:(checked: boolean) => void
}

const SwitchDemo = ({beforeLabel,afterLabel,labelClassName,checked,onCheckedChange}:ISwitchDemo) => {

    const switchId = `switch-${_.uniqueId()}`
    
    const getLabel = (label:string|undefined) => {
        if(label){
            return <label className={twMerge("text-white text-base font-semibold",labelClassName)} htmlFor={switchId}>
            {label}
        </label>
        }
    }
    return(
        <div className="flex items-center gap-4">
            {getLabel(beforeLabel)}
                <Switch.Root
                    className="w-[40px] h-[20px] px-1 rounded-full relative bg-white data-[state=checked]:bg-black outline-none cursor-default"
                    id={switchId}
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                >
                    <Switch.Thumb className="block w-[15px] h-[15px] bg-blue-1 rounded-full transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[18px]" />
                </Switch.Root>
            {getLabel(afterLabel)}
        </div>
    )
  }


export default SwitchDemo;