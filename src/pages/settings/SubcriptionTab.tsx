import { useTranslation } from 'next-i18next';

import Layout from '../../components/layout/layout'
import { Col, Row } from '../../components/shared/layout/flex';
import Button from '../../components/shared/buttons/button';

const SubcriptionTab = () => {
    const { t } = useTranslation(['settings', 'common']);

    return (
        <Layout>
            <Col className='gap-4'>
                <Col className='gap-4'>
                    <h1 className='font-bold text-md mt-6'>{t('subscription')}</h1>
                    <h1 className='font-medium text-sm '>{t('subscriptionHint')}</h1>
                </Col>

                <Button className='focus:outline-none text-white bg-yellow_one hover:bg-yellow_one hover:bg-opacity-95 focus:ring-2 font-medium rounded-lg text-sm px-5 py-3 dark:focus:ring-yellow_one dark:focus:bg-opacity-80 max-w-[300px]'>
                    {t('subscribeToPro')}
                </Button>

                <h1 className='font-bold text-md mt-6'>{t('subscriptionHistory')}</h1>

                <Row className='gap-[160px]'>
                    <span className="font-medium text-grey_one">{t('date')}</span>
                    <span className="font-medium text-grey_one">{t('total')}</span>
                </Row>
                <hr className='border-grey_three w-full' />
                <Row className='gap-[130px]'>
                    <span className="font-medium text-white">14/02/22</span>
                    <span className="font-medium text-white">$25.00</span>
                </Row>
                <Row className='gap-[130px]'>
                    <span className="font-medium text-white">14/02/22</span>
                    <span className="font-medium text-white">$25.00</span>
                </Row>
                <Row className='gap-[130px]'>
                    <span className="font-medium text-white">14/02/22</span>
                    <span className="font-medium text-white">$25.00</span>
                </Row>
                <Row className='gap-[130px]'>
                    <span className="font-medium text-white">14/02/22</span>
                    <span className="font-medium text-white">$25.00</span>
                </Row>
                <Row className='gap-[130px]'>
                    <span className="font-medium text-white">14/02/22</span>
                    <span className="font-medium text-white">$25.00</span>
                </Row>
                <Row className='gap-[130px]'>
                    <span className="font-medium text-white">14/02/22</span>
                    <span className="font-medium text-white">$25.00</span>
                </Row>

            </Col>

        </Layout>
    )
}

export default SubcriptionTab