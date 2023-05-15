import { FC, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { screens } from "tailwindcss/defaultTheme";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";

import { Col, Row } from "../../../../../shared/layout/flex";
import Button from "../../../../../shared/buttons/button";
import styles from "./smart-allocation-holdings-tab.module.scss";
import { percentageFormat, formatNumber } from "../../../../../../utils/helpers/prices";
import { CustomizeAllocationIcon } from "../../../../../svg/smart-allocation/customize-portfolio-icon";
import { SmartAllocationAssetType } from "../../../../../../types/smart-allocation.types";
import PortfolioComposition from "../../../../../shared/portfolio-composition/portfolio-composition";
import { USDTSymbol } from "../../../../../../utils/constants/market";
import AssetPnl from "../../../../../shared/containers/asset/assetPnl";

const SmartAllocationHoldingsTab: FC<{ smartAllocationHoldings: SmartAllocationAssetType[], smartAllocationTotalEvaluation: number }> = ({ smartAllocationHoldings, smartAllocationTotalEvaluation }) => {

    const { t } = useTranslation(['smart-allocation']);

    const isTabletOrMobileScreen = useMediaQuery({ query: `(max-width: ${screens.md})` })

    const portfolioComposition = useMemo(() => {
        return (
            <PortfolioComposition portfolioAssets={smartAllocationHoldings.map(asset => {
                return {
                    name: (asset.name ?? ''),
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
                            <th>{t('holdingQuantity')}</th>
                            <th>{t('holdingValue')}</th>
                            <th>{t('setWeight')}</th>
                            <th>{t('currentWeight')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {smartAllocationHoldings.map((asset, index) => {
                            if (asset.name !== USDTSymbol) {
                                const setWeight = asset.weight ?? 0;
                                const isCurrentWeightMoreThanSetWeight = (asset.current_weight ?? 0) >= setWeight;

                                return (
                                    <tr key={asset.name}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <Row className="gap-3 items-center">
                                                <Image src={asset?.asset_details?.asset_data?.image ?? ""} alt="" width={23} height={23} />
                                                <p>{asset.asset_details?.asset_data?.name}</p>
                                                <span className="text-sm text-grey-1">{asset.name}</span>
                                            </Row>
                                        </td>
                                        <td>
                                            <AssetPnl
                                                value={asset.asset_details?.asset_data?.price_change_percentage_24h ?? 0}
                                            />
                                        </td>
                                        <td>{formatNumber(asset?.ask_price ?? 0, true)}</td>
                                        <td>{formatNumber(asset?.available ?? 0)}</td>
                                        <td>{formatNumber(asset?.current_value ?? 0, true)}</td>
                                        <td className="">
                                            <Row className="gap-2 items-center">
                                                <p>
                                                    {percentageFormat(setWeight * 100)}%
                                                </p>
                                                <Row className="w-16 rounded-full overflow-hidden bg-white flex-1" style={{ height: 10 }}>
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
                                            {percentageFormat((asset.current_weight ?? 0) * 100)}%
                                        </td>
                                    </tr>
                                );
                            } else {
                                return <></>
                            }
                        })}
                    </tbody>
                </table>

            </Row>
        )
    }, [smartAllocationHoldings, t])


    const reBalanceNow = useMemo(() => {
        return (
            <Col className="flex-1 gap-5">
                <Row className="w-full gap-4 text-center">
                    {isTabletOrMobileScreen && <Link href="smart-allocation/edit" className="flex-1 bg-blue-1 py-4 px-5 rounded-md text-sm font-bold">{t('editPortfolio')}</Link>}
                    <Button className="flex-1 bg-blue-1 py-2.5 px-5 rounded-md text-sm font-bold">{t('RebalanceNow')}</Button>
                </Row>
                <Col className="gap-4">
                    <p className="font-bold text-grey-1">{t('automation')}</p>
                    <p className="text-sm font-bold">{t('automaticRebalancingScheduled')} <span className="text-blue-1">{t('common:monthly')}</span></p>
                    <p className="text-sm font-bold">{t('nextRebalancingSchedule')} : <span className="text-blue-1">01/12/2023</span></p>
                    <p className="font-bold text-grey-1">{t('common:exitStrategy')}</p>
                    <p className="text-sm font-bold">{t('WhenCoinDropsByXAmountSellYAmountOfYourPortfolioForUSDT', { coinName: "Bitcoin", dropPercent: "5%", sellPercent: "50%", USDTSymbol })}</p>
                </Col>
            </Col>
        )
    }, [isTabletOrMobileScreen, t])

    if (smartAllocationHoldings?.length) {

        return (
            <Col className="gap-10">
                {!isTabletOrMobileScreen && <Row className="w-full gap-5 items-center">
                    <Col className="gap-5 flex-1 max-w-full md:gap-10 md:flex-[3] md:flex-row">
                        <Link href="smart-allocation/edit" className="w-max bg-blue-1 py-2.5 px-5 rounded-md text-sm font-bold shrink-0">{t('editPortfolio')}</Link>
                        {portfolioComposition}
                    </Col>
                    <Row className="hidden md:flex md:flex-1"></Row>
                </Row>}
                <div className="flex flex-col-reverse w-full gap-5 md:flex-row">
                    {table}
                    {reBalanceNow}
                </div>
            </Col>
        )
    } else {
        return (

            <Col className="w-full p-10 gap-5 items-center justify-center">
                <CustomizeAllocationIcon />
                <p className="font-bold">{t('startCustomizingYourPortfolio')}</p>
                <Link href="/smart-allocation/edit" className="py-3 px-10 bg-blue-3 rounded-md">{t('createPortfolio')}</Link>
            </Col>
        );

    }
}

export default SmartAllocationHoldingsTab;