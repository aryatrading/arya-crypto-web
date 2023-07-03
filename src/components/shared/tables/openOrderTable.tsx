import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Col, Row } from "../layout/flex";
import styles from "./assetsTable.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  clearOrder,
  getOpenOrders,
  getTrade,
} from "../../../services/redux/tradeSlice";
import { ThemedContainer } from "../containers/themedContainer";
import { formatNumber } from "../../../utils/helpers/prices";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import {
  cancelOrder,
  getAssetOpenOrders,
} from "../../../services/controllers/trade";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { ChartBarIcon } from "@heroicons/react/24/solid";

export const OpenOrders: FC = () => {
  const dispatch = useDispatch();
  const openOrders = useSelector(getOpenOrders);
  const trade = useSelector(getTrade);
  const { t } = useTranslation(["common"]);

  const isTabletOrMobileScreen = useMediaQuery({
    query: `(max-width:950px)`,
  });
  const isMobileScreen = useMediaQuery({
    query: `(max-width:600px)`,
  });

  const [header, setHeader] = useState([
    t("status"),
    t("type"),
    t("amount"),
    t("price"),
    t("date"),
  ]);

  useEffect(() => {
    if (isMobileScreen) {
      setHeader([t("status"), t("type"), t("amount")]);
    } else {
      setHeader([t("status"), t("type"), t("amount"), t("price"), t("date")]);
    }
  }, [isTabletOrMobileScreen, isMobileScreen]);

  const onclosepress = async (order: any) => {
    try {
      await cancelOrder(order.id ?? 1, order.provider_id);
      dispatch(clearOrder());
      await getAssetOpenOrders(trade.symbol_name, order.provider_id);
      toast.success(`${order.type} order closed`);
    } catch (error) {
      toast.info(`Error closing ${order.type} order, try again`);
    }
  };

  return (
    <Col className="flex items-center justify-center flex-1 gap-10 w-full">
      <table className={styles.table}>
        <thead>
          <tr>
            {header.map((elm, index) => {
              return (
                <th key={index} scope="col" className="text-left">
                  {elm}
                </th>
              );
            })}
            <th scope="col" className="text-left">
              <TrashIcon width={20} height={20} />
            </th>
          </tr>
        </thead>

        <tbody>
          {openOrders &&
            openOrders.map((elm: any, index: number) => {
              return (
                <tr
                  key={index}
                  className="hover:bg-black-2/25 hover:bg-blend-darken cursor-pointer"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-bold leading-6 text-white text-left"
                  >
                    <Col>
                      {elm.status}{" "}
                      {isMobileScreen ? (
                        <p> {moment(elm.createdAt).format("MM/DD/YY")}</p>
                      ) : null}
                    </Col>
                  </th>

                  <ThemedContainer
                    content={elm.type}
                    colorClass={
                      elm?.type?.toLowerCase() === "sell"
                        ? "bg-red-2 mb-3"
                        : "bg-green-2 mb-3"
                    }
                    textColor={
                      elm?.type?.toLowerCase() === "sell"
                        ? "text-red-1"
                        : "text-green-1"
                    }
                  />

                  <th className="text-left">
                    <Col>
                      <Row>
                        {elm.amount} {trade?.asset_name ?? "BTC"}
                      </Row>
                      {isMobileScreen ? (
                        <p> {formatNumber(elm?.price ?? 0, true)}</p>
                      ) : null}
                    </Col>
                  </th>
                  {!isMobileScreen ? (
                    <>
                      <th className="text-left">
                        {formatNumber(elm?.price ?? 0, true)}
                      </th>
                      <th className="text-left">
                        {moment(elm.createdAt).format("MM/DD/YY")}
                      </th>
                    </>
                  ) : null}

                  <th>
                    <Row className="justify-start">
                      <button
                        className="bg-transparent"
                        onClick={() => onclosepress(elm)}
                      >
                        <XMarkIcon width={20} height={20} />
                      </button>
                    </Row>
                  </th>
                </tr>
              );
            })}
        </tbody>
      </table>
      {openOrders.length === 0 && <Col className="w-full h-40 items-center justify-center mb-10">
        <ChartBarIcon className="stroke-white fill-white w-12 h-12" />
        <h3 className="font-bold mt-4 text-white">{t('emptyTradeTable')}</h3>
      </Col>}
    </Col>
  );
};
