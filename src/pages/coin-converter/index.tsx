import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';

import Layout from '../../components/layout/layout'
import CoinConverter from '../../components/shared/coinConverter';
import { withAuthUser } from 'next-firebase-auth';
import SEO from '../../components/seo';

const CoinProfitCalculator = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <SEO title={t<string>("coin:cryptoConverter")} />
            <CoinConverter />
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
