import { FC, useEffect, useRef } from "react";
import clsx from "clsx";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { CheckIcon } from "@heroicons/react/24/solid";
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import { Col, Row } from "../../shared/layout/flex";
import PricingSection from "../../shared/pricing-section/pricing-section";
import { Testimonials } from "../../shared/Testimonials";
import LottieData from '../../../../public/assets/images/publicPages/smart-allocation/smart-allocation.json';
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

const SmartAllocationSalesPage: FC = () => {
    const { setVisibleSection, modalTrigger } = useAuthModal();
    const { t } = useTranslation(['smart-allocation']);
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.setSpeed(0.2);
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
                    <h2 className="font-bold text-white text-3xl md:text-5xl text-left md:leading-snug">{t('salesPage.title')}  <span className="text-blue-1">{t('salesPage.smartAllocation')}</span></h2>
                    <p className="font-medium text-white text-left">{t('salesPage.sub')}</p>

                    <Col className='gap-4'>
                        {[t('salesPage.points.1'), t('salesPage.points.2'), t('salesPage.points.3')].map(e => {
                            return (
                                <RowItem content={e} />
                            );
                        })}
                    </Col>

                    <button onClick={onClick} className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit")}>
                        {t('salesPage.buildPortfolio')}
                    </button>
                </Col>
                <Col className="flex-1 w-full h-full gap-4 relative">
                    <Lottie animationData={LottieData} lottieRef={lottieRef} className={clsx(styles.animateImg, "w-full absolute scale-[1.35] lg:scale-150 xl:scale-[1.35] h-full")} />
                    <Lottie animationData={LottieData} className={clsx("w-full opacity-0 h-full")} />
                </Col>
            </Row>

            <Col className="pb-20 px-4">
                <Row className="gap-16 flex-col lg:flex-row items-center w-full lg:w-[100vw] px-4 lg:px-20 xl:px-72 py-14">
                    <Col className="flex-1 w-full h-full gap-4 items-center justify-center">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/smart-allocation/1.png')} className={clsx(styles.hightlight, "w-full self-end h-full")} />
                    </Col>
                    <Col className="flex-1 w-full h-full gap-4 justify-center">
                        <h2 className="font-bold text-white text-3xl md:text-5xl text-left md:leading-snug">{t('salesPage.sections.1.title')}</h2>
                        <h2 className="font-bold text-white text-xl md:text-2xl text-left md:leading-snug">{t('salesPage.sections.1.sub')}</h2>

                        <p className="font-medium text-white text-left">{t('salesPage.sections.1.content')}</p>

                        <button onClick={onClick} className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit rounded-full")}>
                            {t('salesPage.getStarted')}
                        </button>
                    </Col>
                </Row>

                <Row className="gap-14 flex-col-reverse lg:flex-row items-center w-full lg:w-[100vw] px-4 lg:px-20 xl:px-72 py-14">
                    <Col className="flex-1 w-full h-full gap-4 justify-center">
                        <h2 className="font-bold text-white text-3xl md:text-5xl text-left md:leading-snug">{t('salesPage.sections.2.title')}</h2>
                        <h2 className="font-bold text-white text-xl md:text-2xl text-left md:leading-snug">{t('salesPage.sections.2.sub')}</h2>

                        <p className="font-medium text-white text-left">{t('salesPage.sections.2.content')}</p>

                        <button onClick={onClick} className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit rounded-full")}>
                            {t('salesPage.getStarted')}
                        </button>
                    </Col>
                    <Col className="flex-1 w-full h-full gap-4">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/smart-allocation/2.png')} className={clsx(styles.hightlight, "w-full self-end h-full")} />
                    </Col>
                </Row>

                <Row className="gap-16 flex-col lg:flex-row items-center w-full lg:w-[100vw] px-4 lg:px-20 xl:px-72 py-14">
                    <Col className="flex-1 w-full h-full gap-4 items-center justify-center">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/smart-allocation/3.png')} className={clsx(styles.hightlight, "w-full self-end h-full")} />
                    </Col>
                    <Col className="flex-1 w-full h-full gap-4 justify-center">
                        <h2 className="font-bold text-white text-3xl md:text-5xl text-left md:leading-snug">{t('salesPage.sections.3.title')}</h2>
                        <h2 className="font-bold text-white text-xl md:text-2xl text-left md:leading-snug">{t('salesPage.sections.3.sub')}</h2>

                        <p className="font-medium text-white text-left">{t('salesPage.sections.3.content')}</p>

                        <button onClick={onClick} className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit rounded-full")}>
                            {t('salesPage.getStarted')}
                        </button>
                    </Col>
                </Row>

                <Row className="gap-14 flex-col-reverse lg:flex-row items-center w-full lg:w-[100vw] px-4 lg:px-20 xl:px-72 py-14">
                    <Col className="flex-1 w-full h-full gap-4 justify-center">
                        <h2 className="font-bold text-white text-3xl md:text-5xl text-left md:leading-snug">{t('salesPage.sections.4.title')}</h2>
                        <h2 className="font-bold text-white text-xl md:text-2xl text-left md:leading-snug">{t('salesPage.sections.4.sub')}</h2>

                        <p className="font-medium text-white text-left">{t('salesPage.sections.4.content')}</p>

                        <button onClick={onClick} className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit rounded-full")}>
                            {t('salesPage.getStarted')}
                        </button>
                    </Col>
                    <Col className="flex-1 w-full h-full gap-4">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/smart-allocation/4.png')} className={clsx(styles.hightlight, "w-full self-end h-full")} />
                    </Col>
                </Row>
            </Col>


            <PricingSection />
            <Testimonials />
        </Col>
    );
}


export default SmartAllocationSalesPage;