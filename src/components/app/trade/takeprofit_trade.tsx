import { FC, useEffect, useState } from "react";
import TradeInput from "../../shared/inputs/tradeInput";
import {
  addTakeProfit,
  getAssetPrice,
  getTrade,
  setTakeProfit,
} from "../../../services/redux/tradeSlice";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../shared/buttons/button";
import { ProfitSet } from "../../shared/containers/trade/profit_set";
import {
  cancelOpenOrder,
  getAssetAvailable,
  getAssetOpenOrders,
} from "../../../services/controllers/trade";
import { selectSelectedExchange } from "../../../services/redux/exchangeSlice";
import { TimeseriesPicker } from "../../shared/containers/asset/graphTimeseries";
import { percentTabs } from "../../../utils/constants/profitsPercentage";
import { PremiumBanner } from "../../shared/containers/premiumBanner";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { selectAssetLivePrice } from "../../../services/redux/marketSlice";
import { isPremiumUser } from "../../../services/redux/userSlice";

export const TakeprofitTrade: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["trade"]);
  const trade = useSelector(getTrade);
  const _price = useSelector(getAssetPrice);
  const isPremium = useSelector(isPremiumUser);
  const _assetprice = useSelector(selectAssetLivePrice);
  const selectedExchange = useSelector(selectSelectedExchange);
  const [values, setValues] = useState({
    value: _assetprice[trade?.asset_name?.toLowerCase() ?? "btc"] ?? _price,
    quantity: 0,
  });
  const [available, setAvailable] = useState("");
  const [percent, setPercent] = useState("5");

  useEffect(() => {
    (async () => {
      let _res = await getAssetAvailable(
        trade.asset_name ?? "btc",
        selectedExchange?.provider_id ?? 1
      );

      setAvailable(_res);
    })();
  }, [selectedExchange?.provider_id, trade.symbol_name]);

  const onAddTp = () => {
    if (trade?.take_profit?.length >= 3) {
      return toast.info(t("tp3"));
    }

    if (values.quantity <= 0) {
      return toast.info(t("addentrtyqty"));
    }

    if (values.value <= 0) {
      return toast.info(t("usdtamountreq"));
    }

    if (!isPremium) {
      return toast.info(t("premium"));
    }

    dispatch(addTakeProfit(values));
  };

  const onremoveProfit = async (_index: number) => {
    let _new = trade.take_profit;
    _new = _new.filter((elm: any, index: number) => index !== _index);

    if (_new[_index]?.order_id) {
      await cancelOpenOrder(
        _new[_index]?.order_id,
        selectedExchange?.provider_id ?? 1
      );
      await getAssetOpenOrders(
        trade.symbol_name,
        selectedExchange?.provider_id ?? 1
      );
      toast.success(t("openorderclosed"));
    }

    dispatch(setTakeProfit(_new));
  };

  return (
    <>
      {isPremium ? null : <PremiumBanner />}
      <p className="font-bold text-base">{t("addtakeprofit")}</p>
      <TradeInput
        title={t("price")}
        value={"USDT"}
        amount={values?.value}
        onchange={(e: any) => setValues({ ...values, value: e })}
      />
      <TradeInput
        title={t("quantity")}
        value={trade.asset_name ?? "BTC"}
        amount={values.quantity}
        onchange={(e: any) => setValues({ ...values, quantity: e })}
        header={available}
      />
      <div className="flex justify-center">
        <TimeseriesPicker
          series={percentTabs}
          active={percent}
          onclick={(e: any) => {
            setPercent(e.key);
            setValues({
              ...values,
              quantity: (e.key / 100) * Number(available),
            });
          }}
        />
      </div>
      <Button className="bg-blue-3 rounded-md py-3" onClick={() => onAddTp()}>
        <p>{t("addtakeprofit")}</p>
      </Button>
      {trade && trade?.take_profit?.length ? (
        <p className="font-bold text-base">{t("takeprofit")}</p>
      ) : null}

      {trade &&
        trade?.take_profit?.map((elm: any, index: number) => {
          return (
            <ProfitSet
              key={index}
              content={`Sell ${elm.quantity} ${trade.asset_name} at ${elm.value} USD`}
              profit={{ value: 3 }}
              symbol={trade.asset_name}
              quantity="3"
              base="USD"
              action={() => onremoveProfit(index)}
            />
          );
        })}
    </>
  );
};
