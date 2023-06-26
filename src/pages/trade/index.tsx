import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAuthUser, withAuthUser } from "next-firebase-auth";

import Layout, { SalesPagesLayout } from "../../components/layout/layout";
import Trade from "../../components/app/trade/trade";
import { TradingSalesPage } from "../../components/app/trade/salesPage";
import PageLoader from "../../components/shared/pageLoader/pageLoader";
import { useTranslation } from "next-i18next";
import SEO from "../../components/seo";
import NoConnectedExchangePage from "../../components/shared/no-exchange-connected-page/no-exchange-connected-page";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectConnectedExchanges } from "../../services/redux/exchangeSlice";

const TradePage = () => {
  const { id, clientInitialized } = useAuthUser();
  const { t } = useTranslation();
  const connectedExchanges = useSelector(selectConnectedExchanges);

  const connectedExchangesWithProviders = useMemo(
    () => connectedExchanges?.filter((exchange) => exchange.provider_id),
    [connectedExchanges]
  );

  if (clientInitialized) {
    if (id != null) {
      return (
        <Layout>
          <SEO title={t<string>("trade")} />
          {connectedExchangesWithProviders?.length ? (
            <Trade />
          ) : (
            <NoConnectedExchangePage Component={Trade} />
          )}
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
