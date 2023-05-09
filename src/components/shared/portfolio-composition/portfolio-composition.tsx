import { FC, useCallback } from "react";
import { Col, Row } from "../layout/flex";
import * as Tooltip from '@radix-ui/react-tooltip';


type PortfolioCompositionAssetType = {
    name: string,
    weight: number,
}
const backgroundColorClass = ['bg-yellow-1', 'bg-[#558AF2]', 'bg-[#E6007A]', 'bg-[#224DDA]']

export const PortfolioComposition: FC<{ portfolioAssets?: PortfolioCompositionAssetType[] }> = ({ portfolioAssets }) => {

    const assetLine = useCallback((asset: PortfolioCompositionAssetType, index: number) => {
        return (
            <Row className={`h-full ${backgroundColorClass[index % (backgroundColorClass.length)]}`} style={{ width: `${asset.weight * 100}%` }} >
                <Tooltip.Provider delayDuration={0}>
                    <Tooltip.Root>
                        <Tooltip.Trigger className="w-full h-full">
                            <Row className="w-full h-full items-center justify-center"></Row>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content className={`data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] text-white font-bold ${backgroundColorClass[index % (backgroundColorClass.length)]}`} sideOffset={5}>
                                {asset.name}
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>
            </Row>
        )
    }, []);

    return (
        <Col className="gap-2 w-full">
            <p className="font-bold">Portfolio composition</p>
            <Row className="h-3 w-full bg-blue-1 rounded-full overflow-hidden">
                {portfolioAssets?.map((asset, index) => assetLine(asset, index))}
            </Row>
        </Col>
    )
}

export default PortfolioComposition;