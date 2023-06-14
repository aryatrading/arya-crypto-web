import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import Layout, { SalesPagesLayout } from "../../components/layout/layout";
import Trade from "../../components/app/trade/trade";
import { useEffect, useState } from "react";
import { clearTrade, getTrade } from "../../services/redux/tradeSlice";
import {
  getAssetCurrentPrice,
  getAssetOpenOrders,
  getHistoryOrders,
  initiateTrade,
} from "../../services/controllers/trade";
import { selectSelectedExchange } from "../../services/redux/exchangeSlice";
import { TradingSalesPage } from "../../components/app/trade/salesPage";
import { toast } from "react-toastify";
import PageLoader from "../../components/shared/pageLoader/pageLoader";
import { useTranslation } from "next-i18next";

const TradePage = () => {
  const { id, clientInitialized } = useAuthUser();

  if (clientInitialized) {
    if (id != null) {
      return (
        <Layout>
          <Trade />
        </Layout>
      );
    } else {
      return (
        <SalesPagesLayout>
          <TradingSalesPage />
        </SalesPagesLayout>
      );
    }
  } else {
    return (
      <Layout>
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
