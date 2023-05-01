import { withAuthUser } from "next-firebase-auth";
import Layout from "../../components/layout/layout";
import PageLoader from "../../components/shared/pageLoader/pageLoader";
import Market from "../../components/app/market/market";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

const MarketPage = () => {
  return (
    <Layout>
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
