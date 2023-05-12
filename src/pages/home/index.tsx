import { withAuthUser } from 'next-firebase-auth'
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Layout from '../../components/layout/layout'
import Dashboard from '../../components/app/dashboard/dashboard';

const HomePage = (props: any) => {
    return (
        <Layout>
            <Dashboard />
        </Layout>
    )
}

export default withAuthUser({
})(HomePage)


export const getStaticProps: GetStaticProps<any> = async ({
    locale,
}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en', [
            "common",
            "auth",
            "nav",
            'dashboard',
            "coin"
        ])),
    },
})
