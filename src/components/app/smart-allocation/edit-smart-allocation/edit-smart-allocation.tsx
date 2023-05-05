import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Col, Row } from "../../../shared/layout/flex"
import ExchangeSwitcher from "../../../shared/exchange-switcher/exchange-switcher"
import Button from "../../../shared/buttons/button"
import PortfolioComposition from "../../../shared/portfolio-composition/portfolio-composition"
import { SaveSmartAllocationAssetType, SmartAllocationAssetStatus, SmartAllocationAssetType } from "../../../../types/smart-allocation.types"
import { useSelector } from "react-redux"
import { selectSelectedExchange } from "../../../../services/redux/exchangeSlice"
import { MODE_DEBUG } from "../../../../utils/constants/config"
import { useTranslation } from "next-i18next"
import { percentageFormat, formatNumber } from "../../../../utils/helpers/prices"
import Image from "next/image"
import clsx from "clsx"
import styles from "./edit-smart-allocation.module.scss";
import { TrashIcon } from "@heroicons/react/24/outline"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { USDTSymbol } from "../../../../utils/constants/market"
import * as Slider from '@radix-ui/react-slider';
import PageLoader from "../../../shared/pageLoader/pageLoader"
import Link from "next/link"
import AssetPnl from "../../../shared/containers/asset/assetPnl"
import AssetSelector from "../../../shared/AssetSelector/AssetSelector"
import { getSmartAllocation, updateSmartAllocation } from "../../../../services/controllers/smart-allocation"
import { toast } from "react-toastify"



