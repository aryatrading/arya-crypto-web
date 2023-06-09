import { useEffect } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "../../components/layout/layout";
import Asset from "../../components/app/asset/asset";
import {
  getAssetDetails,
  getAssetTimeseriesPrice,
} from "../../services/controllers/asset";
import { clearAsset } from "../../services/redux/assetSlice";
import { clearSwap } from "../../services/redux/swapSlice";
import { getPosts } from "../../services/firebase/community/posts";
import { getParameterByName } from "../../utils/helpers/url";

const AssetPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const symbol = getParameterByName("symbol", router.asPath);

    getAssetDetails(symbol ?? "btc");
    getAssetTimeseriesPrice(symbol ?? "btc", "5min", 288);
    if (symbol) {
      getPosts({ searchTerm: symbol?.toString() || "" });
    }
    
    return () => {
      dispatch(clearAsset());
      dispatch(clearSwap());
    };
  }, [dispatch, router]);

  return (
    <Layout>
      <Asset />
    </Layout>
  );
};

export default AssetPage;

export const getStaticProps: GetStaticProps<any> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en")),
  },
});
