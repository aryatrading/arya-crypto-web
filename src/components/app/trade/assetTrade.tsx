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
import { getAsset } from "../../../services/redux/assetSlice";
import LoadingSpinner from "../../shared/loading-spinner/loading-spinner";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { createSwapTrade } from "../../../services/controllers/trade";
import { getAssetDetails } from "../../../services/controllers/asset";

const AssetTrade: FC = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { symbol } = router.query;
  const from = useSelector(getFrom);
  const to = useSelector(getTo);
  const provider = useSelector(getProvider);

  const onswapClick = () => {
    if (from?.symbol) {
      dispatch(swap({ from: to, to: from }));
    }
  };

  const onTradePress = async () => {
    if (!from.symbol || !from.quantity)
      return toast.warn("Please select a base asset");

    setLoading(true);
    const paylaod: SwapTradeType = {
      symbol_name: `${to.symbol}${from.symbol}`,
      asset_name: to.symbol,
      base_name: from.symbol,
      entry_order: {
        type: from.symbol.toLowerCase() === symbol ? "SELL" : "BUY",
        trigger_price: 0,
        order_type: "MARKET",
        quantity: 0,
        price: from.quantity,
        price_based: true,
      },
    };

    await createSwapTrade(paylaod, provider)
      .then(async () => {
        await getAssetDetails(symbol);
        dispatch(clearSwap());
        toast.success("Swap trade created");
      })
      .catch((error) => toast.error("Error creating trade"))
      .finally(() => setLoading(false));
  };

  return (
    <Col className="bg-grey-2 px-5 py-5 rounded-md gap-4 items-center">
      <AssetTradeFromInput />
      <Button
        onClick={() => onswapClick()}
        className="flex justify-center items-center rounded-full bg-blue-3 text-white h-11 w-11"
      >
        <ArrowsUpDownIcon className="h-5 w-5" />
      </Button>
      <AssetTradeToInput />
      <Col className="w-full gap-3">
        <Button
          className=" p-2 rounded-md bg-green-1 text-white w-full"
          onClick={() => onTradePress()}
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <p className="text-center font-semibold text-base">Trade</p>
          )}
        </Button>
        <Button className="rounded-md bg-transparent text-white w-full">
          <p className="text-center font-semibold text-base">Advance Mode</p>
        </Button>
      </Col>
    </Col>
  );
};

export default AssetTrade;
