import { useTranslation } from 'next-i18next';
import { Col, Row } from '../../shared/layout/flex';
import Button from '../../shared/buttons/button';
import PaymentModal from '../Subscription/PaymentCard/PaymentModal';
import { downloadInvoicePDF, getInvoices } from '../../../services/controllers/checkout';
import { useEffect, useState } from 'react';
import Image from 'next/image'
import moment from 'moment';
import { capitalize } from 'lodash';

const SubcriptionTab = () => {
    const { t } = useTranslation(['settings', 'common']);
    const [invoices, setInvoices] = useState([]);

    const paymentModalTrigger = <Button className='focus:outline-none text-white bg-orange-1 hover:bg-opacity-95 focus:ring-2 rounded-lg  px-5 py-4 w-fit'>
            {t('subscribeToPro')}
        </Button>

    useEffect(() => {
        getInvoices().then((invoices)=>{
            setInvoices(invoices)
        })
    }, [])
    
    const features = [
        {
            icon:'assets/images/svg/settings/one-dashboard.svg',
            title: 'One Dashboard for Everything',
            subText:'Track Every asset you have from one dashboard, and stay on top of your game.'
        },
        {
            icon:'assets/images/svg/settings/global-perspective.svg',
            title: 'Global Perspective',
            subText:'Have a global vision on your crypto wealth and start take steps to improve it.'
        },
        {
            icon:'assets/images/svg/settings/quick-secure.svg',
            title: 'Quick & Secure',
            subText:'Getting started with ARYA Crypto only takes a few minutes, and it’s completely free and safe.'
        }
    ]

    return (
        <Col className='gap-12 w-full'>
            <Row className="gap-8 w-full px-12 py-6 items-center bg-subscription bg-[url('/assets/images/settings-subscription.png')] bg-cover bg-center bg-no-repeat">
                <Image height={256} width={324} src={'/assets/images/svg/settings/trade-mockup.svg'} alt='trade-demo'/>
                <Col className='gap-5'>
                    <Col className='gap-2'>
                        <span className='font-semibold text-lg mt-6'>{'Subscribe to ARYA Crypto premium'}</span>
                        <span className='font-medium text-base '>{t('subscriptionHint')}</span>
                    </Col>
                    <Row className='gap-3 text-sm font-semibold'>
                        <PaymentModal triggerButton={paymentModalTrigger}/>
                        <Button className='px-1 hover:underline hover:underline-offset-2'> Know more</Button>
                    </Row>
                </Col>
            </Row>
            <Row className='gap-11 justify-center'>
                <Image height={244} width={391}  src={'/assets/images/svg/settings/exchange-spiral.svg'} alt='all-in-one'/>
                <Col>
                    <span className='font-semibold text-lg mt-6'>All-In-One Platform For Tracking All your Crypto Assets</span>
                    <span className='font-medium text-base text-grey-1 w-[550px]'>ARYA Crypto supports the most popular cryptocurrency platforms, including Binance, Coinbase, and a lot more coming soon.</span>
                </Col>
            </Row>
            <Row className=' gap-14'>
                {
                    features.map((feature)=>{
                    return <Col className='gap-5 items-center'>
                            <Image src={feature.icon} width={68} height={68} alt='feature'/>
                            <span className='text-white font-semibold text-lg'>{feature.title}</span>
                            <span className='text-grey-1 text-sm text-center'>{feature.subText}</span>
                        </Col>
                    })
                }
            </Row>
            <Col className='gap-4'>
                <span> Subscription History </span>
                <table className='table-auto'>
                    <thead className='border-b border-grey-3 text-sm text-grey-1 font-normal'>
                        <th className='py-2 font-normal'>Reference</th>
                        <th className='py-2 font-normal'>Date</th>
                        <th className='py-2 font-normal'>Amount</th>
                        <th className='py-2 font-normal'>Reciept</th>
                        <th className='py-2 font-normal'>Status</th>
                    </thead>
                    <tbody>
                        {invoices.map((invoice:any)=>{
                            return <tr className='text-center'>
                                <td className='py-2'>{invoice?.id}</td>
                                <td className='py-2'>{moment(invoice?.created_at).format('DD/MM/YY')}</td>
                                <td className='py-2'>{invoice.total/100} {invoice.currency.toUpperCase()}</td>
                                <td className='py-2'>{invoice.status==='paid'?<Button onClick={()=>downloadInvoicePDF(invoice.id)} className='text-blue-1'>Download</Button>:''}</td>
                                <td className='py-2'>{capitalize(invoice.status)}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </Col>
        </Col>
    )
}

export default SubcriptionTab