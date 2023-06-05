import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import Layout from "../../components/layout/layout";
import Trade from "../../components/app/trade/trade";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearTrade, getTrade } from "../../services/redux/tradeSlice";
import {
  getHistoryOrders,
  initiateTrade,
} from "../../services/controllers/trade";
import { selectSelectedExchange } from "../../services/redux/exchangeSlice";

const TradePage = () => {
  const dispatch = useDispatch();
  const selectedExchange = useSelector(selectSelectedExchange);
  const trade = useSelector(getTrade);

  const router = useRouter();
  const { symbol } = router.query;

  useEffect(() => {
    initiateTrade(
      (symbol as string) ?? "BTC",
      selectedExchange?.provider_id ?? 1
    );

    return () => {
      dispatch(clearTrade());
    };
  }, [symbol, selectedExchange]);

  useEffect(() => {
    getHistoryOrders(trade.asset_name, selectedExchange?.provider_id ?? 1);
  }, [trade.symbol_name]);

  return (
    <Layout>
      <Trade />
    </Layout>
  );
};

export default TradePage;

export const getStaticProps: GetStaticProps<any> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en")),
  },
});
