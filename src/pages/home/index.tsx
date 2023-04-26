import { withAuthUser } from 'next-firebase-auth'
import Layout from '../../components/layout/layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next';

const HomePage = (props: any) => {

    return (
        <Layout>
            <div className='flex w-full justify-center items-center'>
                <h1>Home</h1>
            </div>
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
