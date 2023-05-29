import { FC, useContext, useMemo } from "react";
import { Trans, useTranslation } from "next-i18next";
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
import { SmartAllocationContext } from "../../authed-smart-alocation";
import moment from "moment";
import { EnumExitStrategyTrigger } from "../../../../../../utils/constants/smartAllocation";
import RebalancePreviewDialog from "./RebalancePreviewDialog/RebalancePreviewDialog";
import { useResponsive } from "../../../../../../context/responsive.context";
import { getCoinColor } from "../../../../../../utils/helpers/coinsColors";
import { chartDefaultColorsHex } from "../../../../../../utils/constants/customColors";

const SmartAllocationHoldingsTab: FC<{ smartAllocationHoldings: SmartAllocationAssetType[], smartAllocationTotalEvaluation: number }> = ({ smartAllocationHoldings, smartAllocationTotalEvaluation }) => {

    const { t } = useTranslation(['smart-allocation']);
    const { rebalancingDate, rebalancingFrequency, exitStrategyData } = useContext(SmartAllocationContext)

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

    const tableBody = useMemo(() => {
        return smartAllocationHoldings.map((asset, index) => {
            if (asset.name !== USDTSymbol) {
                const setWeight = asset.weight ?? 0;
                const isCurrentWeightMoreThanSetWeight = (asset.current_weight ?? 0) >= setWeight;
                const coinColor = getCoinColor(asset.name ?? "", index);

                if (isTabletOrMobileScreen) {
                    return (
                        <tr key={asset.name}>
                            <td>
                                <Col className="gap-3">
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
                                    <p className={clsx({ "text-green-1": isCurrentWeightMoreThanSetWeight, "text-red-1": !isCurrentWeightMoreThanSetWeight })}>
                                        {percentageFormat((asset.current_weight ?? 0) * 100)}%
                                    </p>
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
                                />
                            </td>
                            <td>{formatNumber(asset?.ask_price ?? 0, true)}</td>
                            <td>{formatNumber(asset?.available ?? 0)}</td>
                            <td>{formatNumber(asset?.current_value ?? 0, true)}</td>
                            <td className={clsx({ "text-green-1": isCurrentWeightMoreThanSetWeight, "text-red-1": !isCurrentWeightMoreThanSetWeight })}>
                                {percentageFormat((asset.current_weight ?? 0) * 100)}%
                            </td>
                            <td className="">
                                <Row className="gap-2 items-center">
                                    <p>
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
                            </td>
                        </tr>
                    );
                }
            } else {
                return <></>
            }
        });
    }, [isTabletOrMobileScreen, smartAllocationHoldings])

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

    if (smartAllocationHoldings?.length) {
        return (
            <Col className="gap-10">
                {!isTabletOrMobileScreen && <Row className="w-full gap-5 items-center">
                    <Col className="gap-5 flex-1 max-w-full md:gap-10 md:flex-[3] md:flex-row">
                        <Link href="smart-allocation/edit" className="w-max bg-blue-1 py-2.5 px-5 rounded-md text-sm font-bold shrink-0">{t('editPortfolio')}</Link>
                    </Col>
                    <Row className="hidden md:flex md:flex-1"></Row>
                </Row>}
                <div className="flex flex-col-reverse w-full gap-5 md:flex-row">
                    {table}
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