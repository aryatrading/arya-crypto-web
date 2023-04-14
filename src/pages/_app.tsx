import { appWithTranslation } from 'next-i18next';
import { ReactNode, ReactElement } from "react";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import { initializeApp } from "firebase/app";
import { Provider } from "react-redux";
import { NextPage } from "next";
import { AppProps } from "next/app";
import Navbar from "../components/layout/navbar";
import "react-toastify/dist/ReactToastify.css";

import { firebaseConfig } from "../services/firebase/auth/config";
import { wrapper } from "../services/redux/store";
import initAuth from '../initFirebaseAuth';

import "./index.css"

/*
 *  Don't dispatch actions from pages/_app this mode is not compatible with Next.js 9's Auto Partial Static Export feature
 */

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

function App({ Component, ...pageProps }: AppPropsWithLayout) {

  const { store, props } = wrapper.useWrappedStore(pageProps);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page: any) => page)

  return getLayout(
    <Provider store={store}>
      <ThemeProvider attribute="class">
        <Navbar />
        <Component {...props.pageProps} />
      </ThemeProvider>
      <ToastContainer />
    </Provider>
  )
};

export default appWithTranslation(App)
