import { AuthAction, withAuthUser } from 'next-firebase-auth'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';


import Layout from '../../components/layout/layout'
import { Row } from '../../components/shared/layout/flex';

import AccountTab from './AccountTab';
import SubcriptionTab from './SubcriptionTab';
import ExchangeTab from './ExchangeTab';


const SettingsScreen = () => {
    const { t } = useTranslation(['settings', 'common']);

    return (
        <Layout>
            <h1 className='font-bold text-3xl my-10'>{t('settings')}</h1>

            <Tabs selectedTabClassName="text-blue_one font-bold text-lg border-b-2 border-blue_one pb-3">
                <TabList className="border-b-[1px] border-grey_three mb-6">
                    <Row className='gap-4'>
                        <Tab className="font-bold text-lg outline-none cursor-pointer">{t('account')}</Tab>
                        <Tab className="font-bold text-lg outline-none cursor-pointer">{t('exchange')}</Tab>
                        <Tab className="font-bold text-lg outline-none cursor-pointer">{t('subscription')}</Tab>
                    </Row>
                </TabList>
                <TabPanel>
                    <AccountTab />
                </TabPanel>
                <TabPanel>
                    <ExchangeTab />
                </TabPanel>
                <TabPanel>
                    <SubcriptionTab />
                </TabPanel>
            </Tabs>
        </Layout>
    )
}

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    authPageURL: '/login/',
})(SettingsScreen)


export const getStaticProps: GetStaticProps<any> = async ({
    locale,
}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en', [
            'settings', 'common', 'auth'
        ])),
    },
})
