import React, { useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

import { Col, Row } from '../layout/flex'
import { AssetType } from '../../../types/asset'
import { useResponsive } from '../../../context/responsive.context'

export interface IAssetRowProps {
    icon: AssetType['iconUrl'],
    name: AssetType['name'],
    symbol: AssetType['symbol'],
    className?: string,
    showIcon?: boolean,
}

const AssetRow = ({ icon, name, symbol, className, showIcon }: IAssetRowProps) => {
    const { isTabletOrMobileScreen } = useResponsive();
    const [errorLoadingIcon, setErrorLoadingIcon] = useState<boolean>(false);
    return (
        <Row className={twMerge("items-center gap-3 md:gap-6 justify-start", className)}>
            {!!icon &&
                (errorLoadingIcon ?
                    <Col className='w-10 h-10 bg-grey-4 rounded-full items-center justify-center'>
                        <p className='font-bold text-sm'>{name?.slice(0, 1)}</p>
                    </Col>
                    :
                    <Image
                        className={clsx({ "hidden": isTabletOrMobileScreen && !showIcon, "block": showIcon, }, "w-5 h-5 rounded-full md:w-7 md:h-7")}
                        src={icon}
                        alt={`${name}-icon`}
                        width={28}
                        height={28}
                        onErrorCapture={() => setErrorLoadingIcon(true)}
                    />)
            }
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-[2px] md:gap-2'>
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