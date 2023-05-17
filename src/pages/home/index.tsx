import { withAuthUser } from 'next-firebase-auth'
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Home from '../../components/app/home/home';
import Layout from '../../components/layout/layout'

const HomePage = (props: any) => {
    return (
        <Layout>
            <Home />
        </Layout>
    )
}

export default withAuthUser({
})(HomePage)


export const getStaticProps: GetStaticProps<any> = async ({
    locale,
}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en')),
    },
})
