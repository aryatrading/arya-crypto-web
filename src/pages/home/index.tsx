import { withAuthUser } from 'next-firebase-auth'
import Layout from '../../components/layout/layout'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next';

const HomePage = (props: any) => {

    const { t } = useTranslation();

    return (
        <Layout>
            <div>{t("myHomePage")}</div>
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
            'common', 'auth'
        ])),
    },
})
