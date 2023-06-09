import { useRef, useEffect, useCallback } from 'react';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useAuthUser, withAuthUser } from 'next-firebase-auth'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation, Trans } from 'next-i18next';
import clsx from 'clsx';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useRouter } from 'next/router';

import { SalesPagesLayout } from '../../components/layout/layout'
import { Col, Row } from '../../components/shared/layout/flex';
import PricingSection from '../../components/shared/pricing-section/pricing-section';
import { Testimonials } from '../../components/shared/Testimonials';
import SEO from '../../components/seo';
import LottieData from '../../../public/assets/images/publicPages/home/home.json';
import { useAuthModal } from '../../context/authModal.context';

import styles from './index.module.scss';
import _ from 'lodash';

const RowItem = ({ content }: any) => {
    return (
        <Row className='gap-4 items-center'>
            <Col className='w-5 h-5 rounded-md bg-blue-1 justify-center items-center'>
                <CheckIcon className='w-3 h-3 fill-white stroke-white' />
            </Col>

            <p className='font-medium text-base text-white'>{content}</p>
        </Row>
    );
}

const SmartAllocationImg = () => (
    <Col className='w-full h-full justify-center items-center'>
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/smart-allocation/smartallocation.png')} className='w-1/2 -mt-10 md:-mt-20 z-20 self-center md:self-end -me-20 md:me-10' />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/smart-allocation/coinsCircle.png')} className={clsx(styles.rotate, 'w-1/2 absolute left-10 md:left-24 -top-6')} />
    </Col>
)
const PortfolioImg = () => (
    <Col className='flex-1 w-full h-full justify-center items-center'>
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/portfolio.png')} className='w-1/2 -mt-10 sm:-mt-20 z-20 self-center md:self-end -me-40 md:me-10' />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/1.png')} className={clsx(styles['animation-1'], 'absolute left-[42%] md:left-[40%] -top-[6%] w-[7%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/2.png')} className={clsx(styles['animation-2'], 'absolute left-[24%] top-[8%] w-[5.5%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/3.png')} className={clsx(styles['animation-3'], 'absolute left-[10%] top-[14%] w-[7%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/4.png')} className={clsx(styles['animation-4'], 'absolute left-[24%] top-[26%] w-[9%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/5.png')} className={clsx(styles['animation-3'], 'absolute left-[42%] top-[38%] w-[7%] z-30')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/6.png')} className={clsx(styles['animation-1'], 'absolute left-[8%] top-[40%] w-[5%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/7.png')} className={clsx(styles['animation-4'], 'absolute left-[24%] top-[60%] w-[7%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/portfolio/8.png')} className={clsx(styles['animation-1'], 'absolute left-[42%] top-[70%] w-[10%] z-30')} />
    </Col>
)

const TradingImg = () => (
    <Col className='flex-1 w-full h-full relative justify-center items-center'>
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/trading.png')} className='w-1/2 -mt-10 md:-mt-20 z-20 self-center md:self-end -me-40 md:me-10' />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/1.png')} className={clsx(styles['animation-1'], 'absolute left-[30%] -top-[10%] w-[21%] z-30')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/2.png')} className={clsx(styles['animation-2'], 'absolute left-[12%] -top-[4%] w-[14%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/3.png')} className={clsx(styles['animation-3'], 'absolute left-[12%] top-[28%] w-[18%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/4.png')} className={clsx(styles['animation-4'], 'absolute left-[29%] top-[36%] w-[16%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/5.png')} className={clsx(styles['animation-3'], 'absolute left-[8%] top-[44%] w-[16%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/6.png')} className={clsx(styles['animation-1'], 'absolute left-[12%] top-[60%] w-[18%]')} />
        <Image alt='' src={require('../../../public/assets/images/publicPages/home/trade/7.png')} className={clsx(styles['animation-4'], 'absolute left-[38%] top-[78%] w-[12%] z-30')} />
    </Col>
)

const HomePage = () => {
    const { setVisibleSection, modalTrigger } = useAuthModal();
    const [t] = useTranslation(["home"]);
    const { clientInitialized, id } = useAuthUser();
    const { push } = useRouter();
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.setSpeed(0.5);
            lottieRef.current.pause();
            setTimeout(() => {
                lottieRef.current?.play();
            }, 1000);
        }
    }, []);

    useEffect(() => {
        if (clientInitialized) {
            if (id != null) {
                push('/dashboard');
            } else {
                push('/');
            }
        }
    }, [clientInitialized, id, push]);

    const onClick = useCallback((route: string) => {
        if (clientInitialized) {
            if (id == null) {
                setVisibleSection('signup');
                modalTrigger.show();
            } else {
                if (route) {
                    push(route)
                }
            }
        }
    }, [clientInitialized, id, modalTrigger, push, setVisibleSection]);

    return (
        <SalesPagesLayout>
            <SEO />
            <Col className="w-full h-full pt-14 lg:pt-0 text-white">
                <Row className={clsx("gap-10 flex-col-reverse lg:flex-row items-center px-4 md:px-12 lg:px-20 xl:px-60 py-20 justify-center min-h-[calc(100vh-65px)]", styles.mainBanner)}>
                    <Col className='flex-1 w-full h-full gap-4 justify-center'>
                        <p className='top-0 left-0 text-left w-full text-2xl font-bold md:leading-snug md:text-5xl'>
                            <Trans i18nKey={'home:title'}
                                components={{ blueText: <span className='text-blue-1' />, curveText: <span className={styles.underlined} /> }}
                            /></p>

                        <p className='font-medium text-base'>
                            {t('description')}
                        </p>

                        <Col className='gap-4'>
                            {[t('points.1'), t('points.2'), t('points.3')].map(e => {
                                return (
                                    <RowItem key={_.uniqueId()} content={e} />
                                );
                            })}
                        </Col>

                        <button onClick={() => onClick('/dashboard')} className={clsx('h-[44px] bg-blue-1 rounded-lg max-w-[220px] font-bold mt-4 mb-10', styles.boxShadow)}>
                            {t('tryForFree')}
                        </button>
                    </Col>

                    <Col className="flex-1 w-full h-full gap-4 relative">
                        <Lottie animationData={LottieData} lottieRef={lottieRef} className={clsx(styles.animateImg, "w-full absolute scale-[1.35] lg:scale-150 xl:scale-[1.35] h-full")} />
                        <Lottie animationData={LottieData} className={clsx("w-full opacity-0 h-full")} />
                    </Col>
                </Row>

                <Col className='bg-black-2 py-10'>
                    <Row className='items-center justify-center gap-10 flex-col-reverse lg:flex-row mb-20 px-4 md:px-14 lg:px-20 xl:px-80 pt-20'>
                        <Col className="flex-1 w-full gap-4 justify-center">
                            <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">{t('secondSection.1.title')}</h2>
                            <h2 className="font-bold text-white text-3xl md:text-2xl text-left leading-snug">{t('secondSection.1.sub')}</h2>
                            <p className="font-medium text-white text-left">{t('secondSection.1.content')}</p>

                            <button onClick={() => onClick('/dashboard')} className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit rounded-full")}>
                                {t('learnMore')}
                            </button>
                        </Col>

                        <Col className='flex-1 relative justify-center items-center'>
                            <PortfolioImg />
                        </Col>
                    </Row>

                    <Row className='items-center justify-center gap-10 flex-col lg:flex-row mb-20 px-4 md:px-14 lg:px-20 xl:px-80 pt-20'>
                        <Col className='flex-1 relative justify-center items-center'>
                            <SmartAllocationImg />
                        </Col>

                        <Col className="flex-1 w-full gap-4 justify-center">
                            <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">{t('secondSection.2.title')}</h2>
                            <h2 className="font-bold text-white text-3xl md:text-2xl text-left leading-snug">{t('secondSection.2.sub')}</h2>
                            <p className="font-medium text-white text-left">{t('secondSection.2.content')}</p>

                            <button onClick={() => onClick('/smart-allocation')} className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit rounded-full")}>
                                {t('learnMore')}
                            </button>
                        </Col>
                    </Row>

                    <Row className='items-center justify-center gap-10 flex-col-reverse lg:flex-row mb-20 px-4 md:px-14 lg:px-20 xl:px-80 pt-20'>
                        <Col className="flex-1 w-full gap-4 justify-center">
                            <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">{t('secondSection.3.title')}</h2>
                            <h2 className="font-bold text-white text-3xl md:text-2xl text-left leading-snug">{t('secondSection.3.sub')}</h2>
                            <p className="font-medium text-white text-left">{t('secondSection.3.content')}</p>

                            <button onClick={() => onClick('/trade')} className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit rounded-full")}>
                                {t('learnMore')}
                            </button>
                        </Col>

                        <Col className='flex-1 relative justify-center items-center'>
                            <TradingImg />
                        </Col>
                    </Row>
                </Col>

                <PricingSection />
                <Testimonials />

                <Col className='py-10 gap-6 items-center justify-center'>
                    <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug mb-10">{t('faq')}</h2>

                    <Col className='w-full min-h-20 border border-blue-2 p-6 rounded-lg gap-4 md:max-w-[80%]'>
                        <p className='font-bold text-white text-lg'>{t('questions.1.Q')}</p>
                        <p className='font-medium text-white text-base'>{t('questions.1.A')}</p>
                    </Col>

                    <Col className='w-full min-h-20 border border-blue-2 p-6 rounded-lg gap-4 md:max-w-[80%]'>
                        <p className='font-bold text-white text-lg'>{t('questions.2.Q')}</p>
                        <p className='font-medium text-white text-base'>{t('questions.2.A')}</p>
                    </Col>

                    <Col className='w-full min-h-20 border border-blue-2 p-6 rounded-lg gap-4 md:max-w-[80%]'>
                        <p className='font-bold text-white text-lg'>{t('questions.3.Q')}</p>
                        <p className='font-medium text-white text-base'>{t('questions.3.A')}</p>
                    </Col>

                    <Col className='w-full min-h-20 border border-blue-2 p-6 rounded-lg gap-4 md:max-w-[80%]'>
                        <p className='font-bold text-white text-lg'>{t('questions.4.Q')}</p>
                        <p className='font-medium text-white text-base'>{t('questions.4.A')}</p>
                    </Col>
                </Col>
            </Col>

        </SalesPagesLayout>
    )
}

export default withAuthUser({
})(HomePage)


export const getStaticProps: GetStaticProps<any> = async ({
    locale,
}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en')),
    },
})
