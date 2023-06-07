import { FC, useCallback, useEffect, useMemo, useState } from "react"
import * as Slider from '@radix-ui/react-slider'
import { useTranslation } from "next-i18next"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"

import { SaveSmartAllocationAssetType, SmartAllocationAssetType, SmartAllocationExitStrategyType, SmartAllocationSaveRequestType } from "../../../../types/smart-allocation.types"
import SmartAllocationExitStrategy from "../authed-smart-allocation/SmartAllocationAutomation/SmartAllocationExitStrategy/SmartAllocationExitStrategy"
import SmartAllocationRebalancing from "../authed-smart-allocation/SmartAllocationAutomation/SmartAllocationRebalancing/SmartAllocationRebalancing"
import { EnumReBalancingFrequency, EnumSmartAllocationAssetStatus } from "../../../../utils/constants/smartAllocation"
import { getSmartAllocation, updateSmartAllocation } from "../../../../services/controllers/smart-allocation"
import { getAssetCurrentValue, getAssetCurrentWeight, stableCoinsFilter } from "../../../../utils/smart-allocation"
import ExchangeSwitcher from "../../../shared/exchange-switcher/exchange-switcher"
import { selectSelectedExchange } from "../../../../services/redux/exchangeSlice"
import { percentageFormat, formatNumber } from "../../../../utils/helpers/prices"
import CutoutDoughnutChart from "../../../shared/charts/doughnut/cutout-doughnut"
import AssetSelector from "../../../shared/AssetSelector/AssetSelector"
import { useResponsive } from "../../../../context/responsive.context"
import { getCoinColor } from "../../../../utils/helpers/coinsColors"
import AssetPnl from "../../../shared/containers/asset/assetPnl"
import { MODE_DEBUG } from "../../../../utils/constants/config"
import PageLoader from "../../../shared/pageLoader/pageLoader"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import styles from "./edit-smart-allocation.module.scss"
import { Col, Row } from "../../../shared/layout/flex"
import { XMarkIcon } from "@heroicons/react/24/solid"
import Button from "../../../shared/buttons/button"
import { AssetType } from "../../../../types/asset"


