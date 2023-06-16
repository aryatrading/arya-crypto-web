import { FC, useMemo, useState } from "react";
import { ShadowButton } from "../../shared/buttons/shadow_button";
import { Row } from "../../shared/layout/flex";
import { useSelector, useDispatch } from "react-redux";
import {
  getAssetPrice,
  getTrade,
  setOrderType,
  setPrice,
  setQuantity,
  setSide,
  setTrade,
  setTriggerPrice,
} from "../../../services/redux/tradeSlice";
import { Tab, TabList, Tabs } from "react-tabs";
import { formatNumber } from "../../../utils/helpers/prices";
import TradeInput from "../../shared/inputs/tradeInput";
import { selectAssetLivePrice } from "../../../services/redux/marketSlice";
import { TimeseriesPicker } from "../../shared/containers/asset/graphTimeseries";
import { percentTabs } from "../../../utils/constants/profitsPercentage";
import { useTranslation } from "next-i18next";
import { getAssetAvailable } from "../../../services/controllers/trade";
import { selectSelectedExchange } from "../../../services/redux/exchangeSlice";
import { isPremiumUser } from "../../../services/redux/userSlice";
import { toast } from "react-toastify";
import { PremiumBanner } from "../../shared/containers/premiumBanner";

export const EntryTrade: FC = () => {
  const dispatch = useDispatch();
  const _assetprice = useSelector(selectAssetLivePrice);
  const _price = useSelector(getAssetPrice);
  const isPremium = useSelector(isPremiumUser);
  const [percent, setPercent] = useState("");
  const { t } = useTranslation(["trade"]);
  const trade = useSelector(getTrade);
  const [tabIndex, setIndex] = useState(
    trade?.entry_order && trade?.entry_order?.order_type === "MARKET"
      ? 0
      : 1 ?? 0
  );
  const selectedExchange = useSelector(selectSelectedExchange);

  const livePrice = useMemo(() => {
    return (
      _assetprice[trade?.asset_name?.toLowerCase() ?? "btc"] ?? _price ?? 0
    );
  }, [trade?.asset_name]);

  const onBuySelect = async () => {
    dispatch(setSide({ side: "BUY" }));
    dispatch(
      setTrade({
        asset_name: trade.asset_name ?? "btc",
        base_name: trade.base_name ?? "usdt",
        available_quantity: await getAssetAvailable(
          trade.base_name,
          selectedExchange?.provider_id ?? 1
        ),
      })
    );
  };

  const onSellSelect = async () => {
    dispatch(
      setTrade({
        asset_name: trade.asset_name ?? "btc",
        base_name: trade.base_name ?? "usdt",
        available_quantity: await getAssetAvailable(
          trade.asset_name,
          selectedExchange?.provider_id ?? 1
        ),
      })
    );
    dispatch(setSide({ side: "SELL" }));
  };

  return (
    <>
      <Row className="w-full justify-evenly gap-2">
        <ShadowButton
          title={t("buy")}
          bgColor={
            trade?.entry_order?.type === "BUY" ? "bg-green-1" : "bg-green-2"
          }
          onClick={() => onBuySelect()}
          textColor="text-white"
          border="rounded-md w-full text-center"
        />
        <ShadowButton
          title={t("sell")}
          bgColor={
            trade?.entry_order?.type === "SELL" ? "bg-red-1" : "bg-red-2"
          }
          onClick={() => onSellSelect()}
          textColor="text-white"
          border="rounded-md w-full text-center"
        />
      </Row>
      <div className="w-full">
        <Tabs
          selectedIndex={tabIndex}
          selectedTabClassName="text-blue-1 font-bold text-lg border-b-2 border-blue-1"
        >
          <TabList className="border-b-[1px] border-grey-3 mb-2">
            <Row className="gap-6">
              <Tab
                className="font-semibold text-sm outline-none cursor-pointer w-full text-center"
                onClick={() => {
                  setIndex(0);
                  dispatch(
                    setTriggerPrice({
                      price: livePrice,
                    })
                  );
                  dispatch(setOrderType({ orderType: "MARKET" }));
                }}
              >
                {t("market")}
              </Tab>
              <Tab
                className="font-semibold text-sm outline-none cursor-pointer w-full text-center"
                onClick={() => {
                  if (!isPremium) {
                    return toast.info(t("premium"));
                  }
                  setIndex(1);
                  dispatch(setOrderType({ orderType: "CONDITIONAL" }));
                }}
              >
                {t("conditional")}
              </Tab>
            </Row>
          </TabList>
        </Tabs>
      </div>
      {isPremium ? null : <PremiumBanner />}
      <p className="font-bold text-sm">
        {t("available")}: {formatNumber(trade.available_quantity)}{" "}
        {trade?.entry_order?.type === "SELL"
          ? trade.asset_name
          : trade.base_name}
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
          trade?.entry_order?.trigger_price
            ? trade?.entry_order?.trigger_price
            : livePrice
        }
        onchange={(e: string) => dispatch(setTriggerPrice({ price: e }))}
      />
      <TradeInput
        title={t("units")}
        value={trade.asset_name}
        amount={trade?.entry_order?.quantity}
        onchange={(e: any) => {
          setPercent("");
          dispatch(
            setPrice({
              price: livePrice * e,
            })
          );
          dispatch(
            setQuantity({
              quantity: e,
            })
          );
        }}
      />

      <div className="flex justify-center items-center">
        <TimeseriesPicker
          series={percentTabs}
          active={percent}
          onclick={async (e: any) => {
            setPercent(e.key);

            if (trade?.entry_order?.type === "SELL") {
              dispatch(
                setQuantity({
                  quantity: trade.available_quantity * (e.key / 100),
                })
              );
              dispatch(
                setPrice({
                  price:
                    (e.key / 100) *
                    (await getAssetAvailable(
                      trade.base_name,
                      selectedExchange?.provider_id ?? 1
                    )),
                })
              );
            } else {
              dispatch(
                setQuantity({
                  quantity:
                    (trade.available_quantity * (e.key / 100)) / livePrice,
                })
              );
              dispatch(
                setPrice({ price: trade.available_quantity * (e.key / 100) })
              );
            }
          }}
        />
      </div>
      <TradeInput
        title={t("total")}
        value={trade.base_name}
        amount={trade?.entry_order?.price}
        onchange={(e: any) => {
          setPercent("");
          dispatch(setPrice({ price: e }));
          dispatch(
            setQuantity({
              quantity: e / livePrice,
            })
          );
        }}
      />
    </>
  );
};
