import { useTranslation } from 'next-i18next';

import Layout from '../../components/layout/layout'
import { Col, Row } from '../../components/shared/layout/flex';
import Button from '../../components/shared/buttons/button';
import AddExchange from '../../components/app/exchangeTab/AddExchange';

const ExchangeTab = () => {
    const { t } = useTranslation(['settings', 'common']);

    return (
        <Layout>
            <AddExchange />
        </Layout>
    )
}

export default ExchangeTab