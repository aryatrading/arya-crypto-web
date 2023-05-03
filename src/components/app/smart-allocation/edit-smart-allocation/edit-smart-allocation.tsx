import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Col, Row } from "../../../shared/layout/flex"
import ExchangeSwitcher from "../../../shared/exchange-switcher/exchange-switcher"
import Button from "../../../shared/buttons/button"
import PortfolioComposition from "../../../shared/portfolio-composition/portfolio-composition"
import { SmartAllocationAssetType } from "../../../../types/smart-allocation.types"
import { useSelector } from "react-redux"
import { getSmartAllocation } from "../../../../services/controllers/market"
import { selectSelectedExchange } from "../../../../services/redux/exchangeSlice"
import { MODE_DEBUG } from "../../../../utils/constants/config"
import { useTranslation } from "next-i18next"
import { percentageFormat, priceFormat } from "../../../../utils/helpers/prices"
import Image from "next/image"
import clsx from "clsx"
import styles from "./edit-smart-allocation.module.scss";
import { TrashIcon } from "@heroicons/react/24/outline"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { USDTSymbol } from "../../../../utils/constants/market"
import * as Slider from '@radix-ui/react-slider';
import PageLoader from "../../../shared/pageLoader/pageLoader"
import { AssetPnl } from "../../../shared/containers/asset/assetPnl"
import Link from "next/link"



