import { AuthAction, withAuthUser } from 'next-firebase-auth'
import Layout from '../../components/layout/layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next';
import EditSmartAllocation from '../../components/app/smart-allocation/edit-smart-allocation/edit-smart-allocation';
import SEO from '../../components/seo';
import { useTranslation } from 'react-i18next';

const EditSmartAllocationPage = (props: any) => {
    const {t} = useTranslation();

    return (
        <Layout>
            <SEO title={t<string>('common:editSmartAllocation')}/>
            <EditSmartAllocation />
        </Layout>
    )
}

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(EditSmartAllocationPage)


export const getStaticProps: GetStaticProps<any> = async ({
    locale,
}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en')),
    },
})
