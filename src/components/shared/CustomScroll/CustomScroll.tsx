import React from 'react'
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { twMerge } from 'tailwind-merge';


interface ICustomScrollProps {
    className?: string
    height: string
    children: React.ReactNode
}

const CustomScroll = ({className,children,height}:ICustomScrollProps) => {
  return (
    <ScrollArea.Root className={twMerge('w-full overflow-hidden',height,className)}>
      <ScrollArea.Viewport className="w-full h-full">
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-grey-4 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-grey-2 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-grey-1 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="horizontal"
      >
        <ScrollArea.Thumb className="flex-1 bg-grey-2 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="bg-grey-1" />
    </ScrollArea.Root>
  )
}

export default CustomScroll