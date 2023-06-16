import { useCallback, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next';
import { GetStaticProps } from 'next';
import { create } from '@lottiefiles/lottie-interactivity';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import { SalesPagesLayout } from '../../components/layout/layout'
import CoinProfitCalcu from '../../components/shared/coinProfitCalculator';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import SEO from '../../components/seo';
import { Col, Row } from '../../components/shared/layout/flex';
import { Testimonials } from '../../components/shared/Testimonials';
import { useAuthModal } from '../../context/authModal.context';

import styles from './index.module.scss';

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

const CoinProfitCalculator = () => {
    const { t } = useTranslation();
    const { setVisibleSection, modalTrigger } = useAuthModal();
    const { clientInitialized, id } = useAuthUser();
    const { push } = useRouter();
    const observer = useRef<any>();

    useEffect(() => {
        import("@lottiefiles/lottie-player");
    });

    useEffect(() => {
        observer.current.addEventListener('load', function () {
            create({
                mode: 'scroll',
                player: '#firstLottie',
                actions: [
                    {
                        visibility: [0.1, 0.9],
                        type: 'seek',
                        frames: [0, 150],
                    },
                ],
            });
        });
    }, []);

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

    const thirdSection = useMemo(() => {
        return (
            <Col className="py-10 w-full bg-black-1">
                <Col className="container items-center">
                    <Col className="items-center text-center gap-3">
                        <h2 className="text-4xl md:text-5xl font-bold max-w-[700px]">{t("dashboard:salesPage.allInOnePlatformForTrackingAllYourAssets")}</h2>
                        <p className="max-w-[700px]">{t("dashboard:salesPage.ARYACryptoSupportsTheMostPopularCryptocurrencyPlatforms")}</p>
                    </Col>
                    <lottie-player
                        ref={observer}
                        id="firstLottie"
                        mode="scroll"
                        src="/assets/images/publicPages/portfolio/logoWithIcons.json"
                        style={{ width: '100%', height: 'auto', maxWidth: '850px', marginTop: 10, marginBottom: 10 }}
                    ></lottie-player>
                    <Col className="w-full md:flex-row gap-6 text-center justify-center items-center md:items-start">
                        <Col className="gap-5 items-center w-[350px]">
                            <Image alt="" src={require('../../../public/assets/images/publicPages/portfolio/1.png')} className="w-20 h-20" width={128} height={128} />
                            <h3 className="font-extrabold text-3xl text-white">{t("dashboard:salesPage.oneDashboardForEverything")}</h3>
                            <p className="text-white font-medium max-w-[260px]">{t("dashboard:salesPage.trackEveryAssetYouHaveFromOneDashboard")}</p>
                        </Col>
                        <Col className="gap-5 items-center w-[350px]">
                            <Image alt="" src={require('../../../public/assets/images/publicPages/portfolio/2.png')} className="w-20 h-20" width={128} height={128} />
                            <h3 className="font-extrabold text-3xl text-white">{t("dashboard:salesPage.globalPerspective")}</h3>
                            <p className="text-white font-medium max-w-[260px]">{t("dashboard:salesPage.haveGlobalVisionOnYourCryptoWealthAndStartTakeStepsToImproveIt")}</p>
                        </Col>

                        <Col className="gap-5 items-center w-[350px]">
                            <Image alt="" src={require('../../../public/assets/images/publicPages/portfolio/3.png')} className="w-20 h-20" width={128} height={128} />
                            <h3 className="font-extrabold text-3xl text-white">{t("dashboard:salesPage.quick&Secure")}</h3>
                            <p className="text-white font-medium max-w-[260px]">{t("dashboard:salesPage.gettingStartedWithARYACryptoOnlyTakesFewMinutes")}</p>
                        </Col>

                    </Col>
                </Col>
            </Col>
        )
    }, [t]);

    const secondSection = useMemo(() => {
        return (<Col className='bg-black-1 py-10'>
            <Row className='items-center justify-center gap-10 flex-col-reverse lg:flex-row mb-20 px-4 md:px-14 lg:px-20 xl:px-80 pt-20'>
                <Col className="flex-1 w-full gap-4 justify-center">
                    <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">{t('home:secondSection.1.title')}</h2>
                    <h2 className="font-bold text-white text-3xl md:text-2xl text-left leading-snug">{t('home:secondSection.1.sub')}</h2>
                    <p className="font-medium text-white text-left">{t('home:secondSection.1.content')}</p>

                    <button onClick={() => onClick('/dashboard')} className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit rounded-full")}>
                        {t('home:learnMore')}
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
                    <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">{t('home:secondSection.2.title')}</h2>
                    <h2 className="font-bold text-white text-3xl md:text-2xl text-left leading-snug">{t('home:secondSection.2.sub')}</h2>
                    <p className="font-medium text-white text-left">{t('home:secondSection.2.content')}</p>

                    <button onClick={() => onClick('/smart-allocation')} className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit rounded-full")}>
                        {t('home:learnMore')}
                    </button>
                </Col>
            </Row>

            <Row className='items-center justify-center gap-10 flex-col-reverse lg:flex-row mb-20 px-4 md:px-14 lg:px-20 xl:px-80 pt-20'>
                <Col className="flex-1 w-full gap-4 justify-center">
                    <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">{t('home:secondSection.3.title')}</h2>
                    <h2 className="font-bold text-white text-3xl md:text-2xl text-left leading-snug">{t('home:secondSection.3.sub')}</h2>
                    <p className="font-medium text-white text-left">{t('home:secondSection.3.content')}</p>

                    <button onClick={() => onClick('/trade')} className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit rounded-full")}>
                        {t('home:learnMore')}
                    </button>
                </Col>

                <Col className='flex-1 relative justify-center items-center'>
                    <TradingImg />
                </Col>
            </Row>
        </Col>)
    }, [onClick, t]);


    const firstSection = useMemo(() => {
        return (
            <Col className="py-20 w-full bg-black-2">
                <Col className="container items-center gap-10">
                    <Col className="items-center text-center gap-3">
                        <h2 className="text-4xl md:text-5xl font-bold max-w-[700px]">{t("dashboard:salesPage.getStartedInFewMinutes")}</h2>
                        <p className="max-w-[700px]">{t("dashboard:salesPage.seamlesslyConnectYourEntireCryptoPortfolioInJustFewSteps")}</p>
                    </Col>
                    <button onClick={() => onClick('/dashboard')} className={clsx(styles.startBtn, styles.boxShadow, "text-white rounded-full font-bold text-sm w-fit")}>
                        {t('dashboard:salesPage.connectPortfolioNow')}
                    </button>
                    <Col className="w-full md:flex-row gap-6 text-center justify-center items-center md:items-end">
                        <Col className="gap-2 items-center justify-end w-[350px]">
                            <Image alt="" src="/assets/images/publicPages/portfolio/getStarted1.png" width={300} height={500} />
                            <Col className="relative border border-blue-1 rounded-lg p-5 w-full max-w-[300px]">
                                <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 bg-blue-1 w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold">1</p>
                                <p className="font-extrabold md:text-2xl text-white">{t("dashboard:salesPage.createAnAccount")}</p>
                            </Col>
                        </Col>
                        <Col className="gap-2 items-center justify-end w-[350px]">
                            <Image alt="" src="/assets/images/publicPages/portfolio/getStarted2.png" width={300} height={500} />
                            <Col className="relative border border-blue-1 rounded-lg p-5 w-full max-w-[300px]">
                                <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 bg-blue-1 w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold">2</p>
                                <p className="font-extrabold md:text-2xl text-white">{t("dashboard:salesPage.linkYourAccount")}</p>
                            </Col>
                        </Col>
                        <Col className="gap-2 items-center justify-end w-[350px]">
                            <Image alt="Step 3" src="/assets/images/publicPages/portfolio/getStarted4.png" width={300} height={500} />

                            <Col className="relative border border-blue-1 rounded-lg p-5 w-full max-w-[300px]">
                                <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 bg-blue-1 w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold">3</p>
                                <p className="font-extrabold md:text-2xl text-white">{t("dashboard:salesPage.manageYourCryptos")}</p>
                            </Col>
                        </Col>
                    </Col>
                </Col>
            </Col>
        )
    }, [onClick, t]);

    return (
        <SalesPagesLayout>
            <SEO title={t<string>("asset:cryptoProfitCalculator")} />
            <CoinProfitCalcu isFullPage />
            {firstSection}
            {secondSection}
            {thirdSection}
            <Testimonials />
        </SalesPagesLayout>
    )
}


export default withAuthUser({
})(CoinProfitCalculator)


export const getStaticProps: GetStaticProps<any> = async ({
    locale,
}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en')),
    },
})
