import Image, { ImageProps } from "next/image";
import { FC, useState } from "react";

const AssetImage: FC<ImageProps> = ({ src, ...props }) => {

    const [imageSrc, setImageSrc] = useState(src);

    return (
        <Image
            onErrorCapture={() => {
                setImageSrc('/assets/images/svg/defaultAssetIcon.svg');
            }}
            src={imageSrc}
            {...props}
        />
    )
}


export default AssetImage;