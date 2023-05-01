import React from "react";
import { Poppins } from "next/font/google";
import { Provider } from "react-redux";
import { appWithTranslation } from "next-i18next";
import { ReactNode, ReactElement, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import { initializeApp } from "firebase/app";
import { NextPage } from "next";
import { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";

import AuthModalProvider from "../context/authModal.context";
import { firebaseConfig } from "../services/firebase/auth/config";
import { wrapper } from "../services/redux/store";
import initAuth from "../initFirebaseAuth";
import { axiosInstance } from "../services/api/axiosConfig";
import "../styles/global.css";
import { FAVORITES_LIST } from "../utils/constants/config";
import { initStoreData } from "../common/hooks/initStore";
import "../services/api/socketConfig";

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
} catch (err) {
  console.error(err);
}

function App({ Component, ...rest }: AppPropsWithLayout) {
  useEffect(() => {
    const localStorageToken = localStorage?.getItem("idToken");

    // Create the inital favorites list in localstorage
    localStorage?.setItem(FAVORITES_LIST, JSON.stringify([]));
    if (localStorageToken) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorageToken}`;
    }
  }, []);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page: any) => page);

  const { store, props } = wrapper.useWrappedStore(rest);

  initStoreData();

  return getLayout(
    <Provider store={store}>
      <ThemeProvider attribute="class">
        <AuthModalProvider>
          <main className={poppins.className}>
            <Component {...props.pageProps} />
          </main>
        </AuthModalProvider>
        <ToastContainer />
      </ThemeProvider>
    </Provider>
  );
}

export default appWithTranslation(App);
