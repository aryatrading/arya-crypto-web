import { AuthAction, withAuthUser } from 'next-firebase-auth'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';

import Layout from '../../components/layout/layout'
import { Col, Row } from '../../components/shared/layout/flex';
import AccountTab from '../../components/app/settings/AccountTab';
import SubcriptionTab from '../../components/app/settings/SubcriptionTab';
import ExchangeTab from '../../components/app/settings/ExchangeTab';


const SettingsScreen = () => {
    const { t } = useTranslation(['settings', 'common']);

    return (
        <Layout>
            <Col className="w-full">
                <h1 className='font-bold text-3xl mb-10'>{t('settings')}</h1>

                <Tabs selectedTabClassName="text-blue-1 font-bold text-lg border-b-2 border-blue-1 pb-3">
                    <TabList className="border-b-[1px] border-grey-3 mb-6">
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
            </Col>
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
            'settings', 'common', 'auth', 'nav'
        ])),
    },
})
