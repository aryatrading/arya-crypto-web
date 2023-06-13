import { useEffect, useState } from "react";
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
import PageLoader from "../../components/shared/pageLoader/pageLoader";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";

const AssetPage = () => {
  const { t } = useTranslation(["common"]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { s } = router.query;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await getAssetDetails(s ?? "btc");
        await getAssetTimeseriesPrice(s ?? "btc", "5min", 288);
        await getPosts({ searchTerm: s?.toString() ?? "btc" });
      } catch (error) {
        toast.warn(t("somethingWentWrong"));
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      dispatch(clearAsset());
      dispatch(clearSwap());
    };
  }, [s]);

  return <Layout>{loading ? <PageLoader /> : <Asset />}</Layout>;
};

export default AssetPage;

export const getStaticProps: GetStaticProps<any> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en")),
  },
});
