import { withAuthUser } from 'next-firebase-auth'
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';

import Portrolio from '../../components/app/portfolio';
import SEO from '../../components/seo';

const PortrolioPage = () => {

    const { t } = useTranslation();

    return (
        <>
            <SEO title={t<string>('common:portfolio')} description='Manage your portfolio' />
            <Portrolio />
        </>
    )
}

export default withAuthUser({
})(PortrolioPage)


export const getStaticProps: GetStaticProps<any> = async ({
    locale,
}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en')),
    },
})
