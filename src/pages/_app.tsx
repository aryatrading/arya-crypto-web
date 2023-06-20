import React from "react";
import { Poppins } from "next/font/google";
import { Provider } from "react-redux";
import { appWithTranslation } from "next-i18next";
import { ReactNode, ReactElement, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import { initializeApp, getApp } from "firebase/app";
import { getRemoteConfig, fetchAndActivate } from "firebase/remote-config";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { SkeletonTheme } from "react-loading-skeleton";

import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import "react-circular-progressbar/dist/styles.css";
import "react-loading-skeleton/dist/skeleton.css";

import AuthModalProvider from "../context/authModal.context";
import { firebaseConfig } from "../services/firebase/auth/config";
import { wrapper } from "../services/redux/store";
import initAuth from "../initFirebaseAuth";
import { axiosInstance } from "../services/api/axiosConfig";
import "../styles/globals.css";
import { FAVORITES_LIST } from "../utils/constants/config";
import { openConnection } from "../services/api/socketConfig";
import ResponsiveProvider from "../context/responsive.context";
import { getUserLanguage } from "../services/controllers/utils";
import PushNotificationLayout from "../components/layout/Notifications";
import { getUserData } from "../services/controllers/user";

const poppins = Poppins({
  variable: "--poppins-font",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

initAuth();

try {
  initializeApp(firebaseConfig);
  const remoteConfig = getRemoteConfig(getApp());
  remoteConfig.settings.minimumFetchIntervalMillis = 1000;
  fetchAndActivate(remoteConfig);
} catch (err) {
  console.error(err);
}

function App({ Component, ...rest }: AppPropsWithLayout) {
  const { pathname, push, asPath, query } = useRouter();
  useEffect(() => {
    (async () => {
      const localStorageToken = localStorage?.getItem("idToken");
      const lang = window.localStorage.getItem("language");
      if (lang == null) {
        getUserLanguage().then(({ data }) => {
          push({ pathname, query }, asPath, { locale: data.language });
        });
      } else {
        push({ pathname, query }, asPath, { locale: lang });
      }

      // Create the inital favorites list in localstorage
      localStorage?.setItem(FAVORITES_LIST, JSON.stringify([]));

      // Forcing dark mode
      localStorage?.setItem("theme", "dark");
      if (localStorageToken) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${localStorageToken}`;

        await getUserData();
      }
    })();
  }, []);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page: any) => page);

  const { store, props } = wrapper.useWrappedStore(rest);

  useEffect(() => {
    openConnection("binance");
  }, []);

  return getLayout(
    <Provider store={store}>
      <ThemeProvider attribute="class">
        <AuthModalProvider>
          <ResponsiveProvider>
            <PushNotificationLayout>
              <SkeletonTheme baseColor="#202020" highlightColor="#444">
                <main className={poppins.className}>
                  <Component {...props.pageProps} />
                </main>
              </SkeletonTheme>
            </PushNotificationLayout>
          </ResponsiveProvider>
        </AuthModalProvider>
        <ToastContainer limit={3} />
      </ThemeProvider>
    </Provider>
  );
}

export default appWithTranslation(App);
