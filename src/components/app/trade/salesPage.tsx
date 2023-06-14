import { useEffect, useRef } from "react";
import Image from "next/image";
import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "next-i18next";
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import { Col, Row } from "../../shared/layout/flex";
import PricingSection from "../../shared/pricing-section/pricing-section";
import TradingImg from "../../../../public/assets/images/publicPages/trading/trading.json";
import { Testimonials } from "../../shared/Testimonials";
import { useAuthModal } from "../../../context/authModal.context";

import styles from './index.module.scss';

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

export const TradingSalesPage = () => {
    const { setVisibleSection, modalTrigger } = useAuthModal();
    const { t } = useTranslation(["trade"]);
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.pause();
            setTimeout(() => {
                lottieRef.current?.play();
            }, 1000);
        }
    }, []);

    const onClick = () => {
        setVisibleSection('signup');
        modalTrigger.show();
    }

    return (
        <Col className="w-full h-full pt-14 lg:pt-0">
            <Row className={clsx("gap-10 flex-col-reverse lg:flex-row items-center px-4 md:px-12 lg:px-20 xl:px-60 py-20 justify-center min-h-[calc(100vh-65px)]", styles.bgImage)}>
                <Col className="flex-1 w-full h-full gap-8 justify-center">
                    <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">{t('salesPage.mainTitle')} <span className={styles.underlined}>{t('salesPage.results')}</span></h2>
                    <p className="font-medium text-white text-left">{t('salesPage.ourGoal')}</p>

                    <Col className='gap-4'>
                        {[t('salesPage.points.1'), t('salesPage.points.2'), t('salesPage.points.3')].map(e => {
                            return (
                                <RowItem content={e} />
                            );
                        })}
                    </Col>
                    <Row className="md:gap-8 gap-2 flex-col md:flex-row">
                        <button onClick={onClick} className={clsx(styles.startBtn, styles.boxShadow, "text-white rounded-full font-bold text-sm")}>
                            {t('salesPage.getStarted')}
                        </button>

                        <button className={clsx(styles.secondBtn, styles.boxShadow, "text-white rounded-full font-bold text-sm")}>
                            {t('salesPage.watchVideo')}
                        </button>
                    </Row>
                </Col>
                <Col className="flex-1 w-full h-full gap-4 relative">
                    <Lottie animationData={TradingImg} lottieRef={lottieRef} className={clsx(styles.animateImg, "w-full scale-125 md:scale-150 lg:scale-[1.65] absolute h-full")} />
                    <Lottie animationData={TradingImg} className={clsx("w-full scale-125 opacity-[0]")} />
                </Col>
            </Row>

            <Col className="w-full h-full items-center justify-center bg-[#111827] px-4">
                <Row className="gap-10 flex-col-reverse lg:flex-row items-center w-full lg:w-[100vw] px-4 lg:px-20 xl:px-72 py-14">
                    <Col className="flex-1 w-full h-full gap-8 justify-center">
                        <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">{t('salesPage.protectCapital')}</h2>

                        <p className="font-medium text-white text-left">{t('salesPage.protectCapitalDesc')}</p>

                        <button onClick={onClick} className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit rounded-full")}>
                            {t('salesPage.setStopLoss')}
                        </button>
                    </Col>
                    <Col className="flex-1 w-full h-full gap-4">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/trading/1.png')} className={clsx("w-full self-end h-full")} />
                    </Col>
                </Row>

                <Row className="gap-10 flex-col lg:flex-row items-center w-full lg:w-[100vw] px-4 lg:px-20 xl:px-72 py-14 ">
                    <Col className="flex-1 w-full h-full gap-4 items-center justify-center">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/trading/2.png')} className={clsx("w-full self-end h-full")} />
                    </Col>
                    <Col className="flex-1 w-full h-full gap-8 justify-center">
                        <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">{t('salesPage.scheduleYourProfits')}</h2>

                        <p className="font-medium text-white text-left">{t('salesPage.scheduleYourProfitsDesc')}</p>

                        <button onClick={onClick} className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit rounded-full")}>
                            {t('salesPage.pickYourLevels')}
                        </button>
                    </Col>
                </Row>

                <Row className="gap-10 flex-col-reverse lg:flex-row items-center w-full lg:w-[100vw] px-4 lg:px-20 xl:px-72 py-14">
                    <Col className="flex-1 w-full h-full gap-8 justify-center">
                        <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">{t('salesPage.avoidLoss')}</h2>

                        <p className="font-medium text-white text-left">{t('salesPage.avoidLossDesc')}</p>

                        <button onClick={onClick} className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit rounded-full")}>
                            {t('salesPage.getStarted')}
                        </button>
                    </Col>
                    <Col className="flex-1 w-full h-full gap-4">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/trading/3.png')} className={clsx("w-full self-end h-full")} />
                    </Col>
                </Row>

                <PricingSection />
                <Testimonials />

            </Col>
        </Col>
    );
}