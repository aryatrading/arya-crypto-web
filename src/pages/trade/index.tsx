import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import Layout from "../../components/layout/layout";
import Trade from "../../components/app/trade/trade";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearTrade, getTrade } from "../../services/redux/tradeSlice";
import {
  getAssetCurrentPrice,
  getHistoryOrders,
  initiateTrade,
} from "../../services/controllers/trade";
import { selectSelectedExchange } from "../../services/redux/exchangeSlice";
import { toast } from "react-toastify";
import PageLoader from "../../components/shared/pageLoader/pageLoader";

const TradePage = () => {
  const dispatch = useDispatch();
  const selectedExchange = useSelector(selectSelectedExchange);
  const [loading, setLoading] = useState(false);
  const trade = useSelector(getTrade);

  const router = useRouter();
  const { symbol } = router.query;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await initiateTrade(
          (symbol as string) ?? "BTC",
          selectedExchange?.provider_id ?? 1
        );
      } catch (error) {
        toast.warn("Something went wrong, try again!");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      dispatch(clearTrade());
    };
  }, [symbol, selectedExchange]);

  useEffect(() => {
    getHistoryOrders(trade.asset_name, selectedExchange?.provider_id ?? 1);
    getAssetCurrentPrice(trade.asset_name ?? "btc");
  }, [trade.symbol_name]);

  return <Layout>{loading ? <PageLoader /> : <Trade />}</Layout>;
};

export default TradePage;

export const getStaticProps: GetStaticProps<any> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", [
      "common",
      "auth",
      "nav",
      "asset",
      "coin",
      "trade",
    ])),
  },
});