const EditSmartAllocation: FC = () => {

    const [isLoadingSmartAllocationHoldings, setIsLoadingSmartAllocationHoldings] = useState<boolean>(false);
    const [smartAllocationHoldings, setSmartAllocationHoldings] = useState<SmartAllocationAssetType[]>([]);
    const [smartAllocationTotalEvaluation, setSmartAllocationTotalEvaluation] = useState<number>(0);

    const selectedExchange = useSelector(selectSelectedExchange);

    const { t } = useTranslation();


    const initSmartAllocationHoldings = useCallback(() => {
        setIsLoadingSmartAllocationHoldings(true);
        getSmartAllocation(selectedExchange?.provider_id)
            .then((res) => {
                const data = res.data;
                const holdings: SmartAllocationAssetType[] | undefined = data.assets;
                setSmartAllocationTotalEvaluation(data?.total_asset_value ?? 0);

                if (holdings && data.exists) {
                    holdings.sort((a, b) => ((b?.current_weight ?? 0) - (a?.current_weight ?? 0)));
                    setSmartAllocationHoldings(holdings.filter(asset => asset.name !== USDTSymbol));
                }
            })
            .catch((error) => {
                if (MODE_DEBUG)
                    console.error("Error while initSmartAllocationHoldings (initSmartAllocationHoldings)", error)
            })
            .finally(() => {
                setIsLoadingSmartAllocationHoldings(false);
            })
    }, [selectedExchange?.provider_id]);


    useEffect(() => {
        initSmartAllocationHoldings();
    }, [initSmartAllocationHoldings]);


    const onSetWeightChange = useCallback((value: number, asset: SmartAllocationAssetType) => {
        setSmartAllocationHoldings((oldState) => {
            const strictedValue = value < 0 ? 0 : value > 100 ? 100 : value;
            return oldState.map((holding) => {
                if (holding.name === asset.name) {
                    return { ...holding, weight: strictedValue / 100 }
                } else {
                    return holding;
                }
            })
        })
    }, [])

    const tableFooter = useMemo(() => {

        if (smartAllocationHoldings.length) {
            const totalPercentage = smartAllocationHoldings?.map(asset => asset.weight)?.reduce((prev, next) => ((prev ?? 0) + (next ?? 0))) ?? 0;
            const totalEvaluation = smartAllocationHoldings?.map(asset => (asset.weight ?? 0) * (asset.ask_price ?? 0))?.reduce((prev, next) => ((prev ?? 0) + (next ?? 0))) ?? 0;
            const is100Percent = totalPercentage === 1;
            return (
                <tfoot>
                    <tr>
                        <td colSpan={6} />
                        <td>
                            <Row className="w-full justify-between gap-4 items-center font-bold text-white">
                                <Row className="flex-1 justify-between items-center">
                                    <Button className="px-5 min-w-[10rem] bg-blue-1 h-10 rounded-md">Add asset</Button>
                                    <p>Total</p>
                                </Row>
                                <p className={clsx({ "text-green-1": is100Percent, "text-red-1": !is100Percent }, "w-12 text-center")}>{percentageFormat((totalPercentage * 100))}%</p>
                                <p className="w-3"></p>
                                <p className={clsx({ "text-green-1": is100Percent, "text-red-1": !is100Percent })}>USD ${priceFormat(totalEvaluation, true)}</p>
                            </Row>
                        </td>
                        <td />
                    </tr>
                </tfoot>
            )

        }
    }, [smartAllocationHoldings])

    const table = useMemo(() => {
        if (!isLoadingSmartAllocationHoldings) {


            return (
                <Row className="col-span-full overflow-auto">
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t("common:name")}</th>
                                <th>{t("common:24hP/L")}</th>
                                <th>{t("common:currentPrice")}</th>
                                <th>Holding Quantity</th>
                                <th>Holding Value</th>
                                <th>Current weight</th>
                                <th>
                                    <Row className="gap-3">
                                        <p>Set weight</p>
                                        <Button className="text-blue-1 underline">Distribute equally</Button>
                                    </Row>
                                </th>
                                <th>
                                    <Button>
                                        <TrashIcon width={20} height={20} color="white" />
                                    </Button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!smartAllocationHoldings.length ?
                                <tr>
                                    <td colSpan={7} className="row-span-full">
                                        No assets
                                    </td>
                                </tr>
                                : smartAllocationHoldings.map((asset, index) => {

                                    const setWeight = asset.weight ?? 0;
                                    const isCurrentWeightMoreThanSetWeight = (asset.current_weight ?? 0) >= setWeight;

                                    const pnlPercentage = asset?.pnl?.percent ?? 0;
                                    const pnlIsPositive = pnlPercentage >= 0;

                                    const assetEvaluation = smartAllocationTotalEvaluation * setWeight;

                                    return (
                                        <tr key={asset.name}>
                                            <td>
                                                <Row className="gap-3 items-center">
                                                    <Image src={asset?.asset_details?.asset_data?.image ?? ""} alt="" width={23} height={23} />
                                                    <p>{asset.asset_details?.asset_data?.name}</p>
                                                    <span className="text-sm text-grey-1">{asset.name}</span>
                                                </Row>
                                            </td>
                                            <td>
                                                <AssetPnl
                                                    isUp={pnlIsPositive}
                                                    bgColor={pnlIsPositive ? "bg-green-2" : "bg-red-2"}
                                                    textColor={pnlIsPositive ? "text-green-1" : "text-red-1"}
                                                    value={`${percentageFormat(asset.pnl?.percent ?? 0)}%`}
                                                />
                                            </td>
                                            <td>${priceFormat(asset?.ask_price ?? 0, true)}</td>
                                            <td>{priceFormat(asset?.available ?? 0, true)}</td>
                                            <td>${priceFormat(asset?.current_value ?? 0, true)}</td>
                                            <td className={clsx({ "text-green-1": isCurrentWeightMoreThanSetWeight, "text-red-1": !isCurrentWeightMoreThanSetWeight })}>
                                                {percentageFormat((asset.current_weight ?? 0) * 100)}%
                                            </td>
                                            <td className="">
                                                <Row className="w-full gap-4 items-center">
                                                    <Slider.Root
                                                        className="relative flex items-center select-none flex-1"
                                                        value={[setWeight * 100]}
                                                        max={100}
                                                        step={1}
                                                        aria-label="Volume"
                                                        onValueChange={(value) => onSetWeightChange(value[0], asset)}
                                                    >
                                                        <Slider.Track className="flex-grow flex-1 bg-[#D9D9D9] rounded-full h-2">
                                                            <Slider.Range className="absolute h-full bg-yellow-1 rounded-full" />
                                                        </Slider.Track>
                                                        <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg shadow-black-1 hover:bg-yellow-400 focus:outline-none" />
                                                    </Slider.Root>
                                                    <input
                                                        className="bg-white text-black-1 w-12 h-8 text-center rounded-md"
                                                        value={percentageFormat(setWeight * 100)}
                                                        type="number"
                                                        onChange={(event) => {
                                                            onSetWeightChange(parseFloat(event.target.value), asset);
                                                        }}
                                                    />
                                                    <p className="font-bold">%</p>
                                                    <p className="font-bold">USD ${priceFormat(assetEvaluation)}</p>
                                                </Row>
                                            </td>
                                            <td><XMarkIcon width={20} height={20} color="white" /></td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                        {tableFooter}
                    </table>

                </Row>
            )
        }
    }, [isLoadingSmartAllocationHoldings, onSetWeightChange, smartAllocationHoldings, smartAllocationTotalEvaluation, t, tableFooter])

    return (
        <Col className="w-full grid grid-cols-12 md:gap-10 lg:gap-16 pb-20 items-start justify-start">
            {isLoadingSmartAllocationHoldings && <PageLoader />}
            <Row className="col-span-full gap-1">
                <Link href="/smart-allocation">Smart allocation</Link>
                <p>&gt;</p>
                <p className="text-blue-1 font-bold">Edit your smart allocation</p>
            </Row>
            <Col className="col-span-full gap-5">
                <Row className="justify-between">
                    <ExchangeSwitcher />
                    <Button className="h-11 w-36 rounded-md bg-blue-1">
                        Save
                    </Button>
                </Row>
                <Row className="justify-between">
                    <PortfolioComposition portfolioAssets={smartAllocationHoldings?.map(asset => {
                        return {
                            name: asset.name ?? "",
                            weight: (asset.current_value ?? 0) / (smartAllocationTotalEvaluation ?? 1)
                        };
                    })} />
                </Row>
            </Col>
            {table}
        </Col>
    )
}

export default EditSmartAllocation;