const EditSmartAllocation: FC = () => {

    const [isLoadingSmartAllocationHoldings, setIsLoadingSmartAllocationHoldings] = useState<boolean>(false);
    const [smartAllocationHoldings, setSmartAllocationHoldings] = useState<SmartAllocationAssetType[]>([]);
    const [smartAllocationTotalEvaluation, setSmartAllocationTotalEvaluation] = useState<number>(0);
    const [smartAllocationExists, setSmartAllocationExists] = useState<boolean>(false);
    const [isSavingSmartAllocation, setIsSavingSmartAllocation] = useState<boolean>(false);
    const [userHasSubscription, setUserHasSubscription] = useState<boolean>(true);
    const [reBalancingFrequency, setReBalancingFrequency] = useState<EnumReBalancingFrequency | null>(null);
    const [reBalancingDate, setReBalancingDate] = useState<Date | null>(null);
    const [exitStrategy, setExitStrategy] = useState<SmartAllocationExitStrategyType | null>(null);

    const selectedExchange = useSelector(selectSelectedExchange);

    const { t } = useTranslation(['smart-allocation']);

    const router = useRouter()

    const { isTabletOrMobileScreen } = useResponsive();


    const getTotalAssetsValue = useCallback((smartAllocationHoldings: SmartAllocationAssetType[]) => {
        return smartAllocationHoldings.map(holding => getAssetCurrentValue(holding, holding.asset_details?.asset_data?.current_price ?? 0)).reduce((prev, curr) => prev + curr);
    }, [])

    const initSmartAllocationHoldings = useCallback(() => {
        if (!selectedExchange?.provider_id) {
            if (MODE_DEBUG) {
                console.log('initSmartAllocationHolding: selectedExchange?.provider_id is false', selectedExchange?.provider_id)
            }
            return
        };
        setIsLoadingSmartAllocationHoldings(true);
        getSmartAllocation(selectedExchange?.provider_id)
            .then((res) => {
                const data = res.data;
                setSmartAllocationExists(data?.exists ?? false);
                const holdings: SmartAllocationAssetType[] | undefined = data.assets;
                if (holdings) {
                    setSmartAllocationTotalEvaluation(getTotalAssetsValue(holdings));
                    const totalValue = getTotalAssetsValue(holdings);
                    holdings.sort((a, b) => ((getAssetCurrentWeight(b, b.asset_details?.asset_data?.current_price ?? 0, totalValue)) - (getAssetCurrentWeight(a, a.asset_details?.asset_data?.current_price ?? 0, totalValue))));
                    setSmartAllocationHoldings(holdings.filter(stableCoinsFilter).map((holding) => {
                        return { ...holding, current_value: getAssetCurrentValue(holding, holding.asset_details?.asset_data?.current_price ?? 0), current_weight: getAssetCurrentWeight(holding, holding.asset_details?.asset_data?.current_price ?? 0, totalValue) };
                    }));
                }
                const frequency = data.frequency;
                if (frequency) {
                    setReBalancingFrequency(frequency);
                }

                if (data.next_run_time) {
                    setReBalancingDate(new Date(data.next_run_time));
                } else {
                    setReBalancingDate(null);
                }

                if (data.exit_strategy) {
                    setExitStrategy(data.exit_strategy);
                } else {
                    setExitStrategy(null);
                }
            })
            .catch((error) => {
                if (MODE_DEBUG)
                    console.error("Error while initSmartAllocationHoldings (initSmartAllocationHoldings)", error)
            })
            .finally(() => {
                setIsLoadingSmartAllocationHoldings(false);
            })
    }, [getTotalAssetsValue, selectedExchange?.provider_id]);


    useEffect(() => {
        initSmartAllocationHoldings();

    }, [initSmartAllocationHoldings]);

    const distributeWeightsEqually = useCallback(() => {
        setSmartAllocationHoldings((oldState) => {
            return oldState.map((holding) => {
                return { ...holding, weight: 1 / (oldState.length) };
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
            return oldState.map((holding) => holding.name === asset.name ? { ...holding, removed: (!asset.id), weight: 0 } : holding);
        })
    }, [])

    const tableHeader = useMemo(() => {
        if (isTabletOrMobileScreen) {
            return (
                <thead>
                    <tr>
                        <th>{t("common:name")}</th>
                        <th>{t("allocation")}</th>
                        <th>{t("percent")}</th>
                        <th></th>
                    </tr>
                </thead>
            );
        } else {
            return (
                <thead>
                    <tr>
                        <th>{t("common:name")}</th>
                        <th>{t("common:24hP/L")}</th>
                        <th>{t("common:currentPrice")}</th>
                        <th>{t("holdingQuantity")}</th>
                        <th>{t('holdingValue')}</th>
                        <th>{t('currentWeight')}</th>
                        <th>
                            <Row className="gap-3">
                                <p>{t('setWeight')}</p>
                                <Button className="text-blue-1 underline" onClick={distributeWeightsEqually}>{t('distributeEqually')}</Button>
                            </Row>
                        </th>
                        <th>
                        </th>
                    </tr>
                </thead>
            );
        }
    }, [distributeWeightsEqually, isTabletOrMobileScreen, t]);

    const tableBody = useMemo(() => {


        if (!smartAllocationHoldings.length) {
            return (
                <tr>
                    <td colSpan={7} className="row-span-full">{t("common:noAssets")}</td>
                </tr>
            )
        } else {
            return smartAllocationHoldings.map((asset, index) => {

                const setWeight = asset.weight ?? 0;
                const isCurrentWeightMoreThanSetWeight = (asset.current_weight ?? 0) >= setWeight;

                const assetEvaluation = smartAllocationTotalEvaluation * setWeight;

                const coinColor = getCoinColor(asset.name ?? "", index);

                if (isTabletOrMobileScreen) {
                    return (
                        <tr key={asset.name}>
                            <td>
                                <Col className="gap-1">
                                    <p>{asset.asset_details?.asset_data?.name}</p>
                                    <p className="text-sm text-grey-1">{asset.name}</p>
                                </Col>
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
                                        <Slider.Track className="flex-grow flex-1 bg-[#D9D9D9] rounded-full h-3">
                                            <Slider.Range className="absolute h-full rounded-full" style={{ backgroundColor: coinColor }} />
                                        </Slider.Track>
                                        <Slider.Thumb className="block w-6 h-6 bg-white rounded-full shadow-lg shadow-black-1 focus:outline-none" />
                                    </Slider.Root>

                                </Row>
                            </td>
                            <td>
                                <Col className="gap-2">
                                    <Row className="gap-1 items-center">
                                        <input
                                            className="bg-grey-3 focus-within:outline focus-within:outline-1 focus-within:outline-grey-1 w-16 h-10 text-center rounded-md text-sm p-0"
                                            value={percentageFormat(setWeight * 100)}
                                            type="number"
                                            onChange={(event) => {
                                                onSetWeightChange(parseFloat(event.target.value), asset);
                                            }}
                                        />
                                        <p className="font-bold">%</p>
                                    </Row>
                                    <p className="font-bold w-32">{formatNumber(assetEvaluation, true)}</p>
                                </Col>
                            </td>
                            <td>
                                {(userHasSubscription) && <Button onClick={() => onRemoveAsset(asset)}>
                                    <XMarkIcon width={20} height={20} color="white" />
                                </Button>}
                            </td>
                        </tr>
                    );
                } else {
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
                            <td>{formatNumber(asset?.asset_details?.asset_data?.current_price ?? 0, true)}</td>
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
                                        <Slider.Track className="flex-grow flex-1 bg-[#D9D9D9] rounded-full h-3">
                                            <Slider.Range className="absolute h-full rounded-full" style={{ backgroundColor: coinColor }} />
                                        </Slider.Track>
                                        <Slider.Thumb className={`block w-6 h-6 bg-white rounded-full shadow-lg shadow-black-1 hover:bg-[#D9D9D9] focus:outline-none`} />
                                    </Slider.Root>
                                    <input
                                        className="bg-grey-3 focus-within:outline focus-within:outline-1 focus-within:outline-grey-1 w-12 h-8 text-center rounded-md text-sm p-0"
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
                                {(userHasSubscription) && <Button onClick={() => onRemoveAsset(asset)}>
                                    <XMarkIcon width={20} height={20} color="white" />
                                </Button>}
                            </td>
                        </tr>
                    );
                }
            })
        }
    }, [isTabletOrMobileScreen, onRemoveAsset, onSetWeightChange, smartAllocationHoldings, smartAllocationTotalEvaluation, t, userHasSubscription]);

    const onSelectAsset = useCallback((selectedAsset: AssetType) => {
        setSmartAllocationHoldings((oldState) => {
            const newState = [...oldState];
            const assetAlreadyExists = oldState.find(asset => selectedAsset?.symbol?.toLowerCase() === asset?.name?.toLowerCase());
            if (!assetAlreadyExists) {
                if (!selectedAsset?.stable) {
                    newState.push({
                        name: selectedAsset.symbol?.toUpperCase() ?? "",
                        weight: 0,
                        current_weight: 0,
                        available: 0,
                        current_value: 0,
                        asset_details: {
                            asset_data: {
                                name: selectedAsset.name ?? "",
                                image: selectedAsset.iconUrl,
                                price_change_percentage_24h: selectedAsset.pnl,
                                current_price: selectedAsset.currentPrice,
                            }
                        }
                    })
                }
            }
            return newState;
        })
    }, []);

    const assetSelector = useMemo(() => {
        return (
            <AssetSelector
                trigger={<Button className="w-full md:w-max px-5 min-w-[5rem] bg-blue-1 h-11 rounded-md">{t('common:addAsset')}</Button>}
                onClick={onSelectAsset}
            />
        );
    }, [onSelectAsset, t]);

    const tableFooter = useMemo(() => {
        let totalPercentage = 0;
        let totalEvaluation = 0;
        if (smartAllocationHoldings.length) {
            totalPercentage = smartAllocationHoldings?.map(asset => asset.weight)?.reduce((prev, next) => ((prev ?? 0) + (next ?? 0))) ?? 0;
            totalEvaluation = smartAllocationHoldings?.map(asset => (asset.weight ?? 0) * (smartAllocationTotalEvaluation ?? 0))?.reduce((prev, next) => ((prev ?? 0) + (next ?? 0))) ?? 0;
        }
        const is100Percent = totalPercentage >= .999;

        if (isTabletOrMobileScreen) {

            return (
                <tfoot>
                    <tr>
                        <td>{t('common:total')}</td>
                        <td>
                            <p className={clsx({ "text-green-1": is100Percent, "text-red-1": !is100Percent }, "w-12 text-center")}>{percentageFormat((totalPercentage * 100))}%</p>
                        </td>
                        <td>
                            <p className={clsx({ "text-green-1": is100Percent, "text-red-1": !is100Percent })}>USD {formatNumber(totalEvaluation, true)}</p>
                        </td>
                        <td />
                    </tr>
                </tfoot>
            )
        } else {

            return (
                <tfoot>
                    <tr>
                        <td colSpan={6} />
                        <td>
                            <Row className="w-full justify-between gap-4 items-center font-bold text-white">
                                <Row className="flex-1 justify-between items-center">
                                    {assetSelector}
                                    <p>{t('common:total')}</p>
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
        }
    }, [assetSelector, isTabletOrMobileScreen, smartAllocationHoldings, smartAllocationTotalEvaluation, t]);

    const table = useMemo(() => {
        if (!isLoadingSmartAllocationHoldings) {
            return (
                <Row className="w-full overflow-auto">
                    <table className={styles.table}>
                        {tableHeader}
                        <tbody>
                            {tableBody}
                        </tbody>
                        {tableFooter}
                    </table>
                </Row>
            )
        }
    }, [isLoadingSmartAllocationHoldings, tableBody, tableFooter, tableHeader])

    const onSaveSmartAllocation = useCallback(() => {

        if (smartAllocationHoldings.length) {
            const totalPercentage = smartAllocationHoldings?.map(asset => asset.weight)?.reduce((prev, next) => ((prev ?? 0) + (next ?? 0))) ?? 0;
            if (totalPercentage >= .999) {

                setIsSavingSmartAllocation(true);
                const assets: SaveSmartAllocationAssetType[] = smartAllocationHoldings.map((holding) => {
                    return (
                        {
                            name: holding.name,
                            weight: holding.weight,
                            status: EnumSmartAllocationAssetStatus.ACTIVE,
                            id: holding.id,
                        })
                });

                const requestData: SmartAllocationSaveRequestType = {
                    assets,
                    exit_strategy: exitStrategy,
                    frequency: reBalancingFrequency
                };

                updateSmartAllocation({
                    providerId: selectedExchange?.provider_id,
                    data: requestData,
                    smartAllocationAlreadyExists: smartAllocationExists
                })
                    .then((res) => {
                        toast.success(t("smartAllocationWasSavedSuccessfully"));
                        router.push('/smart-allocation/')
                    })
                    .catch((error) => {
                        if (MODE_DEBUG) {
                            console.error("Error while saving smart allocation (saveSmartAllocation)", error)
                        }
                        toast.error(t("common:somethingWentWrong"))
                    })
                    .finally(() => {
                        setIsSavingSmartAllocation(false);
                    });
            } else {
                toast.error(t('makeSureToAllocate100%OfYourPortfolio'));
            }
        }
    }, [exitStrategy, reBalancingFrequency, router, selectedExchange?.provider_id, smartAllocationExists, smartAllocationHoldings, t])


    const smartAllocationRebalancing = useMemo(() => (
        <SmartAllocationRebalancing
            reBalancingFrequency={reBalancingFrequency}
            setReBalancingFrequency={setReBalancingFrequency}
            reBalancingDate={reBalancingDate}
        />
    ), [reBalancingDate, reBalancingFrequency]);


    const smartAllocationExitStrategy = useMemo(() => (
        <SmartAllocationExitStrategy exitStrategy={exitStrategy} onChange={(newExitStrategy) => {
            setExitStrategy(newExitStrategy);
        }} />
    ), [exitStrategy]);


    const smartAllocationAutomation = useMemo(() => {

        if (isTabletOrMobileScreen) {
            return (
                <Tabs className="w-full font-light" selectedTabClassName="text-blue-1 font-bold text-lg border-b-2 border-blue-1 pb-3">
                    <TabList className="flex overflow-auto w-full border-b-[1px] border-grey-3 mb-6">
                        <Tab className="text-sm shrink-0 outline-none cursor-pointer px-5">{t("rebalancing")}</Tab>
                        <Tab className="text-sm shrink-0 outline-none cursor-pointer px-5">{t("exitStrategy")}</Tab>
                    </TabList>
                    <TabPanel>
                        {smartAllocationRebalancing}
                    </TabPanel>
                    <TabPanel>
                        {smartAllocationExitStrategy}
                    </TabPanel>
                </Tabs>
            )
        } else {
            return (
                <Col className='gap-5 border-t-grey-5 border-t pt-8 md:flex-row'>
                    {smartAllocationRebalancing}
                    {smartAllocationExitStrategy}
                </Col>
            )
        }
    }, [isTabletOrMobileScreen, smartAllocationExitStrategy, smartAllocationRebalancing, t]);

    if (isLoadingSmartAllocationHoldings) {
        return <PageLoader />
    } else {
        return (
            <Col className="w-full gap-10 lg:gap-16 pb-20 items-start justify-start">
                <Col className="w-full md:flex-row justify-between gap-5">
                    <Col className="gap-10 flex-1">
                        <Row className="w-full gap-1 shrink-0 overflow-auto">
                            <Link className="shrink-0" href="/smart-allocation">{t('common:smartAllocation')}</Link>
                            <p>&gt;</p>
                            <p className="shrink-0 text-blue-1 font-bold">{t('editYourSmartAllocation')}</p>
                        </Row>
                        <Col className="justify-between gap-5">
                            <ExchangeSwitcher canSelectOverall={false} />
                            <Button className="h-11 w-36 rounded-md bg-blue-1" onClick={onSaveSmartAllocation} isLoading={isSavingSmartAllocation}>
                                {t('common:preview')}
                            </Button>
                        </Col>
                    </Col>
                    <Row className="flex-[2] justify-evenly h-44 md:h-[300px] gap-5">
                        <CutoutDoughnutChart
                            title={t<any>("currentWeight")}
                            chartData={smartAllocationHoldings.map(asset => ({ label: asset?.name ?? "", value: asset.current_value ?? 0, coinSymbol: asset.name ?? "" }))}
                            className="w-[160px] md:w-[262px]"
                        />
                        <CutoutDoughnutChart
                            title={t<any>("setWeight")}
                            chartData={smartAllocationHoldings.map(asset => ({ label: asset?.name ?? "", value: smartAllocationTotalEvaluation * (asset.weight ?? 0), coinSymbol: asset.name ?? "" }))}
                            className="w-[160px] md:w-[262px]"
                        />
                    </Row>
                </Col>
                {table}
                {isTabletOrMobileScreen && assetSelector}
                {smartAllocationAutomation}
            </Col>
        )
    }
}

export default EditSmartAllocation;