import { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { ErrorMessage, Form, Formik } from "formik";

import { Col, Row } from '../../shared/layout/flex';
import Button from '../../shared/buttons/button';
import AddExchange from '../../app/exchangeTab/AddExchange';
import TextInput from '../../shared/form/inputs/textInput';

const ExchangeTab = () => {
    const { t } = useTranslation(['settings', 'common']);
    const [exchanges, setExchanges] = useState<any>([]);
    const [selectedExchange, setSelectedExchange] = useState({ id: 1, name: 'Binance', create: true });

    return (
        <>
            {
                exchanges.length === 0 ?
                    <AddExchange onPressExchange={setExchanges} />
                    :
                    <Row className='gap-10'>
                        <Col className='items-center gap-4 flex-1'>
                            <h1 className='font-bold text-lg'>Connected Exchanges</h1>
                            {exchanges.map((exchange: any) => {
                                const bg = selectedExchange.id === exchange.id ? 'bg-blue-3' : 'bg-grey-2';
                                const onClick = () => {
                                    setSelectedExchange(exchange);
                                }
                                return (
                                    <Button className={`w-full h-[44px] ${bg} rounded-md hover:bg-grey-4 px-5`} onClick={onClick}>
                                        <Row className='gap-3'>
                                            <Image src={`https://aryatrading-content.s3.eu-west-1.amazonaws.com/arya_crypto/exchanges_icons/${exchange.id}.svg`} alt='' width={20} height={20} />
                                            <label className='font-bold text-white text-base'>{exchange.name}</label>
                                        </Row>
                                    </Button>
                                );
                            })}
                            <Button className='w-full h-[44px] bg-grey-2 rounded-md hover:bg-grey-4 px-5'>
                                <Row className='gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 stroke-blue-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>

                                    <label className='font-bold text-blue-1 text-sm'>Add Exchange</label>
                                </Row>
                            </Button>
                        </Col>
                        <Col className='flex-[3] border-l-[1px] border-grey-3 pl-8 gap-8'>
                            <h1 className='font-bold text-lg'>{`Connect Binance`}</h1>

                            <Formik
                                initialValues={{ portfolioname: '', creationDate: '', whitelistIPs: '' }}
                                onSubmit={(values, { setSubmitting, setErrors }) => {

                                }}
                            >
                                {({ isSubmitting }: any) => (
                                    <Form className="flex flex-col w-full gap-4">
                                        <Row className='gap-4'>
                                            <Col className='flex-1'>
                                                <TextInput type="text" name="portfolioname" label={t('portfolioname')} />
                                                <ErrorMessage name="portfolioname" component="p" className="text-red-400" />
                                            </Col>
                                            <Col className='flex-1'>
                                                <TextInput type="date" name="creationDate" label={t('creationDate')} disabled={!selectedExchange.create} />
                                                <ErrorMessage name="creationDate" component="p" className="text-red-400" />
                                            </Col>
                                        </Row>
                                        <Row className='justify-center items-center gap-4'>
                                            <Col className='flex-1'>
                                                <TextInput type="text" name="whitelistIPs" label={t('whitelistIPs')} disabled />
                                                <ErrorMessage name="whitelistIPs" component="p" className="text-red-400" />
                                            </Col>
                                            <Button className='text-white bg-grey-3 hover:bg-grey-4 font-medium rounded-lg text-sm h-[44px] min-w-[110px] mt-6' type="button">
                                                <h5>{t('Copy')}</h5>
                                            </Button>
                                        </Row>
                                        <Col>
                                            <TextInput type="text" name="APIKey" label={t('APIKey')} disabled={!selectedExchange.create} />
                                            <ErrorMessage name="APIKey" component="p" className="text-red-400" />
                                        </Col>
                                        <Col>
                                            <TextInput type="text" name="APISecret" label={t('APISecret')} disabled={!selectedExchange.create} />
                                            <ErrorMessage name="APISecret" component="p" className="text-red-400" />
                                        </Col>
                                        <Button className='text-white bg-blue-1 hover:bg-blue-2 font-medium rounded-lg text-sm py-2.5 focus:outline-none self-start px-10' type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                                            <h5>{t('submit')}</h5>
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </Col>
                        <Col className='flex-[1.5] gap-4'>
                            <h1 className='font-bold text-lg'>Follow these steps:</h1>
                            <p className='whitespace-pre-wrap text-sm'>
                                1. login to your Binance account on your computer.<br /><br />
                                2. Deposit the capital you wish to trade with ARYA Crypto on Binance.<br /><br />
                                3. click on API Management from your profile icon dropdown menu on the top right.<br /><br />
                                4. In the “label your API key” field type in the name you want to call it. and click create.<br /><br />
                                5. Input your google authentication code (2FA) for binance.<br /><br />
                                6. Open your verification email Binance sent you and click Confirm new API key.<br /><br />
                                7. You can either scan the QR code with the ARYA Crypto app by pressing Scan QR code and pointing the camera onto the API QR code or copy and paste your API key and Secret keys into the app.<br /><br />
                            </p>
                        </Col>
                    </Row>
            }
        </>
    )
}

export default ExchangeTab