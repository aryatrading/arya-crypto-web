import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Col, Row } from "../layout/flex";
import styles from "./assetsTable.module.scss";
import { useSelector } from "react-redux";
import { getHistoryOrders, getTrade } from "../../../services/redux/tradeSlice";
import { ThemedContainer } from "../containers/themedContainer";
import { formatNumber } from "../../../utils/helpers/prices";
import moment from "moment";
import { useTranslation } from "next-i18next";

export const OrderHistory: FC = () => {
  const history = useSelector(getHistoryOrders);
  const trade = useSelector(getTrade);
  const { t } = useTranslation(["common"]);

  const isTabletOrMobileScreen = useMediaQuery({
    query: `(max-width:950px)`,
  });
  const isMobileScreen = useMediaQuery({
    query: `(max-width:600px)`,
  });

  const [header, setHeader] = useState([
    t("date"),
    t("type"),
    t("amount"),
    t("price"),
    t("exchange"),
  ]);

  useEffect(() => {
    if (isMobileScreen) {
      setHeader(["Date", t("type"), t("amount")]);
    } else {
      setHeader([t("date"), t("type"), t("amount"), t("price"), t("exchange")]);
    }
  }, [isTabletOrMobileScreen, isMobileScreen]);

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
          </tr>
        </thead>

        <tbody>
          {history &&
            history.map((elm: any, index: number) => {
              return (
                <tr
                  key={index}
                  className="hover:bg-black-2/25 hover:bg-blend-darken cursor-pointer"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-bold leading-6 text-white text-left"
                  >
                    <Col>{moment(elm.createdAt).format("DD/MM/YY")}</Col>
                  </th>

                  <ThemedContainer
                    content={elm.type}
                    colorClass={
                      elm.type?.toLowerCase() === "sell"
                        ? "bg-red-2 mb-3"
                        : "bg-green-2 mb-3"
                    }
                    textColor={
                      elm.type?.toLowerCase() === "sell"
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
                      <th className="text-left">{elm.exchange}</th>
                    </>
                  ) : null}
                </tr>
              );
            })}
        </tbody>
      </table>
    </Col>
  );
};
