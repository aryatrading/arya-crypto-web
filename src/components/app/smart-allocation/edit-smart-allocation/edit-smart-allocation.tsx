import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Col, Row } from "../../../shared/layout/flex"
import ExchangeSwitcher from "../../../shared/exchange-switcher/exchange-switcher"
import Button from "../../../shared/buttons/button"
import { SaveSmartAllocationAssetType, SmartAllocationAssetType } from "../../../../types/smart-allocation.types"
import { useSelector } from "react-redux"
import { selectSelectedExchange } from "../../../../services/redux/exchangeSlice"
import { MODE_DEBUG } from "../../../../utils/constants/config"
import { useTranslation } from "next-i18next"
import { percentageFormat, formatNumber } from "../../../../utils/helpers/prices"
import Image from "next/image"
import clsx from "clsx"
import styles from "./edit-smart-allocation.module.scss";
import { XMarkIcon } from "@heroicons/react/24/solid"
import { USDTSymbol } from "../../../../utils/constants/market"
import * as Slider from '@radix-ui/react-slider';
import PageLoader from "../../../shared/pageLoader/pageLoader"
import Link from "next/link"
import AssetPnl from "../../../shared/containers/asset/assetPnl"
import AssetSelector from "../../../shared/AssetSelector/AssetSelector"
import { getPredefinedPortfolioHoldings, getSmartAllocation, updateSmartAllocation } from "../../../../services/controllers/smart-allocation"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { EnumPredefinedSmartAllocationPortfolio, EnumSmartAllocationAssetStatus } from "../../../../utils/constants/smartAllocation"
import { useResponsive } from "../../../../context/responsive.context"
import { AssetType } from "../../../../types/asset"
import CutoutDoughnutChart from "../../../shared/charts/doughnut/cutout-doughnut"



