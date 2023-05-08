import { AuthAction, withAuthUser } from 'next-firebase-auth'
import Layout from '../../components/layout/layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next';
import EditSmartAllocation from '../../components/app/smart-allocation/edit-smart-allocation/edit-smart-allocation';

const EditSmartAllocationPage = (props: any) => {

    return (
        <Layout>
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
        ...(await serverSideTranslations(locale ?? 'en', [
            "common",
            "auth",
            "nav",
            'smart-allocation'
        ])),
    },
})
