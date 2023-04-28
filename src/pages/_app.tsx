import { appWithTranslation } from 'next-i18next';
import { ReactNode, ReactElement, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import { initializeApp } from "firebase/app";
import { Provider } from "react-redux";
import { NextPage } from "next";
import { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import AuthModalProvider from '../context/authModal.context';
import { firebaseConfig } from "../services/firebase/auth/config";
import { wrapper } from "../services/redux/store";
import initAuth from '../initFirebaseAuth';
import { axiosInstance } from '../services/api/axiosConfig';

import '../styles/global.css'
import { initStoreData } from '../common/hooks/initStore';

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
  
  useEffect(() => {
    const localStorageToken = localStorage?.getItem("idToken");
    if (localStorageToken) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorageToken}`;
    }
}, [])


  const { store, props } = wrapper.useWrappedStore(pageProps);

  initStoreData(store);


  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page: any) => page)

  return getLayout(
    <Provider store={store}>
      <ThemeProvider attribute="class">
        <AuthModalProvider>
          <Component {...props.pageProps} />
        </AuthModalProvider>
      </ThemeProvider>
      <ToastContainer />
    </Provider>
  )
};

export default appWithTranslation(App)
