import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next';

import Layout from '../../components/layout/layout'
import CoinProfitCalcu from '../../components/shared/coinProfitCalculator';

const CoinProfitCalculator = () => {

    return (
        <Layout>
            <CoinProfitCalcu />
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
