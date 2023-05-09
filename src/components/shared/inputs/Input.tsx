import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  className?: string
}

const Input: FC<InputProps> = ({className,...props}) => {
  return (
    <input className={twMerge('bg-transparent focus-visible:outline-none',className)} {...props} />
  )
}

interface InputWithIconProps extends InputProps {
    icon: React.ReactNode,
    className?: string,
    InputClassName?: string
}
const InputWithIcon:FC<InputWithIconProps> = ({icon, className, InputClassName, ...props}) => {
    return (
        <div className={twMerge('flex gap-2 items-center',className)}>
            {icon}
            <Input {...props} className={twMerge("w-full",InputClassName)} />
        </div>
    )
}

export {InputWithIcon}
export default Input