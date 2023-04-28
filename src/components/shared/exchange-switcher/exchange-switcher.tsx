import { FC, useCallback, useMemo } from "react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/solid"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { useTranslation } from "next-i18next";

import { Col, Row } from "../layout/flex";
import { selectConnectedExchanges, selectExchangeStoreStatus, selectSelectedExchange, setSelectedExchange } from "../../../services/redux/exchangeSlice";
import { percentageFormat, priceFormat } from "../../../utils/helpers/prices";
import LoadingSpinner from "../loading-spinner/loading-spinner";
import AsyncStatusWrapper from "../async-status-wrapper/async-status-wrapper";
import ExchangeImage from "../exchange-image/exchange-image";
import { ExchangeType } from "../../../types/exchange.types";
import Button from "../buttons/button";


const ExchangeSwitcher: FC = () => {

    const selectedExchange = useSelector(selectSelectedExchange);
    const exchangeStoreStatus = useSelector(selectExchangeStoreStatus);
    const connectedExchanges = useSelector(selectConnectedExchanges);

    const dispatch = useDispatch();

    const { t } = useTranslation(["common"]);

    const changePercentage = useCallback((exchange: ExchangeType | null) => {

        const changeIn24h = (exchange?.["24h_change_percentage"] ?? 0);

        const isPriceChangePositive = changeIn24h >= 0;
        const signal = isPriceChangePositive ? '+' : '-';
        const formattedChangePercentage = `${signal}${percentageFormat(Math.abs(changeIn24h))}`;

        return (
            <p className={clsx({ "text-green-1 ": isPriceChangePositive, "text-red-1": !isPriceChangePositive })}>{formattedChangePercentage}%</p>
        )
    }, []);


    const selectExchange = useCallback((exchange: ExchangeType) => {
        dispatch(setSelectedExchange(exchange));
    }, [dispatch]);

    const dropdownItem = useCallback((exchange: ExchangeType) => {
        const isSelected = selectedExchange?.provider_id === exchange?.provider_id;
        return (
            <DropdownMenu.Item
                key={exchange.name}
                className={clsx({ "bg-grey-4": isSelected, "bg-grey-2": !isSelected }, "h-20 py-3 px-9 rounded-md cursor-pointer")}
                onClick={() => {
                    selectExchange(exchange)
                }}
            >
                <Row className="items-center  gap-5 h-full">
                    <ExchangeImage providerId={exchange?.provider_id} width={37} height={37} />
                    <Col className="font-bold text-sm gap-1">
                        <p className="capitalize">{exchange?.name?.toLocaleLowerCase()}</p>
                        <Row className="gap-2 items-center">
                            <p>${priceFormat(exchange.last_5m_evaluation, true)} USD</p>
                            {changePercentage(exchange)}
                        </Row>
                    </Col>
                </Row>
            </DropdownMenu.Item>
        )
    }, [changePercentage, selectExchange, selectedExchange?.provider_id])

    const dropdown = useMemo(() => {
        return (
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="bg-white rounded-full p-2 " aria-label="Customise options">
                        <ChevronDownIcon height="12px" width="12px" color="#558AF2" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal className="z-10">
                    <DropdownMenu.Content className="min-w-[420px] bg-grey-2 rounded-md overflow-hidden z-10" sideOffset={15}>
                        {connectedExchanges?.map(exchange => dropdownItem(exchange))}

                        <DropdownMenu.Item className={"p-4 rounded-md"} disabled={true}>
                            <Row className="items-center gap-5 h-full">
                                <Button className="py-3 px-4 rounded-md bg-blue-1">
                                    <Row className="gap-1">
                                        <PlusIcon width={20} />
                                        <p className="text-bold">
                                            {t("addExchange")}
                                        </p>
                                    </Row>
                                </Button>
                            </Row>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        );
    }, [connectedExchanges, dropdownItem, t])

    return (
        <AsyncStatusWrapper
            asyncStatus={exchangeStoreStatus}
            whenIdleComponent={<LoadingSpinner />}
            whenPendingComponent={<LoadingSpinner />}
            whenRejectedComponent={<></>}
        >
            <Col className="col-span-12 items-start gap-1">
                <Row className="items-center justify-center gap-4 z-10">
                    <ExchangeImage providerId={selectedExchange?.provider_id} />
                    <h3 className="text-3xl font-bold capitalize">{selectedExchange?.name?.toLowerCase()}</h3>
                    {dropdown}
                </Row>
                <Row className="items-center gap-3">
                    <h3 className="text-4xl font-bold">${priceFormat(selectedExchange?.last_5m_evaluation ?? 0, true)} <span className="text-2xl">USD</span></h3>
                    <Row className="bg-green-2 p-1 rounded-md">
                        {changePercentage(selectedExchange)}
                    </Row>
                </Row>
            </Col>
        </AsyncStatusWrapper>
    )
}

export default ExchangeSwitcher;