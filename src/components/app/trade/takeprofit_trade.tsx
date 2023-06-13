import { FC, useCallback, useEffect, useState } from "react";
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
  getAssetAvailable,
  getAssetOpenOrders,
  createTrade,
  initiateTrade,
  cancelOrder,
} from "../../../services/controllers/trade";
import { selectSelectedExchange } from "../../../services/redux/exchangeSlice";
import { TimeseriesPicker } from "../../shared/containers/asset/graphTimeseries";
import { percentTabs } from "../../../utils/constants/profitsPercentage";
import { PremiumBanner } from "../../shared/containers/premiumBanner";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { TradeType } from "../../../types/trade";
import { MODE_DEBUG } from "../../../utils/constants/config";
import { twMerge } from "tailwind-merge";
import { selectAssetLivePrice } from "../../../services/redux/marketSlice";
import { isPremiumUser } from "../../../services/redux/userSlice";
import { Row } from "../../shared/layout/flex";
import { LockClosedIcon } from "@heroicons/react/24/solid";

interface ITrailingTrade {
  assetScreen?: boolean;
  postCreation?: Function;
}

export const TakeprofitTrade: FC<ITrailingTrade> = ({
  assetScreen,
  postCreation,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["trade"]);
  const trade: TradeType = useSelector(getTrade);
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
  }, [selectedExchange?.provider_id, trade.asset_name, trade.symbol_name]);

  const onAddTp = () => {
    if (trade?.take_profit?.length ?? 0 >= 3) {
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

    if (assetScreen) {
      submitTakeProfit();
    } else {
      dispatch(addTakeProfit(values));
    }
  };

  const submitTakeProfit = useCallback(async () => {
    if (!values.value || !values.quantity) {
      if (MODE_DEBUG) {
        console.log(
          `submitTakeProfit is passed falsy value:${values.value} or quantity:${values.quantity}`
        );
      }
      return;
    }
    const tradeData: TradeType = {
      symbol_name: trade.symbol_name,
      asset_name: trade.asset_name,
      base_name: trade.base_name,
      available_quantity: trade.available_quantity,
    };
    tradeData.take_profit = [values];

    if (MODE_DEBUG) {
      console.log(tradeData);
    }

    await createTrade(tradeData, selectedExchange?.provider_id ?? 1);
    postCreation!();
    toast.success(`${trade.symbol_name} trade created`);

    await initiateTrade(
      trade.asset_name,
      selectedExchange?.provider_id ?? 1,
      trade.base_name
    );
  }, [selectedExchange?.provider_id, trade, values]);

  const onremoveProfit = async (_index: number) => {
    if (!trade.take_profit) {
      return;
    }
    let _new = trade.take_profit;
    _new = _new.filter((elm: any, index: number) => index !== _index);

    if (trade.take_profit[_index].order_id) {
      await cancelOrder(
        trade.take_profit[_index].order_id || 0,
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
          buttonClassName="w-full"
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
      <Button
        className={twMerge(
          isPremium ? "bg-blue-3" : "bg-grey-1",
          "rounded-md py-3",
          assetScreen ? "mt-auto" : ""
        )}
        onClick={() => onAddTp()}
      >
        <Row className="justify-center items-center gap-2">
          {isPremium ? null : (
            <LockClosedIcon width={15} height={15} color="bg-orange-1" />
          )}
          <p>{t("addtakeprofit")}</p>
        </Row>
      </Button>
      {trade && trade?.take_profit?.length ? (
        <p className="font-bold text-base">{t("takeprofit")}</p>
      ) : null}

      {!assetScreen &&
        trade &&
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
