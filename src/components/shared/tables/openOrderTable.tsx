import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Col, Row } from "../layout/flex";
import styles from "./assetsTable.module.scss";
import { useSelector } from "react-redux";
import { getOpenOrders, getTrade } from "../../../services/redux/tradeSlice";
import { ThemedContainer } from "../containers/themedContainer";
import { formatNumber } from "../../../utils/helpers/prices";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";

export const OpenOrders: FC = () => {
  const openOrders = useSelector(getOpenOrders);
  const trade = useSelector(getTrade);

  const isTabletOrMobileScreen = useMediaQuery({
    query: `(max-width:950px)`,
  });
  const isMobileScreen = useMediaQuery({
    query: `(max-width:600px)`,
  });

  const [header, setHeader] = useState([
    "Status",
    "Type",
    "Amount",
    "Price",
    "Creation date",
  ]);

  useEffect(() => {
    if (isMobileScreen) {
      setHeader(["Status", "Type", "Amount"]);
    } else {
      setHeader(["Status", "Type", "Amount", "Price", "Creation date"]);
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
                      {elm.status} {isMobileScreen ? <p>35/5/2023</p> : null}
                    </Col>
                  </th>

                  <ThemedContainer
                    content={elm.type}
                    colorClass={
                      elm.type.toLowerCase() === "sell"
                        ? "bg-red-2"
                        : "bg-green-2"
                    }
                    textColor={
                      elm.type.toLowerCase() === "sell"
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
                      <th className="text-left">{elm.createdAt}</th>
                    </>
                  ) : null}

                  <th>
                    <Row className="justify-start">
                      <button
                        className="bg-transparent"
                        onClick={() => console.log("close")}
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
    </Col>
  );
};
