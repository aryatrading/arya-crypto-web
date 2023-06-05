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
  getAssetOpenOrders,
  getHistoryOrders,
  initiateTrade,
} from "../../services/controllers/trade";
import { selectSelectedExchange } from "../../services/redux/exchangeSlice";
import { toast } from "react-toastify";
import PageLoader from "../../components/shared/pageLoader/pageLoader";
import { useTranslation } from "next-i18next";

const TradePage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common"]);
  const selectedExchange = useSelector(selectSelectedExchange);
  const [loading, setLoading] = useState(false);
  const trade = useSelector(getTrade);

  const router = useRouter();
  const { symbol } = router.query;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        dispatch(clearTrade());
        await initiateTrade(
          (symbol as string) ?? "BTC",
          selectedExchange?.provider_id ?? 1
        );
      } catch (error) {
        toast.warn(t("somethingWentWrong"));
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      dispatch(clearTrade());
    };
  }, [symbol, selectedExchange]);

  useEffect(() => {
    getAssetOpenOrders(trade.symbol_name, selectedExchange?.provider_id ?? 1);
    getHistoryOrders(trade.asset_name, selectedExchange?.provider_id ?? 1);
    getAssetCurrentPrice(trade.asset_name ?? "btc");
  }, [trade.symbol_name]);

  return <Layout>{loading ? <PageLoader /> : <Trade />}</Layout>;
};

export default TradePage;

export const getStaticProps: GetStaticProps<any> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en")),
  },
});
