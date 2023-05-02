import { useEffect } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "../../components/layout/layout";
import Asset from "../../components/app/asset/asset";
import CoinProfitCalculator from "../../components/shared/coinProfitCalculator";
import { getAssetDetails, getAssetTimeseriesPrice } from "../../services/controllers/asset";
import { clearAsset } from "../../services/redux/assetSlice";
import { Col } from "../../components/shared/layout/flex";
import CoinConverter from "../../components/shared/coinConverter";

const AssetPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { symbol } = router.query;
  const { asset } = useSelector(({ asset }: any) => asset);

  useEffect(() => {
    getAssetDetails(symbol ?? "btc");
    getAssetTimeseriesPrice(symbol ?? "btc", "5min", 288);

    return () => {
      dispatch(clearAsset());
    };
  }, [symbol]);

  return (
    <Layout>
      <Col className="gap-14">
        <Asset />
        <CoinProfitCalculator />
        {asset?.id && <CoinConverter
          preDefined
          staticCoin={asset}
        />}
      </Col>
    </Layout>
  );
};

export default AssetPage;

export const getStaticProps: GetStaticProps<any> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", [
      "common",
      "auth",
      "nav",
      "asset",
      "coin"
    ])),
  },
});
