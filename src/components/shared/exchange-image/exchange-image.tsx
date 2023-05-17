import Image from "next/image";
import { FC, useMemo } from "react"
import OverallExchangeIcon from "../../svg/OverallExchangeIcon";

export const ExchangeImage: FC<{ providerId?: number, width?: number, height?: number }> = ({ providerId, width = 23, height = 23 }) => {

    return useMemo(() => {
        if (providerId) {
            return (
                <Image src={`https://aryatrading-content.s3.eu-west-1.amazonaws.com/arya_crypto/exchanges_icons/${providerId}.svg`} alt="" width={width} height={height}></Image>
            )
        } else {
            return <OverallExchangeIcon width={width} height={height}/>
        }
    }, [height, providerId, width]);
}

export default ExchangeImage;
