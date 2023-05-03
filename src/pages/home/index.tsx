import { withAuthUser } from 'next-firebase-auth'
import Layout from '../../components/layout/layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next';
import Dashboard from '../../components/app/dashboard/dashboard';
import AssetSelector from '../../components/shared/AssetSelector/AssetSelector';
import Button from '../../components/shared/buttons/button';

const HomePage = (props: any) => {

    return (
        <Layout>
            <Dashboard />
            <AssetSelector onClick={(asset)=>false} trigger={<Button className='px-4 py-2 rounded bg-yellow-1 text-white'>selectAsset</Button>}/>
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
