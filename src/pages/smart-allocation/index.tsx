import { useAuthUser, withAuthUser } from 'next-firebase-auth'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next';

import Layout, { SalesPagesLayout } from '../../components/layout/layout'
import SmartAllocation from '../../components/app/smart-allocation/smart-allocation';
import SmartAllocationSalesPage from '../../components/app/smart-allocation/salesPage';
import PageLoader from '../../components/shared/pageLoader/pageLoader';

const SmartAllocationPage = () => {
    const { id, clientInitialized } = useAuthUser();
    if (clientInitialized) {
        if (id != null) {
            return (
                <Layout>
                    <SmartAllocation />
                </Layout>
            )
        } else {
            return (
                <SalesPagesLayout>
                    <SmartAllocationSalesPage />
                </SalesPagesLayout>
            );
        }
    } else {
        return <PageLoader />
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
