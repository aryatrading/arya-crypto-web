import { FC } from "react";
import HomePage from "./home/index";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const App: FC = () => {
    return (
        <HomePage />
    );
};

export default App;

export const getStaticProps: GetStaticProps<any> = async ({
    locale,
}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en', [
            'common', 'auth', 'settings',
        ])),
    },
})