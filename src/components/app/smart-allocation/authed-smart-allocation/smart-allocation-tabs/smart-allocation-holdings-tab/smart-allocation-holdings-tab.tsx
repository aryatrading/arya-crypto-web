import { FC, useMemo } from "react";
import { Col, Row } from "../../../../../shared/layout/flex";
import Button from "../../../../../shared/buttons/button";
import { useTranslation } from "next-i18next";
import styles from "./smart-allocation-holdings-tab.module.scss";
import { percentageFormat, priceFormat } from "../../../../../../utils/helpers/prices";
import Image from "next/image";
import { CustomizeAllocationIcon } from "../../../../../svg/smart-allocation/customize-portfolio-icon";
import { SmartAllocationAssetType } from "../../../../../../types/smart-allocation.types";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { selectAssetLivePrice } from "../../../../../../services/redux/marketSlice";
import PortfolioComposition from "../../../../../shared/portfolio-composition/portfolio-composition";
import Link from "next/link";
import { USDTSymbol } from "../../../../../../utils/constants/market";

const SmartAllocationHoldingsTab: FC<{ smartAllocationHoldings: SmartAllocationAssetType[], smartAllocationTotalEvaluation: number }> = ({ smartAllocationHoldings, smartAllocationTotalEvaluation }) => {

    const { t } = useTranslation();

    // const selectAssets = useSelector(selectAssetLivePrice);

    // console.log({selectAssets})

    const portfolioComposition = useMemo(() => {
        return (
            <PortfolioComposition portfolioAssets={smartAllocationHoldings.map(asset => {
                return {
                    name: asset.name,
                    weight: (asset.current_value ?? 0) / (smartAllocationTotalEvaluation ?? 1)
                };
            })} />
        )
    }, [smartAllocationHoldings, smartAllocationTotalEvaluation])

    const table = useMemo(() => {
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
                                <td colSpan={7} className="row-span-full">
                                    <Col className="w-full p-10 gap-5 items-center justify-center">
                                        <CustomizeAllocationIcon />
                                        <p className="font-bold">Start customising your portfolio</p>
                                        <Button className="py-3 px-10 bg-blue-3 rounded-md">Create portfolio</Button>
                                    </Col>
                                </td>
                            </tr>
                            : smartAllocationHoldings.map((asset, index) => {

                                const setWeight = asset.current_weight ?? 0;
                                const currentWeight = (asset.current_value ?? 0) / (smartAllocationTotalEvaluation ?? 1);
                                const isCurrentWeightMoreThanSetWeight = currentWeight >= setWeight;

                                return (
                                    <tr key={asset.name}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <Row className="gap-3 items-center">
                                                <Image src={""} alt="" width={23} height={23} />
                                                <p>{asset.name}</p>
                                                <span className="text-sm text-grey-1">{asset.name}</span>
                                            </Row>
                                        </td>
                                        <td>
                                            ??%
                                        </td>
                                        <td>${priceFormat(asset.ask_price, true)}</td>
                                        <td>{priceFormat(asset.available, true)}</td>
                                        <td>${priceFormat(asset.current_value, true)}</td>
                                        <td className="">
                                            <Row className="gap-2 items-center">
                                                <p>
                                                    {percentageFormat(setWeight * 100)}%
                                                </p>
                                                <Row className="w-16 rounded-full overflow-hidden bg-white" style={{ height: 10 }}>
                                                    <Row
                                                        className={`bg-yellow-1 rounded-full`}
                                                        style={{
                                                            width: `${percentageFormat(setWeight * 100)}%`
                                                        }}
                                                    />
                                                </Row>
                                            </Row>
                                        </td>
                                        <td className={clsx({ "text-green-1": isCurrentWeightMoreThanSetWeight, "text-red-1": !isCurrentWeightMoreThanSetWeight })}>
                                            {percentageFormat(currentWeight * 100)}%
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>

            </Row>
        )
    }, [smartAllocationHoldings, smartAllocationTotalEvaluation, t])


    const reBalanceNow = useMemo(() => {
        return (
            <Col className="flex-1 gap-5">
                <Button className="w-full bg-blue-1 py-2.5 px-5 rounded-md font-bold">Rebalance now</Button>
                <Col className="gap-4">
                    <p className="font-bold text-grey-1">Automation</p>
                    <p className="font-bold">Automatic rebalancing scheduled <span className="text-blue-1">Monthly</span></p>
                    <p className="font-bold">Next rebalancing schedule : <span className="text-blue-1">01/12/2023</span></p>
                    <p className="font-bold text-grey-1">Exit Strategy</p>
                    <p className="font-bold">When biticoin drops by 5% sell 50% of your portfolio for {USDTSymbol}</p>
                </Col>
            </Col>
        )
    }, [])

    if (smartAllocationHoldings?.length) {

        return (
            <Col className="gap-10">
                <Row className="w-full gap-5 items-center">
                    <Row className="gap-10 flex-[3]">
                        <Link href="smart-allocation/edit" className="bg-blue-1 py-2.5 px-5 rounded-md font-bold shrink-0">Edit Portfolio</Link>
                        {portfolioComposition}
                    </Row>
                    <Row className="flex-1"></Row>
                </Row>
                <Row className="w-full gap-5">
                    {table}
                    {reBalanceNow}
                </Row>
            </Col>
        )
    } else {
        return (

            <Col className="w-full p-10 gap-5 items-center justify-center">
                <CustomizeAllocationIcon />
                <p className="font-bold">Start customising your portfolio</p>
                <Button className="py-3 px-10 bg-blue-3 rounded-md">Create portfolio</Button>
            </Col>
        );

    }
}

export default SmartAllocationHoldingsTab;