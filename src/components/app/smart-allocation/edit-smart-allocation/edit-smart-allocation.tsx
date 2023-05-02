import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Col, Row } from "../../../shared/layout/flex"
import ExchangeSwitcher from "../../../shared/exchange-switcher/exchange-switcher"
import Button from "../../../shared/buttons/button"
import PortfolioComposition from "../../../shared/portfolio-composition/portfolio-composition"
import { PortfolioSnapshotType } from "../../../../types/exchange.types"
import { SmartAllocationAssetType } from "../../../../types/smart-allocation.types"
import { useSelector } from "react-redux"
import { getPortfolioSnapshots, getSmartAllocation } from "../../../../services/controllers/market"
import { selectSelectedExchange } from "../../../../services/redux/exchangeSlice"
import { MODE_DEBUG } from "../../../../utils/constants/config"
import { useTranslation } from "next-i18next"
import { CustomizeAllocationIcon } from "../../../svg/smart-allocation/customize-portfolio-icon"
import { percentageFormat, priceFormat } from "../../../../utils/helpers/prices"
import Image from "next/image"
import clsx from "clsx"
import styles from "./edit-smart-allocation.module.scss";
import { TrashIcon } from "@heroicons/react/24/outline"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { USDTSymbol } from "../../../../utils/constants/market"

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
                const data: any = res.data;
                const holdings: SmartAllocationAssetType[] = data.assets;
                setSmartAllocationTotalEvaluation(data.total_asset_value);

                if (holdings) {
                    holdings.sort((a, b) => ((b.current_weight) - (a.current_weight)));
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


    const table = useMemo(() => {
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
                                        <td className={clsx({ "text-green-1": isCurrentWeightMoreThanSetWeight, "text-red-1": !isCurrentWeightMoreThanSetWeight })}>
                                            {percentageFormat(currentWeight * 100)}%
                                        </td>
                                        <td className="">
                                            <Row className="w-full gap-4 items-center">
                                                <Row className="flex-1 rounded-full overflow-hidden bg-white" style={{ height: 10 }}>
                                                    <Row
                                                        className={`bg-yellow-1 rounded-full`}
                                                        style={{
                                                            width: `${percentageFormat(setWeight * 100)}%`
                                                        }}
                                                    />
                                                </Row>
                                                <input
                                                    className="bg-white text-black-1 w-12 h-8 text-center rounded-md"
                                                    value={percentageFormat(setWeight * 100)}
                                                    type="number"
                                                    onChange={(event) => {
                                                        setSmartAllocationHoldings((oldState) => {
                                                            return oldState.map((holding) => {
                                                                if (holding.name === asset.name) {
                                                                    return { ...holding, current_weight: parseFloat(event.target.value)/ 100 }
                                                                } else {
                                                                    return holding;
                                                                }
                                                            })
                                                        })
                                                    }}
                                                />
                                                <p className="font-bold">%</p>
                                                <p className="font-bold">USD $1,021</p>
                                            </Row>
                                        </td>
                                        <td><XMarkIcon width={20} height={20} color="white" /></td>
                                    </tr>
                                );
                            })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={6} className="rounded-lg overflow-hidden">
                            </td>
                            <td className="rounded-lg overflow-hidden">
                                <Row className="w-full justify-between gap-4 items-center font-bold text-white">
                                    <Row className="flex-1 justify-between items-center">
                                        <Button className="px-5 min-w-[10rem] bg-blue-1 h-10 rounded-md">Add asset</Button>
                                        <p>Total</p>
                                    </Row>
                                    <p className="text-green-1 w-12 text-center">100%</p>
                                    <p className="text-green-1 w-3"></p>
                                    <p className="text-green-1">USD $1,021</p>
                                </Row>
                            </td>
                            <td>
                            </td>
                        </tr>
                    </tfoot>
                </table>

            </Row>
        )
    }, [smartAllocationHoldings, smartAllocationTotalEvaluation, t])

    return (
        <Col className="w-full grid grid-cols-12 md:gap-10 lg:gap-16 pb-20 items-start justify-start">
            <Row className="col-span-full gap-1">
                <p>Smart allocation</p>
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
                    <PortfolioComposition portfolioAssets={smartAllocationHoldings.map(asset => {
                        return {
                            name: asset.name,
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