import { FC, useState } from "react";
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
import {
  cancelOpenOrder,
  getAssetOpenOrders,
} from "../../../services/controllers/trade";
import { selectSelectedExchange } from "../../../services/redux/exchangeSlice";
import { isPremiumUser } from "../../../services/redux/userSlice";
import { Row } from "../../shared/layout/flex";
import { LockClosedIcon } from "@heroicons/react/24/solid";

export const StoplossTrade: FC = () => {
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

  const onremovestoploss = async (order: any) => {
    if (order?.order_id) {
      await cancelOpenOrder(
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

    dispatch(addStoploss({ value: slValue }));
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
        className={`${isPremium ? "bg-blue-3" : "bg-grey-1"} rounded-md py-3`}
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
