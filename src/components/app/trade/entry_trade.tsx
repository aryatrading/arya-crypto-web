import { FC, useState } from "react";
import { ShadowButton } from "../../shared/buttons/shadow_button";
import { Row } from "../../shared/layout/flex";
import { useSelector, useDispatch } from "react-redux";
import {
  getTrade,
  setOrderType,
  setQuantity,
  setSide,
  setTriggerPrice,
} from "../../../services/redux/tradeSlice";
import { Tab, TabList, Tabs } from "react-tabs";
import { formatNumber } from "../../../utils/helpers/prices";
import TradeInput from "../../shared/inputs/tradeInput";
import { selectAssetLivePrice } from "../../../services/redux/marketSlice";
import { TimeseriesPicker } from "../../shared/containers/asset/graphTimeseries";
import { percentTabs } from "../../../utils/constants/profitsPercentage";
import { useTranslation } from "next-i18next";

export const EntryTrade: FC = () => {
  const dispatch = useDispatch();
  const _assetprice = useSelector(selectAssetLivePrice);
  const [percent, setPercent] = useState("5");
  const { t } = useTranslation(["trade"]);
  const trade = useSelector(getTrade);

  return (
    <>
      <Row className="w-full justify-evenly gap-2">
        <ShadowButton
          title={t("buy")}
          bgColor={
            trade?.entry_order?.type === "BUY" ? "bg-green-1" : "bg-green-2"
          }
          onClick={() => dispatch(setSide({ side: "BUY" }))}
          textColor="text-white"
          border="rounded-md w-full text-center"
        />
        <ShadowButton
          title={t("sell")}
          bgColor={
            trade?.entry_order?.type === "SELL" ? "bg-red-1" : "bg-red-2"
          }
          onClick={() => dispatch(setSide({ side: "SELL" }))}
          textColor="text-white"
          border="rounded-md w-full text-center"
        />
      </Row>
      <div className="w-full">
        <Tabs selectedTabClassName="text-blue-1 font-bold text-lg border-b-2 border-blue-1">
          <TabList className="border-b-[1px] border-grey-3 mb-2">
            <Row className="gap-6">
              <Tab
                className="font-semibold text-sm outline-none cursor-pointer w-full text-center"
                onClick={() => dispatch(setOrderType({ orderType: "MARKET" }))}
              >
                {t("market")}
              </Tab>
              <Tab
                className="font-semibold text-sm outline-none cursor-pointer w-full text-center"
                onClick={() =>
                  dispatch(setOrderType({ orderType: "CONDITIONAL" }))
                }
              >
                {t("conditional")}
              </Tab>
            </Row>
          </TabList>
        </Tabs>
      </div>
      <p className="font-bold text-sm">
        {t("available")}: {formatNumber(trade.available_quantity)}{" "}
        {trade.base_name}
      </p>
      <TradeInput
        title={t("price")}
        value={trade.base_name}
        disabled={
          trade?.entry_order && trade?.entry_order?.order_type === "MARKET"
            ? true
            : false
        }
        amount={
          trade?.entry_order && trade.entry_order.order_type === "MARKET"
            ? _assetprice[trade?.asset_name?.toLowerCase() ?? "btc"] ?? 0
            : trade?.entry_order?.trigger_price
        }
        onchange={(e: string) =>
          dispatch(setTriggerPrice({ price: parseInt(e) }))
        }
      />
      <TradeInput
        title={t("units")}
        value={trade.asset_name}
        amount={trade?.entry_order?.quantity}
        onchange={(e: string) =>
          dispatch(setQuantity({ quantity: parseInt(e) }))
        }
      />
      <div className="flex justify-center">
        <TimeseriesPicker
          series={percentTabs}
          active={percent}
          onclick={(e: any) => {
            setPercent(e.key);
            dispatch(
              setQuantity({ quantity: trade.available_quantity / e.key })
            );
          }}
        />
      </div>
      <TradeInput
        title={t("total")}
        value={trade.base_name}
        amount={trade?.entry_order?.price ?? 10}
        onchange={(e: string) => console.log(e)}
      />
    </>
  );
};
