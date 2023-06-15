import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAuthUser, withAuthUser } from "next-firebase-auth";

import Layout, { SalesPagesLayout } from "../../components/layout/layout";
import Trade from "../../components/app/trade/trade";
import { TradingSalesPage } from "../../components/app/trade/salesPage";
import PageLoader from "../../components/shared/pageLoader/pageLoader";
import { useTranslation } from "next-i18next";
import SEO from "../../components/seo";

const TradePage = () => {
  const { id, clientInitialized } = useAuthUser();
  const { t } = useTranslation();

  if (clientInitialized) {
    if (id != null) {
      return (
        <Layout>
          <SEO title={t<string>("trade")} />
          <Trade />
        </Layout>
      );
    } else {
      return (
        <SalesPagesLayout>
          <SEO title={t<string>("trade")} />
          <TradingSalesPage />
        </SalesPagesLayout>
      );
    }
  } else {
    return (
      <Layout>
        <SEO title={t<string>("trade")} />
        <PageLoader />
      </Layout>
    );
  }

};

export default withAuthUser({})(TradePage);

export const getStaticProps: GetStaticProps<any> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en")),
  },
});
