import { FC, useCallback, useState } from "react";
import TradeInput from "../../shared/inputs/tradeInput";
import { useDispatch, useSelector } from "react-redux";
import {
  addStoploss,
  getAssetPrice,
  getTrade,
  removeStoploss,
} from "../../../services/redux/tradeSlice";
import Button from "../../shared/buttons/button";
import { selectAssetLivePrice } from "../../../services/redux/marketSlice";
import { ProfitSet } from "../../shared/containers/trade/profit_set";
import { PremiumBanner } from "../../shared/containers/premiumBanner";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { cancelOrder, createTrade, initiateTrade } from "../../../services/controllers/trade";
import { TradeType } from "../../../types/trade";
import { MODE_DEBUG } from "../../../utils/constants/config";
import { selectSelectedExchange } from "../../../services/redux/exchangeSlice";
import { twMerge } from "tailwind-merge";
import {
  getAssetOpenOrders,
} from "../../../services/controllers/trade";
import { isPremiumUser } from "../../../services/redux/userSlice";
import { Row } from "../../shared/layout/flex";
import { LockClosedIcon } from "@heroicons/react/24/solid";

interface ITrailingTrade {
  assetScreen?:boolean
}

export const StoplossTrade: FC<ITrailingTrade> = ({assetScreen}) => {
  const trade = useSelector(getTrade);
  const { t } = useTranslation(["trade"]);
  const _price = useSelector(getAssetPrice);
  const isPremium = useSelector(isPremiumUser);
  const dispatch = useDispatch();
  const _assetprice = useSelector(selectAssetLivePrice);
  const selectedExchange = useSelector(selectSelectedExchange);
  const [slValue, setSlValue] = useState(
    _assetprice[trade?.asset_name?.toLowerCase() ?? "btc"] ?? _price
  );

  const submitStopLoss = useCallback(
    async () => {
      if( !slValue){
        if(MODE_DEBUG){
          console.log(`submitTakeProfit is passed falsy stop loss value:${slValue}`)
        }
        return
      }
      const tradeData:TradeType = {
        symbol_name:trade.symbol_name,
        asset_name:trade.asset_name,
        base_name:trade.base_name,
        available_quantity:trade.available_quantity
      }
      tradeData.stop_loss =[{value:slValue}]
      await createTrade(tradeData, selectedExchange?.provider_id ?? 1);
      toast.success(`${trade.symbol_name} stoploss created`);

      await initiateTrade(
        trade.asset_name,
        selectedExchange?.provider_id ?? 1,
        trade.base_name
      );
    },
    [selectedExchange?.provider_id, slValue, trade],
  )

  const onremovestoploss = async (order: any) => {
    if (order?.order_id) {
      await cancelOrder(
        order?.order_id,
        selectedExchange?.provider_id ?? 1
      );
      await getAssetOpenOrders(
        trade.symbol_name,
        selectedExchange?.provider_id ?? 1
      );
      toast.success(t("openorderclosed"));
    }
    dispatch(removeStoploss());
  };

  const onsetstoploss = () => {
    if (slValue <= 0) {
      return toast.info(t("usdtamountreq"));
    }

    if (!isPremium) {
      return toast.info(t("premium"));
    }

    if(assetScreen){
      submitStopLoss()
    }
    else{
      dispatch(addStoploss({ value: slValue }))
    }
  };

  return (
    <>
      {isPremium ? null : <PremiumBanner />}
      <p className="font-bold text-base">{t("addstoploss")}</p>
      <TradeInput
        title={t("price")}
        value={trade.base_name ?? "USDT"}
        amount={slValue}
        onchange={(e: string) => setSlValue(e)}
      />

      <Button
        className={twMerge(isPremium ? "bg-blue-3" : "bg-grey-1",'rounded-md py-3',assetScreen?"mt-auto":'')}
        onClick={() => onsetstoploss()}
      >
        <Row className="justify-center items-center gap-2">
          {isPremium ? null : (
            <LockClosedIcon width={15} height={15} color="bg-orange-1" />
          )}
          <p>{t("addstoploss")}</p>
        </Row>
      </Button>
      {trade && trade?.stop_loss?.length ? (
        <p className="font-bold text-base">{t("stoploss")}</p>
      ) : null}

      {trade &&
        trade?.stop_loss?.map((elm: any, index: number) => {
          return (
            <ProfitSet
              key={index}
              content={`Sell at ${elm.value} USD`}
              profit={{ value: elm.value }}
              symbol={trade.asset_name}
              base="USD"
              action={() => onremovestoploss(elm)}
            />
          );
        })}
    </>
  );
};