const EditSmartAllocation: FC = () => {

    const [isLoadingSmartAllocationHoldings, setIsLoadingSmartAllocationHoldings] = useState<boolean>(false);
    const [smartAllocationHoldings, setSmartAllocationHoldings] = useState<SmartAllocationAssetType[]>([]);
    const [smartAllocationTotalEvaluation, setSmartAllocationTotalEvaluation] = useState<number>(0);
    const [smartAllocationAlreadyExists, setSmartAllocationAlreadyExists] = useState<boolean>(false);
    const [isSavingSmartAllocation, setIsSavingSmartAllocation] = useState<boolean>(false);

    const selectedExchange = useSelector(selectSelectedExchange);

    const { t } = useTranslation();


    const initSmartAllocationHoldings = useCallback(() => {
        setIsLoadingSmartAllocationHoldings(true);
        getSmartAllocation(selectedExchange?.provider_id)
            .then((res) => {
                const data = res.data;
                setSmartAllocationAlreadyExists(data?.exists ?? false);
                const holdings: SmartAllocationAssetType[] | undefined = data.assets;

                if (holdings && data.exists) {
                    holdings.sort((a, b) => ((b?.current_weight ?? 0) - (a?.current_weight ?? 0)));
                    setSmartAllocationHoldings(holdings.filter(asset => asset.name !== USDTSymbol));


                    let total = 0;
                    holdings.forEach((holding) => {
                        if (holding.name === USDTSymbol) {
                            total += holding.available ?? 0;
                        } else {
                            total += (holding.current_value ?? 0);
                        }
                    })
                    setSmartAllocationTotalEvaluation(total);
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

    const distributeWeightsEqually = useCallback(() => {
        setSmartAllocationHoldings((oldState) => {
            return oldState.map((holding) => {
                return { ...holding, weight: 1 / oldState.length }
            })
        })
    }, [])


    const onSetWeightChange = useCallback((value: number, asset: SmartAllocationAssetType) => {
        setSmartAllocationHoldings((oldState) => {
            const filteredSmartAllocationHoldings = smartAllocationHoldings?.filter((a) => a.name !== asset.name);
            const totalPercentage = filteredSmartAllocationHoldings.length ? (filteredSmartAllocationHoldings?.map(asset => asset.weight)?.reduce((prev, next) => ((prev ?? 0) + (next ?? 0))) ?? 0) : 0;
            const maxPercent = 100 - ((totalPercentage * 100));
            const strictedValue = value < 0 ? 0 : value > maxPercent ? maxPercent : value;
            return oldState.map((holding) => {
                if (holding.name === asset.name) {
                    return { ...holding, weight: strictedValue / 100 }
                } else {
                    return holding;
                }
            })
        })
    }, [smartAllocationHoldings])

    const onRemoveAsset = useCallback((asset: SmartAllocationAssetType) => {
        setSmartAllocationHoldings((oldState) => {
            return oldState.filter((holding) => holding.name !== asset.name);
        })
    }, [])

    const tableFooter = useMemo(() => {
        let totalPercentage = 0;
        let totalEvaluation = 0;
        if (smartAllocationHoldings.length) {
            totalPercentage = smartAllocationHoldings?.map(asset => asset.weight)?.reduce((prev, next) => ((prev ?? 0) + (next ?? 0))) ?? 0;
            totalEvaluation = smartAllocationHoldings?.map(asset => (asset.weight ?? 0) * (smartAllocationTotalEvaluation ?? 0))?.reduce((prev, next) => ((prev ?? 0) + (next ?? 0))) ?? 0;
        }
        const is100Percent = totalPercentage === 1;
        return (
            <tfoot>
                <tr>
                    <td colSpan={6} />
                    <td>
                        <Row className="w-full justify-between gap-4 items-center font-bold text-white">
                            <Row className="flex-1 justify-between items-center">
                                <AssetSelector
                                    trigger={<Button className="px-5 min-w-[5rem] bg-blue-1 h-10 rounded-md">Add asset</Button>}
                                    onClick={(selectedAsset) => {
                                        setSmartAllocationHoldings((oldState) => {
                                            const newState = [...oldState];
                                            const assetAlreadyExists = oldState.find(asset => selectedAsset?.symbol?.toLowerCase() === asset?.name?.toLowerCase());
                                            if (!assetAlreadyExists) {
                                                if (selectedAsset?.symbol?.toLocaleLowerCase() !== USDTSymbol?.toLocaleLowerCase()) {
                                                    newState.push({
                                                        name: selectedAsset.symbol?.toUpperCase() ?? "",
                                                        ask_price: selectedAsset.currentPrice,
                                                        weight: 0,
                                                        current_weight: 0,
                                                        available: 0,
                                                        current_value: 0,
                                                        asset_details: {
                                                            asset_data: {
                                                                name: selectedAsset.name ?? "",
                                                                image: selectedAsset.iconUrl,
                                                                price_change_percentage_24h: selectedAsset.pnl,
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                            return newState;
                                        })
                                    }}
                                />
                                <p>Total</p>
                            </Row>
                            <p className={clsx({ "text-green-1": is100Percent, "text-red-1": !is100Percent }, "w-12 text-center")}>{percentageFormat((totalPercentage * 100))}%</p>
                            <p className="w-3"></p>
                            <p className={clsx({ "text-green-1": is100Percent, "text-red-1": !is100Percent })}>USD {formatNumber(totalEvaluation, true)}</p>
                        </Row>
                    </td>
                    <td />
                </tr>
            </tfoot>
        )
    }, [smartAllocationHoldings, smartAllocationTotalEvaluation])

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
                                        <Button className="text-blue-1 underline" onClick={distributeWeightsEqually}>Distribute equally</Button>
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
                                                    value={asset.asset_details?.asset_data?.price_change_percentage_24h ?? 0}
                                                />
                                            </td>
                                            <td>{formatNumber(asset?.ask_price ?? 0, true)}</td>
                                            <td>{formatNumber(asset?.available ?? 0)}</td>
                                            <td>{formatNumber(asset?.current_value ?? 0, true)}</td>
                                            <td className={clsx({ "text-green-1": isCurrentWeightMoreThanSetWeight, "text-red-1": !isCurrentWeightMoreThanSetWeight })}>
                                                {percentageFormat((asset.current_weight ?? 0) * 100)}%
                                            </td>
                                            <td className="text-sm">
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
                                                        className="bg-white text-black-1 w-12 h-8 text-center rounded-md text-sm p-0"
                                                        value={percentageFormat(setWeight * 100)}
                                                        type="number"
                                                        onChange={(event) => {
                                                            onSetWeightChange(parseFloat(event.target.value), asset);
                                                        }}
                                                    />
                                                    <p className="font-bold">%</p>
                                                    <p className="font-bold w-32">USD {formatNumber(assetEvaluation, true)}</p>
                                                </Row>
                                            </td>
                                            <td>
                                                {(!asset.current_weight) && <Button onClick={() => onRemoveAsset(asset)}>
                                                    <XMarkIcon width={20} height={20} color="white" />
                                                </Button>}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                        {tableFooter}
                    </table>

                </Row>
            )
        }
    }, [distributeWeightsEqually, isLoadingSmartAllocationHoldings, onRemoveAsset, onSetWeightChange, smartAllocationHoldings, smartAllocationTotalEvaluation, t, tableFooter])


    const onSaveSmartAllocation = useCallback(() => {
        setIsSavingSmartAllocation(true);
        const assets: SaveSmartAllocationAssetType[] = smartAllocationHoldings.map((holding) => {
            return (
                {
                    name: holding.name,
                    weight: holding.weight,
                    status: ((holding.weight ?? 0) > 0) ? SmartAllocationAssetStatus.ACTIVE : SmartAllocationAssetStatus.DELETED,
                    id: holding.id,
                })
        });

        updateSmartAllocation({
            providerId: selectedExchange?.provider_id,
            data: assets,
            smartAllocationAlreadyExists
        })
            .then((res) => {
                toast.success("Smart allocation was saved successfully");
            })
            .catch((error) => {
                if (MODE_DEBUG) {
                    console.error("Error while saving smart allocation (saveSmartAllocation)", error)
                }
                toast.error("Something went wrong")
            })
            .finally(() => {
                setIsSavingSmartAllocation(false);
            });

    }, [selectedExchange?.provider_id, smartAllocationAlreadyExists, smartAllocationHoldings])

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
                    <Button className="h-11 w-36 rounded-md bg-blue-1" onClick={onSaveSmartAllocation} isLoading={isSavingSmartAllocation}>
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