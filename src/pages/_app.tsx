import { ReactNode, ReactElement } from "react";
import { Provider } from "react-redux";
import { NextPage } from "next";
import { wrapper } from "../services/redux/store";
import { AppProps } from "next/app";
import "./index.css"
import initAuth from '../initFirebaseAuth';
import { ThemeProvider } from "next-themes";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../services/firebase/auth/config";


/*
 *  Don't dispatch actions from pages/_app this mode is not compatible with Next.js 9's Auto Partial Static Export feature
*/

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}


type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

initAuth()


try {
    initializeApp(firebaseConfig);
} catch (err) {
    console.error(err);
}

export default function App({ Component, ...pageProps }: AppPropsWithLayout) {

    const { store, props } = wrapper.useWrappedStore(pageProps);

    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout || ((page) => page)

    return getLayout(
        <Provider store={store}>
            <ThemeProvider attribute="class">
                <Component {...props.pageProps} />
            </ThemeProvider>
        </Provider>
    )
};

