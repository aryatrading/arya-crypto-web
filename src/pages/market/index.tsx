import { withAuthUser } from "next-firebase-auth";
import { useTranslation } from "next-i18next";
import React from "react";
import Layout from "../../components/layout/layout";
import PageLoader from "../../components/shared/pageLoader/pageLoader";
import Market from "../../components/app/market/market";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import SEO from "../../components/seo";

const MarketPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO title={t<string>("market")} />
      <Market />
    </Layout>
  );
};

export default withAuthUser({ LoaderComponent: PageLoader })(MarketPage);

export const getStaticProps: GetStaticProps<any> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en")),
  },
});
