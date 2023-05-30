import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  className?: string
}

const Input: FC<InputProps> = ({className,...props}) => {
  return (
    <input className={twMerge('bg-transparent focus-visible:outline-none border-transparent focus:border-transparent focus:ring-0',className)} {...props} />
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