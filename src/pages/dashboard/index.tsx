import { withAuthUser } from 'next-firebase-auth'
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Portrolio from '../../components/app/portfolio';

const PortrolioPage = () => {
    return (
        <Portrolio />
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
