import { FC, useMemo } from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { Col, Row } from "../../../../../shared/layout/flex";
import styles from "./smart-allocation-holdings-tab.module.scss";
import { percentageFormat, formatNumber } from "../../../../../../utils/helpers/prices";
import { CustomizeAllocationIcon } from "../../../../../svg/smart-allocation/customize-portfolio-icon";
import { SmartAllocationAssetType } from "../../../../../../types/smart-allocation.types";
import { USDTSymbol } from "../../../../../../utils/constants/market";
import AssetPnl from "../../../../../shared/containers/asset/assetPnl";
import { useResponsive } from "../../../../../../context/responsive.context";
import { getCoinColor } from "../../../../../../utils/helpers/coinsColors";
import { chartDefaultColorsHex } from "../../../../../../utils/constants/customColors";
import { TableRowSkeleton } from "../../../../../shared/skeletons/skeletons";

const SmartAllocationHoldingsTab: FC<{ smartAllocationHoldings: SmartAllocationAssetType[], isLoading: boolean }> = ({ smartAllocationHoldings, isLoading }) => {

    const { t } = useTranslation(['smart-allocation']);

    const { isTabletOrMobileScreen } = useResponsive();

    const tableHeader = useMemo(() => {
        if (isTabletOrMobileScreen) {
            return (
                <thead>
                    <tr>
                        <th>{t("common:name")}</th>
                        <th>{t('holdingValue')}</th>
                        <th>{t('common:weight')}</th>
                    </tr>
                </thead>
            );
        } else {
            return (
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t("common:name")}</th>
                        <th>{t("common:24hP/L")}</th>
                        <th>{t("common:currentPrice")}</th>
                        <th>{t('holdingQuantity')}</th>
                        <th>{t('holdingValue')}</th>
                        <th>{t('currentWeight')}</th>
                        <th>{t('setWeight')}</th>
                    </tr>
                </thead>
            );
        }
    }, [isTabletOrMobileScreen, t]);


    const tableLoadingSkeleton = useMemo(() => {
        if (isTabletOrMobileScreen) {
            return (
                <>
                    <TableRowSkeleton numberOfColumns={3} />
                    <TableRowSkeleton numberOfColumns={3} />
                    <TableRowSkeleton numberOfColumns={3} />
                    <TableRowSkeleton numberOfColumns={3} />
                    <TableRowSkeleton numberOfColumns={3} />
                </>
            )
        } else {
            return (
                <>
                    <TableRowSkeleton numberOfColumns={8} />
                    <TableRowSkeleton numberOfColumns={8} />
                    <TableRowSkeleton numberOfColumns={8} />
                    <TableRowSkeleton numberOfColumns={8} />
                </>
            )
        }
    }, [isTabletOrMobileScreen]);

    const tableBody = useMemo(() => {

        if (!smartAllocationHoldings.length) {
            if (isLoading) {
                return tableLoadingSkeleton;
            } else {
                return (
                    <tr>
                        <td colSpan={8} className="row-span-full">{t("common:noAssets")}</td>
                    </tr>
                )
            }
        } else {
            return smartAllocationHoldings.map((asset, index) => {
                const setWeight = asset.weight ?? 0;
                const isCurrentWeightMoreThanSetWeight = (asset.current_weight ?? 0) >= setWeight;
                const coinColor = getCoinColor(asset.name ?? "", index);

                if (isTabletOrMobileScreen) {
                    return (
                        <tr key={asset.name}>
                            <td>
                                <Col className="gap-1">
                                    <p>{asset.asset_details?.asset_data?.name}</p>
                                    <span className="text-sm text-grey-1">{asset.name}</span>
                                </Col>
                            </td>
                            <td>
                                <Col className="gap-3">
                                    <p>{formatNumber(asset?.available ?? 0)}</p>
                                    <p>{formatNumber(asset?.current_value ?? 0, true)}</p>
                                </Col>
                            </td>
                            <td>
                                <Col className="gap-3">
                                    <p>
                                        {percentageFormat(setWeight * 100)}%
                                    </p>
                                    {asset.stable ? <p className={clsx({ "text-green-1": isCurrentWeightMoreThanSetWeight, "text-red-1": !isCurrentWeightMoreThanSetWeight })}>
                                        {percentageFormat((asset.current_weight ?? 0) * 100)}%
                                    </p> : <></>}
                                </Col>
                            </td>
                        </tr>
                    );
                } else {
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
                                    className={
                                        (asset.asset_details?.asset_data?.price_change_percentage_24h ?? 0) <= 0
                                            ? "bg-red-2 text-red-1 mr-5"
                                            : "bg-green-2 text-green-1 mr-5"
                                    }
                                />
                            </td>
                            <td>{formatNumber(asset?.asset_details?.asset_data?.current_price ?? 0, true)}</td>
                            <td>{formatNumber(asset?.available ?? 0)}</td>
                            <td>{formatNumber(asset?.current_value ?? 0, true)}</td>
                            <td className={clsx({ "text-green-1": isCurrentWeightMoreThanSetWeight, "text-red-1": !isCurrentWeightMoreThanSetWeight })}>
                                {percentageFormat((asset.current_weight ?? 0) * 100)}%
                            </td>
                            <td className="">
                                {(!asset.stable) ?
                                    <Row className="gap-2 items-center">
                                        <p className="min-w-[50px]">
                                            {percentageFormat(setWeight * 100)}%
                                        </p>
                                        <Row className="w-16 rounded-full overflow-hidden bg-white flex-1" style={{ height: 10 }}>
                                            <Row
                                                className={`rounded-full`}
                                                style={{
                                                    width: `${percentageFormat(setWeight * 100)}%`,
                                                    backgroundColor: coinColor === "#ffffffff" ? chartDefaultColorsHex[0] : coinColor,
                                                }}
                                            />
                                        </Row>
                                    </Row>
                                    : <p className="font-bold text-grey-1 whitespace-nowrap text-ellipsis overflow-hidden">{asset.name === USDTSymbol ? t("yourUSDTHoldingsWillBeUsedOnTheNextRebalancing") : t("thisStableCoinWillNotBeUsedInSmartAllocation")}</p>
                                }
                            </td>
                        </tr>
                    );
                }
            });
        }
    }, [isLoading, isTabletOrMobileScreen, smartAllocationHoldings, t, tableLoadingSkeleton])

    const table = useMemo(() => {
        return (
            <Row className="flex-[3] overflow-auto">
                <table className={styles.table}>
                    {tableHeader}
                    <tbody>
                        {tableBody}
                    </tbody>
                </table>
            </Row>
        )
    }, [tableBody, tableHeader])

    if (smartAllocationHoldings?.length || isLoading) {
        return (
            <Col className="gap-10">
                {table}
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