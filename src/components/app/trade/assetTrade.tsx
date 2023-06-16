import { FC, useState } from "react";
import { Col } from "../../shared/layout/flex";
import AssetTradeFromInput from "./assetTradeFromInput";
import AssetTradeToInput from "./assetTradeToInput";
import Button from "../../shared/buttons/button";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSwap,
  getFrom,
  getProvider,
  getTo,
  swap,
} from "../../../services/redux/swapSlice";
import { SwapTradeType } from "../../../types/trade";
import LoadingSpinner from "../../shared/loading-spinner/loading-spinner";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { createSwapTrade } from "../../../services/controllers/trade";
import { getAssetDetails } from "../../../services/controllers/asset";
import { useTranslation } from "next-i18next";
import ExchangeSwitcher from "../../shared/exchange-switcher/exchange-switcher";

const AssetTrade: FC = () => {
  const { t } = useTranslation(["asset"]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { s } = router.query;
  const from = useSelector(getFrom);
  const to = useSelector(getTo);
  const provider = useSelector(getProvider);

  const onswapClick = () => {
    if (from?.symbol) {
      dispatch(swap({ from: to, to: from }));
    }
  };

  const onTradePress = async () => {
    if (!provider) {
      return toast.warn(t("select_provider"));
    }
    if (!from.symbol || !from.quantity) return toast.warn(t("select_base"));

    setLoading(true);
    const payload: SwapTradeType = {
      symbol_name:
        provider === 2
          ? `${to.symbol}-${from.symbol}`
          : `${to.symbol}${from.symbol}`,
      asset_name: to.symbol,
      base_name: from.symbol,
      entry_order: {
        type: from.symbol.toLowerCase() === s ? "SELL" : "BUY",
        trigger_price: 0,
        order_type: "MARKET",
        quantity: 0,
        price: from.quantity,
        price_based: true,
      },
    };

    if (payload.entry_order.type === "SELL") {
      payload.symbol_name =
        provider === 2
          ? `${from.symbol}-${to.symbol}`
          : `${from.symbol}${to.symbol}`;
      payload.asset_name = from.symbol;
      payload.base_name = to.symbol;
    }

    await createSwapTrade(payload, provider)
      .then(async () => {
        await getAssetDetails(s);
        dispatch(clearSwap());
        toast.success(t("swap_success"));
      })
      .catch((error) => toast.error(t("trade_error")))
      .finally(() => setLoading(false));
  };

  return (
    <Col className="bg-grey-2 px-5 py-5 rounded-md gap-5">
      <ExchangeSwitcher hideExchangeStats={true} canSelectOverall={false} />

      <AssetTradeFromInput />
      <div className="flex justify-center">
        <Button
          onClick={() => onswapClick()}
          className="flex justify-center items-center rounded-full bg-blue-3 text-white h-11 w-11"
        >
          <ArrowsUpDownIcon className="h-5 w-5" />
        </Button>
      </div>
      <AssetTradeToInput />
      <Col className="w-full gap-3">
        <Button
          className=" p-2 rounded-md bg-green-1 text-white w-full"
          onClick={onTradePress}
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <p className="text-center font-semibold text-base">
              {t("trade_title")}
            </p>
          )}
        </Button>
        <Button
          className="rounded-md bg-transparent text-white w-full"
          onClick={() => router.push(`/trade?s=${s}`)}
        >
          <p className="text-center font-semibold text-base">
            {t("advance_mode")}
          </p>
        </Button>
      </Col>
    </Col>
  );
};

export default AssetTrade;
