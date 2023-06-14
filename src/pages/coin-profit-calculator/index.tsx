import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next';

import Layout from '../../components/layout/layout'
import CoinProfitCalcu from '../../components/shared/coinProfitCalculator';
import { withAuthUser } from 'next-firebase-auth';

const CoinProfitCalculator = () => {

    return (
        <Layout>
            <CoinProfitCalcu />
        </Layout>
    )
}


export default withAuthUser({
})(CoinProfitCalculator)


export const getStaticProps: GetStaticProps<any> = async ({
    locale,
}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en')),
    },
})