const EditSmartAllocation: FC = () => {

    const [isLoadingSmartAllocationHoldings, setIsLoadingSmartAllocationHoldings] = useState<boolean>(true);
    const [isLoadingPredefinedAllocationHoldings, setIsLoadingPredefinedAllocationHoldings] = useState<boolean>(false);
    const [smartAllocationHoldings, setSmartAllocationHoldings] = useState<SmartAllocationAssetType[]>([]);
    const [smartAllocationTotalEvaluation, setSmartAllocationTotalEvaluation] = useState<number>(0);
    const [smartAllocationAlreadyExists, setSmartAllocationAlreadyExists] = useState<boolean>(false);
    const [isSavingSmartAllocation, setIsSavingSmartAllocation] = useState<boolean>(false);
    const [userHasSubscription, setUserHasSubscription] = useState<boolean>(true);

    const selectedExchange = useSelector(selectSelectedExchange);

    const { t } = useTranslation(['smart-allocation']);

    const router = useRouter()

    const { isTabletOrMobileScreen } = useResponsive();

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
                setSmartAllocationAlreadyExists(data?.exists ?? false);
                if (data.exists) {
                    const holdings: SmartAllocationAssetType[] | undefined = data.assets;
                    if (holdings) {
                        holdings.sort((a, b) => ((b?.current_weight ?? 0) - (a?.current_weight ?? 0)));
                        setSmartAllocationHoldings(holdings.filter(asset => asset.name !== USDTSymbol));
                    }
                } else {
                    const predefinedPortfolioId = router?.query?.portfolio;
                    if (predefinedPortfolioId) {
                        setIsLoadingPredefinedAllocationHoldings(true);
                        getPredefinedPortfolioHoldings(predefinedPortfolioId as EnumPredefinedSmartAllocationPortfolio)?.then((res) => {
                            setSmartAllocationHoldings(res);
                        }).finally(() => {
                            setIsLoadingPredefinedAllocationHoldings(false);
                        })
                    }
                }
                setSmartAllocationTotalEvaluation(data.total_asset_value ?? 0);
            })
            .catch((error) => {
                if (MODE_DEBUG)
                    console.error("Error while initSmartAllocationHoldings (initSmartAllocationHoldings)", error)
            })
            .finally(() => {
                setIsLoadingPredefinedAllocationHoldings(false);
                setIsLoadingSmartAllocationHoldings(false);
            })
    }, [router?.query?.portfolio, selectedExchange?.provider_id]);


    useEffect(() => {
        initSmartAllocationHoldings();
    }, [initSmartAllocationHoldings]);

    const distributeWeightsEqually = useCallback(() => {
        setSmartAllocationHoldings((oldState) => {
            const removedItemsCount = oldState.filter(holding => holding.removed).length;
            return oldState.map((holding) => {
                if (!holding.removed) {
                    return { ...holding, weight: 1 / (oldState.length - removedItemsCount) };
                } else {
                    return holding;
                }
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
            return oldState.map((holding) => holding.name === asset.name ? { ...holding, removed: true, weight: 0 } : holding);
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
        const filteredSmartAllocationHoldings = smartAllocationHoldings?.filter((a) => !a.removed);

        if (!filteredSmartAllocationHoldings.length) {
            return (
                <tr>
                    <td colSpan={7} className="row-span-full">{t("common:noAssets")}</td>
                </tr>
            )
        } else {
            return filteredSmartAllocationHoldings.map((asset) => {

                const setWeight = asset.weight ?? 0;
                const isCurrentWeightMoreThanSetWeight = (asset.current_weight ?? 0) >= setWeight;

                const assetEvaluation = smartAllocationTotalEvaluation * setWeight;

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
                                            <Slider.Range className="absolute h-full bg-yellow-1 rounded-full" />
                                        </Slider.Track>
                                        <Slider.Thumb className="block w-6 h-6 bg-white rounded-full shadow-lg shadow-black-1 hover:bg-yellow-400 focus:outline-none" />
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
                                        <Slider.Track className="flex-grow flex-1 bg-[#D9D9D9] rounded-full h-3">
                                            <Slider.Range className="absolute h-full bg-yellow-1 rounded-full" />
                                        </Slider.Track>
                                        <Slider.Thumb className="block w-6 h-6 bg-white rounded-full shadow-lg shadow-black-1 hover:bg-yellow-400 focus:outline-none" />
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
            if (assetAlreadyExists) {
                if (assetAlreadyExists.removed) {
                    return oldState.map(holding => holding.name === selectedAsset.name ? { ...holding, removed: false } : { ...holding })
                }
            }
            else {
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
                        },
                        removed: false,
                    })
                }
            }
            return newState;
        })
    }, []);

    const assetSelector = useMemo(() => {
        return (
            <AssetSelector
                trigger={<Button disabled={!userHasSubscription} className="flex-1 md:flex-none px-5 min-w-[5rem] bg-blue-1 h-11 rounded-md">{t('common:addAsset')}</Button>}
                onClick={onSelectAsset}
            />
        );
    }, [onSelectAsset, t, userHasSubscription]);

    const tableFooter = useMemo(() => {
        let totalPercentage = 0;
        let totalEvaluation = 0;
        if (smartAllocationHoldings.length) {
            totalPercentage = smartAllocationHoldings?.map(asset => asset.weight)?.reduce((prev, next) => ((prev ?? 0) + (next ?? 0))) ?? 0;
            totalEvaluation = smartAllocationHoldings?.map(asset => (asset.weight ?? 0) * (smartAllocationTotalEvaluation ?? 0))?.reduce((prev, next) => ((prev ?? 0) + (next ?? 0))) ?? 0;
        }
        const is100Percent = totalPercentage === 1;

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
        if (!isLoadingSmartAllocationHoldings || !isLoadingPredefinedAllocationHoldings) {
            return (
                <Row className="col-span-full overflow-auto">
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
    }, [isLoadingPredefinedAllocationHoldings, isLoadingSmartAllocationHoldings, tableBody, tableFooter, tableHeader])

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
                            status: ((holding.weight ?? 0) > 0) ? EnumSmartAllocationAssetStatus.ACTIVE : EnumSmartAllocationAssetStatus.DELETED,
                            id: holding.id,
                        })
                });

                updateSmartAllocation({
                    providerId: selectedExchange?.provider_id,
                    data: assets,
                    smartAllocationAlreadyExists
                })
                    .then((res) => {
                        toast.success(t("smartAllocationWasSavedSuccessfully"));
                        router.push('/smart-allocation/')
                    })
                    .catch((error) => {
                        if (MODE_DEBUG) {
                            console.error("Error while saving smart allocation (saveSmartAllocation)", error)
                        }
                        toast.error(t("somethingWentWrong"))
                    })
                    .finally(() => {
                        setIsSavingSmartAllocation(false);
                    });
            } else {
                toast.error(t('makeSureToAllocate100%OfYourPortfolio'));
            }
        }
    }, [router, selectedExchange?.provider_id, smartAllocationAlreadyExists, smartAllocationHoldings, t])

    if (isLoadingSmartAllocationHoldings || isLoadingPredefinedAllocationHoldings) {
        return <PageLoader />
    } else {
        return (
            <Col className="grid grid-cols-12 gap-10 lg:gap-16 pb-20 items-start justify-start">
                <Col className="w-full md:flex-row justify-between col-span-full gap-5">
                    <Col className="gap-10 flex-1">
                        <Row className="col-span-full gap-1 shrink-0 overflow-auto">
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
                            title="Current weight"
                            chartData={smartAllocationHoldings.map(asset => ({ label: asset?.name ?? "", value: asset.current_value ?? 0, coinSymbol: asset.name ?? "" }))}
                        />
                        <CutoutDoughnutChart
                            title="Set weight"
                            chartData={smartAllocationHoldings.map(asset => ({ label: asset?.name ?? "", value: asset.weight ?? 0, coinSymbol: asset.name ?? "" }))}
                        />
                    </Row>
                </Col>
                {table}
            </Col>
        )
    }
}

export default EditSmartAllocation;