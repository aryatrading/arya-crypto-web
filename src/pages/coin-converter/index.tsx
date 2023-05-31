import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next';

import Layout from '../../components/layout/layout'
import CoinConverter from '../../components/shared/coinConverter';

const CoinProfitCalculator = () => {

    return (
        <Layout>
            <CoinConverter />
        </Layout>
    )
}

export default CoinProfitCalculator;


export const getStaticProps: GetStaticProps<any> = async ({
    locale,
}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en')),
    },
})
