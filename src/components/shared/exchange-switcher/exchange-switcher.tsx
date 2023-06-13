import { PlayIcon, PlusIcon } from "@heroicons/react/24/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FC, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import clsx from "clsx";

import { Col, Row } from "../layout/flex";
import {
  selectConnectedExchanges,
  selectExchangeStoreStatus,
  selectSelectedExchange,
  setSelectedExchange,
} from "../../../services/redux/exchangeSlice";
import { percentageFormat, formatNumber } from "../../../utils/helpers/prices";
import AsyncStatusWrapper from "../async-status-wrapper/async-status-wrapper";
import ExchangeImage from "../exchange-image/exchange-image";
import { ExchangeType } from "../../../types/exchange.types";
import { useResponsive } from "../../../context/responsive.context";
import { setProvider } from "../../../services/redux/swapSlice";

const ExchangeSwitcher: FC<{
  canSelectOverall?: boolean;
  hideExchangeStats?: boolean;
}> = ({ canSelectOverall = true, hideExchangeStats = false }) => {
  const selectedExchange = useSelector(selectSelectedExchange);
  const exchangeStoreStatus = useSelector(selectExchangeStoreStatus);
  const connectedExchanges = useSelector(selectConnectedExchanges);

  const dispatch = useDispatch();

  const { t } = useTranslation(["common"]);
  const { isMobileOnly } = useResponsive();

  useEffect(() => {
    if (!canSelectOverall) {
      if (!selectedExchange?.provider_id) {
        const notOverallExchange = connectedExchanges?.find(
          (exchange) => exchange.provider_id
        );
        if (notOverallExchange) {
          dispatch(setSelectedExchange(notOverallExchange));
        }
      }
    }
  }, [
    canSelectOverall,
    connectedExchanges,
    dispatch,
    selectedExchange?.provider_id,
  ]);

  const changePercentage = useCallback((exchange: ExchangeType | null) => {
    const changeIn24h = exchange?.["24h_change_percentage"] ?? 0;

    const isPriceChangePositive = changeIn24h >= 0;
    const signal = isPriceChangePositive ? "+" : "-";
    const formattedChangePercentage = `${signal}${percentageFormat(
      Math.abs(changeIn24h)
    )}`;

    return (
      <Row
        className={clsx("p-1 rounded-md", {
          "text-green-1 bg-green-2": isPriceChangePositive,
          "text-red-1 bg-red-2": !isPriceChangePositive,
        })}
      >
        <p>{formattedChangePercentage}%</p>
      </Row>
    );
  }, []);

  const selectExchange = useCallback(
    (exchange: ExchangeType) => {
      dispatch(setProvider(exchange.provider_id ?? 0));
      dispatch(setSelectedExchange(exchange));
    },
    [dispatch]
  );

  const dropdownItem = useCallback(
    (exchange: ExchangeType) => {
      const isSelected =
        selectedExchange?.provider_id === exchange?.provider_id;
      const isNotSelectable = !exchange?.provider_id && !canSelectOverall;
      return (
        <DropdownMenu.Item
          disabled={isNotSelectable}
          key={exchange.name}
          className={clsx(
            {
              "bg-grey-4": isSelected,
              "cursor-pointer": !isNotSelectable,
            },
            "h-20 py-3 px-9 rounded-md"
          )}
          onClick={() => {
            if (!isNotSelectable) selectExchange(exchange);
          }}
        >
          <Row className="items-center gap-5 h-full">
            <ExchangeImage
              providerId={exchange?.provider_id}
              width={37}
              height={37}
            />
            <Col className="font-bold text-sm gap-1">
              <p className="capitalize">
                {exchange?.name?.toLocaleLowerCase()}
              </p>
              <Row className="gap-2 items-center">
                <p>{formatNumber(exchange.last_5m_evaluation, true)} USD</p>
                {changePercentage(exchange)}
              </Row>
            </Col>
          </Row>
        </DropdownMenu.Item>
      );
    },
    [
      canSelectOverall,
      changePercentage,
      selectExchange,
      selectedExchange?.provider_id,
    ]
  );

  const dropdown = useMemo(() => {
    return (
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <button>
            <Row className="items-center justify-center gap-2 z-10">
              <ExchangeImage providerId={selectedExchange?.provider_id} />
              <h3 className="text-xl md:text-3xl font-bold capitalize">
                {selectedExchange?.name?.toLowerCase()}
              </h3>
              <PlayIcon
                className="rotate-90 text-blue-1"
                height="15px"
                width="15px"
              />
            </Row>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={15}
            align="start"
            side={isMobileOnly ? "bottom" : "right"}
            className="w-[400px] max-w-[calc(100%_-_28px)] bg-grey-3 rounded-md overflow-hidden z-10"
          >
            {connectedExchanges?.map((exchange) => dropdownItem(exchange))}

            <DropdownMenu.Item className={"p-4 rounded-md"} disabled={true}>
              <Row className="items-center gap-5 h-full">
                <Link
                  href="settings?tab=exchange"
                  className="w-full py-3 px-2 rounded-md bg-grey-2"
                >
                  <Row className="w-full font-bold justify-center gap-1">
                    <PlusIcon width={20} />
                    <p className="text-bold">{t("addExchange")}</p>
                  </Row>
                </Link>
              </Row>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }, [connectedExchanges, dropdownItem, selectedExchange?.name, selectedExchange?.provider_id, t]);

  return (
    <AsyncStatusWrapper
      asyncStatus={exchangeStoreStatus}
      whenIdleComponent={<Skeleton />}
      whenPendingComponent={<Skeleton />}
      whenRejectedComponent={<></>}
    >
      <Col className="col-span-12 items-center md:items-start gap-1">
        {dropdown}
        {hideExchangeStats === false ? (
          <Row className="items-center gap-3">
            <h3 className="text-3xl md:text-4xl font-bold">
              {formatNumber(selectedExchange?.last_5m_evaluation ?? 0, true)}{" "}
            </h3>
            {changePercentage(selectedExchange)}
          </Row>
        ) : null}
      </Col>
    </AsyncStatusWrapper>
  );
};

export default ExchangeSwitcher;
