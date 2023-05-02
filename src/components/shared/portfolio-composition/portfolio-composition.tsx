import { FC, useCallback } from "react";
import { Col, Row } from "../layout/flex";


type PortfolioCompositionAssetType = {
    name: string,
    weight: number,
}
const backgroundColorClass = ['bg-yellow-1', 'bg-[#558AF2]', 'bg-[#E6007A]', 'bg-[#224DDA]']

export const PortfolioComposition: FC<{ portfolioAssets?: PortfolioCompositionAssetType[] }> = ({ portfolioAssets }) => {

    const assetLine = useCallback((asset: PortfolioCompositionAssetType, index: number) => {
        return <Row className={`h-full ${backgroundColorClass[index % (backgroundColorClass.length)]}`} style={{ width: `${asset.weight * 100}%` }} />
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