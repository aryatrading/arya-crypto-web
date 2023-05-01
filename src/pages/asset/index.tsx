import { GetStaticProps } from "next";
import Layout from "../../components/layout/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Asset from "../../components/app/asset/asset";
import { useEffect } from "react";
import {
  getAssetDetails,
  getAssetTimeseriesPrice,
} from "../../services/controllers/asset";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { clearAsset } from "../../services/redux/assetSlice";

const AssetPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { symbol } = router.query;

  useEffect(() => {
    getAssetDetails(symbol ?? "btc");
    getAssetTimeseriesPrice(symbol ?? "btc", "5min", 288);

    return () => {
      dispatch(clearAsset());
    };
  }, [symbol]);

  return (
    <Layout>
      <Asset />
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
    ])),
  },
});
