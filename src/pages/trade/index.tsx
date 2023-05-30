import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import Layout from "../../components/layout/layout";
import Trade from "../../components/app/trade/trade";
import { useEffect, useState } from "react";
import { clearTrade, getTrade } from "../../services/redux/tradeSlice";
import {
  getAssetCurrentPrice,
  getHistoryOrders,
  initiateTrade,
} from "../../services/controllers/trade";
import { selectSelectedExchange } from "../../services/redux/exchangeSlice";
import { TradingSalesPage } from "../../components/app/trade/salesPage";
import { toast } from "react-toastify";
import PageLoader from "../../components/shared/pageLoader/pageLoader";

const TradePage = () => {
  const { id } = useAuthUser();
  const dispatch = useDispatch();
  const selectedExchange = useSelector(selectSelectedExchange);
  const [loading, setLoading] = useState(false);
  const trade = useSelector(getTrade);

  const router = useRouter();
  const { symbol } = router.query;

  useEffect(() => {
    if (id != null) {
      initiateTrade(
        (symbol as string) ?? "BTC",
        selectedExchange?.provider_id ?? 1
      );
    }

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
  }, [symbol, selectedExchange, id]);

  useEffect(() => {
    if (id != null) {
      getHistoryOrders(trade.asset_name, selectedExchange?.provider_id ?? 1);
    }
  }, [trade.symbol_name, id]);

  return <Layout>{id != null ? <Trade /> : <TradingSalesPage />}</Layout>;
};

export default withAuthUser({})(TradePage);

export const getStaticProps: GetStaticProps<any> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en")),
  },
});
