import { FC, useMemo } from "react";
import { Col, Row } from "../../../../../shared/layout/flex";
import Button from "../../../../../shared/buttons/button";
import { useTranslation } from "next-i18next";
import styles from "./smart-allocation-holdings-tab.module.scss";
import { percentageFormat, priceFormat } from "../../../../../../utils/helpers/prices";
import Image from "next/image";
import clsx from "clsx";

const SmartAllocationHoldingsTab:FC<{smartAllocationHoldings:any[]}> = ({smartAllocationHoldings}) => {

    const {t} = useTranslation();

    const portfolioComposition = useMemo(() => {
        return (
            <Col className="gap-2 w-full max-w-[500px]">
                <p className="font-bold">Portfolio composition</p>
                <Row className="h-3 w-full bg-blue-1 rounded-full overflow-hidden">
                    <Row className="h-full flex-1 bg-yellow-1" />
                    <Row className="h-full flex-1 bg-[#558AF2]" />
                    <Row className="h-full flex-1 bg-[#E6007A]" />
                    <Row className="h-full flex-1 bg-[#224DDA]" />
                </Row>
            </Col>
        )
    }, [])

    const table = useMemo(() => {

        const totalPortfolioAmountInUSD  = 1;
        return (
            <Row className="flex-[3] overflow-auto">
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t("common:name")}</th>
                            <th>{t("common:24hP/L")}</th>
                            <th>{t("common:currentPrice")}</th>
                            <th>Holding Quantity</th>
                            <th>Holding Value</th>
                            <th>Set weight</th>
                            <th>Current weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!smartAllocationHoldings.length ?
                            <tr>
                                <td colSpan={7} className="row-span-full">{t("common:noAssets")}</td>
                            </tr>
                            : smartAllocationHoldings.map(asset => {
                                const isPriceChangePositive = asset.asset_details.price_change_percentage_24h > 0;
                                const signal = isPriceChangePositive ? '+' : '-';

                                const formattedChangePercentage = `${signal}${percentageFormat(Math.abs(asset.asset_details.price_change_percentage_24h))}`;
                                const formattedChangePrice = `${signal}$${priceFormat(Math.abs(asset.asset_details.price_change_24h))}`;

                                const assetPortfolioPercentage = asset.current_value / totalPortfolioAmountInUSD * 100;

                                return (
                                    <tr key={asset.name}>
                                        <td>
                                            <Row className="gap-3 items-center">
                                                <Image src={asset.asset_details.image} alt="" width={23} height={23} />
                                                <p>{asset.asset_details.name}</p>
                                                <span className="text-sm text-grey-1">{asset.name}</span>
                                            </Row>
                                        </td>
                                        <td>
                                            <Row className="justify-between items-center w-[120px]">
                                                <p>{percentageFormat(asset.current_value / totalPortfolioAmountInUSD * 100)}%</p>
                                                <Row className="h-[5px] rounded-full w-[50px] bg-white">
                                                    <Row className={`h-full rounded-full bg-blue-1`} style={{
                                                        width: `${Math.ceil(assetPortfolioPercentage)}%`
                                                    }} />
                                                </Row>
                                            </Row>
                                        </td>
                                        <td>{priceFormat(asset.current_amount)} {asset.name}</td>
                                        <td>${priceFormat(asset.asset_details.current_price)}</td>
                                        <td>${priceFormat(asset.current_amount * asset.asset_details.current_price)}</td>
                                        <td className={clsx({ "text-green-1": isPriceChangePositive, "text-red-1": !isPriceChangePositive })}>{formattedChangePercentage}% ({formattedChangePrice})</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </Row>
        )
    }, [smartAllocationHoldings, t])


    const reBalanceNow = useMemo(() => {
        return (
            <Col className="flex-1 gap-5">
                <Button className="w-full bg-blue-1 py-2.5 px-5 rounded-md font-bold">Rebalance now</Button>
                <Col className="gap-4">
                    <p className="font-bold text-grey-1">Automation</p>
                    <p className="font-bold">Automatic rebalancing scheduled <span className="text-blue-1">Monthly</span></p>
                    <p className="font-bold">Next rebalancing schedule : <span className="text-blue-1">01/12/2023</span></p>
                    <p className="font-bold text-grey-1">Exit Strategy</p>
                    <p className="font-bold">When biticoin drops by 5% sell 50% of your portfolio for USDT</p>
                </Col>
            </Col>
        )
    }, [])

    return (
        <Col className="gap-10">
            <Row className="gap-10 items-center">
                <Button className="bg-blue-1 py-2.5 px-5 rounded-md font-bold">Edit Portfolio</Button>
                {portfolioComposition}
            </Row>

            <Row className="w-full">
                {table}
                {reBalanceNow}
            </Row>
        </Col>
    )
}

export default SmartAllocationHoldingsTab;