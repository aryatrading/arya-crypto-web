import { withAuthUser } from 'next-firebase-auth'
import Layout from '../../components/layout/layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next';
import SmartAllocation from '../../components/app/smart-allocation/smart-allocation';

const SmartAllocationPage = (props: any) => {

    return (
        <Layout>
            <SmartAllocation/>
        </Layout>
    )
}

export default withAuthUser({
})(SmartAllocationPage)


export const getStaticProps: GetStaticProps<any> = async ({
    locale,
}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en', [
            "common",
            "auth",
            "nav",
            'smartAllocation'
        ])),
    },
})
