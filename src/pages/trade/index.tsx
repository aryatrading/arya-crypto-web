import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import Layout from "../../components/layout/layout";
import Trade from "../../components/app/trade/trade";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTradables,
  clearTrade,
  setOrderType,
  setPairs,
  setTrade,
  setValidations,
} from "../../services/redux/tradeSlice";
import {
  getAssetValidation,
  getAssetAvailable,
  getAvailablePairs,
} from "../../services/controllers/trade";
import { selectSelectedExchange } from "../../services/redux/exchangeSlice";
import { TradeValidations } from "../../types/trade";

const TradePage = () => {
  const dispatch = useDispatch();
  const selectedExchange = useSelector(selectSelectedExchange);

  const router = useRouter();
  const { symbol } = router.query;

  useEffect(() => {
    (async () => {
      dispatch(
        setTrade({
          asset_name: symbol ?? "btc",
          base_name: "usdt",
          available_quantity: await getAssetAvailable(
            "USDT",
            selectedExchange?.provider_id ?? 1
          ),
        })
      );

      let _validations: TradeValidations = await getAssetValidation(
        `${symbol ?? "btc"}USDT`,
        selectedExchange?.provider_id ?? 1
      );

      let _pairs = await getAvailablePairs(
        symbol ?? "btc",
        selectedExchange?.provider_id ?? 1
      );

      dispatch(addTradables({ assets: _pairs._tradables }));
      dispatch(setPairs({ pairs: _pairs._pairs }));

      dispatch(setValidations(_validations));
      dispatch(setOrderType({ orderType: "MARKET" }));
    })();
    return () => {
      dispatch(clearTrade());
    };
  }, [symbol, selectedExchange]);

  return (
    <Layout>
      <Trade />
    </Layout>
  );
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
    ])),
  },
});
