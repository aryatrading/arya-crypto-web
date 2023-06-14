import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next';
import { GetStaticProps } from 'next';

import Layout from '../../components/layout/layout'
import CoinProfitCalcu from '../../components/shared/coinProfitCalculator';
import { withAuthUser } from 'next-firebase-auth';
import SEO from '../../components/seo';

const CoinProfitCalculator = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <SEO title={t<string>("asset:cryptoProfitCalculator")} />
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
