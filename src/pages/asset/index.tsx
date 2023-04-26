import { GetStaticProps } from "next";
import Layout from "../../components/layout/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Asset from "../../components/app/asset/asset";
import { useEffect } from "react";
import { getAssetDetails } from "../../services/controllers/asset";
import { useRouter } from "next/router";
import { dispatchAction } from "../../utils/global_dispatch";
import { clearAsset } from "../../services/redux/assetSlice";

const AssetPage = () => {
  const router = useRouter();
  const { symbol } = router.query;

  useEffect(() => {
    if (symbol) getAssetDetails(symbol);
  }, []);

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
