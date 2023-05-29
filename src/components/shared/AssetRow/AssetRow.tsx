import React from 'react'
import { Row } from '../layout/flex'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { AssetType } from '../../../types/asset'

export interface IAssetRowProps {
    icon: AssetType['iconUrl'],
    name: AssetType['name'],
    symbol: AssetType['symbol'],
    className?: string
}

const AssetRow = ({ icon, name, symbol, className }: IAssetRowProps) => {
    return (
        <Row className={twMerge("items-center gap-3 md:gap-6 justify-start", className)}>
            {!!icon &&
                <Image
                    className="w-5 h-5 rounded-full hidden md:block md:w-7 md:h-7"
                    src={icon}
                    alt={`${name}-icon`}
                    width={28}
                    height={28}
                />
            }
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-2'>
                <span className="text-white truncate max-w-[150px] md:text-base text-sm">
                    {name}
                </span>
                <span className="text-grey-1 text-xs md:text-sm ">
                    {symbol?.toUpperCase()}
                </span>
            </div>
        </Row>
    )
}

export default AssetRow