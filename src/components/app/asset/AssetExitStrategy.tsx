import React, { useEffect, useMemo, useState } from "react";
import AssetTrade from "../trade/assetTrade";
import { Col, Row } from "../../shared/layout/flex";
import { StoplossTrade } from "../trade/stoploss_trade";
import { TakeprofitTrade } from "../trade/takeprofit_trade";
import { TrailingTrade } from "../trade/trailing_trade";
import { useSelector } from "react-redux";
import { selectSelectedExchange } from "../../../services/redux/exchangeSlice";
import _ from "lodash";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  TpHeaderOptions,
  TrailingHeaderOptions,
} from "../../../utils/constants/asset";
import { MODE_DEBUG } from "../../../utils/constants/config";
import { cancelOrder } from "../../../services/controllers/trade";
import { toast } from "react-toastify";
import Button from "../../shared/buttons/button";
import { Order } from "../../../types/trade";
import { getAsset } from "../../../services/redux/assetSlice";
import { getOpenOrdersApi } from "../../../services/controllers/asset";
import { useTranslation } from "react-i18next";
import { useResponsive } from "../../../context/responsive.context";
import { formatNumber } from "../../../utils/helpers/prices";

const AssetExitStrategy = () => {
  const { t } = useTranslation(["trade"]);
  const selectedExchange = useSelector(selectSelectedExchange);

  const asset = useSelector(getAsset);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    openOrders();
  }, [asset.name]);

  const openOrders = async () => {
    const _data = await getOpenOrdersApi(
      asset.symbol?.toUpperCase() ?? "BTC",
      selectedExchange?.provider_id ?? 1
    );
    setOrders(_data);
  };

  const deleteExitStrategy = (orderId: number) => {
    if (!orderId || !selectedExchange?.provider_id) {
      if (MODE_DEBUG) {
        console.log(
          `deleteExitStrategy called with false orderId:${orderId} or provider:${selectedExchange?.provider_id}`
        );
      }
      return;
    }
    cancelOrder(orderId, selectedExchange?.provider_id)
      .then(() => {
        openOrders();
        toast.success("Order cancelled successfully");
      })
      .catch(() => {
        toast.error("Error cancelling order");
      });
  };

  const ExitStrategyOptions = [
    {
      heading: t("whatistp"),
      text: t("tpdescription"),
      component: (
        <TakeprofitTrade assetScreen={true} postCreation={() => openOrders()} />
      ),
    },
    {
      heading: t("whatissl"),
      text: t("sldescription"),
      component: (
        <StoplossTrade assetScreen={true} postCreation={() => openOrders()} />
      ),
    },
    {
      heading: t("whatistr"),
      text: t("trdescription"),
      component: (
        <TrailingTrade assetScreen={true} postCreation={() => openOrders()} />
      ),
    },
  ];

  const OpenOrdersOptions = useMemo(() => {
    return [
      {
        name: t("takeprofit"),
        values: orders.filter((order) => order.type === "TP"),
        header: TpHeaderOptions,
      },
      {
        name: t("stoploss"),
        values: orders.filter((order) => order.type === "SL"),
        header: TpHeaderOptions,
      },
      {
        name: t("trailing"),
        values: orders.filter((order) => order.type === "T_SL"),
        header: TrailingHeaderOptions,
      },
    ];
  }, [orders]);

  return (
    <Col className="w-full gap-6">
      <Row className="w-full lg:hidden">
        <AssetTrade />
      </Row>
      <Col className="lg:flex-row w-full gap-4">
        {ExitStrategyOptions.map((option) => {
          return (
            <Col
              key={_.uniqueId()}
              className="gap-4 w-full bg-black-2 p-4  rounded-md"
            >
              <span className="font-semibold text-base">{option.heading}</span>
              <span className="text-sm">{option.text}</span>
              {option.component}
            </Col>
          );
        })}
      </Col>

      <Col className="gap-10">
        {OpenOrdersOptions.filter((option) => !!option.values.length).map(
          (option) => {
            const { values, header }: any = option;
            return (
              <Col className="gap-8">
                <span className="font-semibold text-2xl">{option.name}</span>
                <table className="table-fixed text-center w-full">
                  <thead className="bg-black-2 ">
                    <tr className="text-grey-1 font-medium text-base">
                      {header.map((option: string) => (
                        <th className="py-4 first:rounded-l-lg last:rounded-r-lg">
                          {option}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {values.map((order: any, index: any) => {
                      return (
                        <tr className="font-medium text-base" key={index}>
                          {option.name === "Trailing" ? (
                            <td>
                              {order?.order_delta?.trailing_delta
                                ? t("percentage")
                                : t("breakeven")}
                            </td>
                          ) : null}
                          <td className="py-4">
                            {option.name === "Trailing"
                              ? order.order_data.activation_price
                              : t("sell")}
                          </td>
                          <td className="py-4">
                            {option.name === "Trailing"
                              ? `${
                                  !!order.order_data?.stop_price
                                    ? order.order_data?.stop_price
                                    : ""
                                }`
                              : order?.quantity}
                          </td>
                          <td className="py-4">
                            {option.name === "Trailing"
                              ? `${
                                  !!order.order_data?.trailing_delta
                                    ? order.order_data.trailing_delta * 100
                                    : 0
                                }`
                              : formatNumber(order?.order_value, true)}
                          </td>
                          <td className="py-4">
                            <Button
                              onClick={() => deleteExitStrategy(order.id)}
                              className="flex w-full justify-center"
                            >
                              <TrashIcon className="w-6" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Col>
            );
          }
        )}
      </Col>
    </Col>
  );
};

export default AssetExitStrategy;
