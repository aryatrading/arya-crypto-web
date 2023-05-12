import { withAuthUser } from 'next-firebase-auth'
import Layout from '../../components/layout/layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next';
import Home from '../../components/app/home/home';

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
        ...(await serverSideTranslations(locale ?? 'en', [
            "common",
            "auth",
            "nav",
            'dashboard',
            "coin"
        ])),
    },
})
