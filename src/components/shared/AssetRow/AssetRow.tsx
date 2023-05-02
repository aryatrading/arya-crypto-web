import React from 'react'
import { Row } from '../layout/flex'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

export interface IAssetRowProps {
    icon: string,
    name: string,
    symbol: string,
    className?: string
}

const AssetRow = ({icon,name,symbol,className}:IAssetRowProps) => {
  return (
    <Row className={twMerge("items-center gap-6 justify-start",className)}>
        <Image
            className="w-7 h-7 rounded-full"
            src={icon}
            alt={`${name}-icon`}
            width={28}
            height={28}
        />
        <div className='flex justify-between items-center gap-2'>
            <span className="text-white truncate max-w-[150px]">
                {name}
            </span>
            <span className="text-grey-1 text-sm ">
                {symbol?.toUpperCase()}
            </span>
        </div>
    </Row>
  )
}

export default AssetRow