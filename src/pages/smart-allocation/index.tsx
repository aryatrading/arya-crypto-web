import { useAuthUser, withAuthUser } from 'next-firebase-auth'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next';

import Layout, { SalesPagesLayout } from '../../components/layout/layout'
import SmartAllocation from '../../components/app/smart-allocation/smart-allocation';
import SmartAllocationSalesPage from '../../components/app/smart-allocation/salesPage';
import PageLoader from '../../components/shared/pageLoader/pageLoader';
import SEO from '../../components/seo';
import { useTranslation } from 'next-i18next';

const SmartAllocationPage = () => {
    const { id, clientInitialized } = useAuthUser();
    const { t } = useTranslation();

    if (clientInitialized) {
        if (id != null) {
            return (
                <Layout>
                    <SEO title={t<string>("smartAllocation")} />
                    <SmartAllocation />
                </Layout>
            )
        } else {
            return (
                <SalesPagesLayout>
                    <SEO title={t<string>("smartAllocation")} />
                    <SmartAllocationSalesPage />
                </SalesPagesLayout>
            );
        }
    } else {
        return (
            <>
                <SEO title={t<string>("smartAllocation")} />
                <PageLoader />
            </>
        )
    }
}

export default withAuthUser({
})(SmartAllocationPage)


export const getStaticProps: GetStaticProps<any> = async ({
    locale,
}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en')),
    },
})
