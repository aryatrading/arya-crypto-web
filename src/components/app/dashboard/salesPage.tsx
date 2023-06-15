import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import clsx from "clsx";
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import PricingSection from "../../shared/pricing-section/pricing-section";
import Button from "../../shared/buttons/button";
import { Col, Row } from "../../shared/layout/flex";
import { Testimonials } from "../../shared/Testimonials";
import { useAuthModal } from "../../../context/authModal.context";
import LottieData from "../../../../public/assets/images/publicPages/portfolio/dashboard.json";
import logoWithCryptoLogos from "../../../../public/assets/images/publicPages/portfolio/logoWithIcons.json";

import styles from './salesPage.module.scss';

export const PortfolioSalesPage = () => {
    const { setVisibleSection, modalTrigger } = useAuthModal();
    const { t } = useTranslation(["dashboard"]);
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const ref = useRef<LottieRefCurrentProps>(null);
    const observer = useRef<any>();

    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.pause();
            setTimeout(() => {
                lottieRef.current?.play();
            }, 1000);
        }
    }, []);

    const isOnView = useCallback(
        (node: any) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                const el = document.getElementById('lottieHolder');
                let rect = el?.getBoundingClientRect() ?? { y: 1 };
                if (entries[0].isIntersecting) {
                    if (rect?.y > 0) {
                        ref.current?.play();
                    } else {
                        ref.current?.goToAndPlay(110, true);
                        setTimeout(() => ref.current?.pause(), 1200);
                        setTimeout(() => ref.current?.play(), 2000);
                    }
                } else {
                    ref.current?.stop();
                }
            });
            if (node) observer.current.observe(node);
        }, []
    )

    const onOpenSignUpClick = useCallback(() => {
        setVisibleSection('signup');
        modalTrigger.show();
    }, [modalTrigger, setVisibleSection])

    const mainBanner = useMemo(() => {
        return (
            <Row className={clsx("gap-10 flex-col-reverse lg:flex-row items-center px-4 md:px-12 lg:px-20 xl:px-60 py-20 justify-center min-h-[calc(100vh-65px)]", styles.mainBanner)}>
                <Col className="flex-1 w-full h-full gap-8 justify-center">
                    <h2 className="font-bold text-white text-3xl md:text-5xl text-left md:leading-snug">{t("salesPage.trackYourCryptoPortfoliosIn")} <span className="block md:inline w-fit highlighted-text">{t("salesPage.onePlace")}</span></h2>
                    <p className="font-medium text-white text-left">{t("salesPage.monitorYourCryptosAcrossDifferentExchangesOnUnifiedDashboard")}</p>
                    <button onClick={onOpenSignUpClick} className={clsx(styles.startBtn, styles.boxShadow, "text-white rounded-full font-bold text-sm w-fit")}>
                        {t('salesPage.connectPortfolioNow')}
                    </button>
                </Col>

                <Col className="flex-1 w-full h-full gap-4 relative">
                    <Lottie animationData={LottieData} lottieRef={lottieRef} className={clsx(styles.animateImg, "w-full scale-150 lg:scale-[1.65] absolute h-full")} />
                    <Lottie animationData={LottieData} className={clsx("w-full scale-125 opacity-[0]")} />
                </Col>
            </Row>
        )
    }, [onOpenSignUpClick, t]);

    const firstSection = useMemo(() => {
        return (
            <Col className="py-10 w-full bg-[#111827]">
                <Col className="container items-center">
                    <Col className="items-center text-center gap-3">
                        <h2 className="text-4xl md:text-5xl font-bold max-w-[700px]">{t("salesPage.allInOnePlatformForTrackingAllYourAssets")}</h2>
                        <p className="max-w-[700px]">{t("salesPage.ARYACryptoSupportsTheMostPopularCryptocurrencyPlatforms")}</p>
                    </Col>
                    <span ref={isOnView} id="lottieHolder">
                        <Lottie className="max-w-[750px]" lottieRef={ref} animationData={logoWithCryptoLogos} />
                    </span>
                    <Col className="w-full md:flex-row gap-6 text-center justify-center items-center md:items-start">
                        <Col className="gap-5 items-center w-[350px]">
                            <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/1.png')} className="w-20 h-20" width={128} height={128} />
                            <h3 className="font-extrabold text-3xl text-white">{t("salesPage.oneDashboardForEverything")}</h3>
                            <p className="text-white font-medium max-w-[260px]">{t("salesPage.trackEveryAssetYouHaveFromOneDashboard")}</p>
                        </Col>
                        <Col className="gap-5 items-center w-[350px]">
                            <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/2.png')} className="w-20 h-20" width={128} height={128} />
                            <h3 className="font-extrabold text-3xl text-white">{t("salesPage.globalPerspective")}</h3>
                            <p className="text-white font-medium max-w-[260px]">{t("salesPage.haveGlobalVisionOnYourCryptoWealthAndStartTakeStepsToImproveIt")}</p>
                        </Col>

                        <Col className="gap-5 items-center w-[350px]">
                            <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/3.png')} className="w-20 h-20" width={128} height={128} />
                            <h3 className="font-extrabold text-3xl text-white">{t("salesPage.quick&Secure")}</h3>
                            <p className="text-white font-medium max-w-[260px]">{t("salesPage.gettingStartedWithARYACryptoOnlyTakesFewMinutes")}</p>
                        </Col>

                    </Col>
                </Col>
            </Col>
        )
    }, [isOnView, t]);


    const secondSection = useMemo(() => {
        return (
            <Col className="py-20 w-full">
                <Col className="container items-center gap-14">
                    <Col className="items-center text-center gap-3">
                        <h2 className="text-4xl md:text-5xl font-bold max-w-[700px]">{t("salesPage.getStartedInFewMinutes")}</h2>
                        <p className="max-w-[700px]">{t("salesPage.seamlesslyConnectYourEntireCryptoPortfolioInJustFewSteps")}</p>
                    </Col>
                    <Col className="w-full md:flex-row gap-6 text-center justify-center items-center md:items-end">
                        <Col className="gap-2 items-center justify-end w-[350px]">
                            <Image alt="" src="/assets/images/publicPages/portfolio/getStarted1.png" width={300} height={500} />
                            <Col className="relative border border-blue-1 rounded-lg p-5 w-full max-w-[300px]">
                                <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 bg-blue-1 w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold">1</p>
                                <p className="font-extrabold md:text-2xl text-white">{t("salesPage.createAnAccount")}</p>
                            </Col>
                        </Col>
                        <Col className="gap-2 items-center justify-end w-[350px]">
                            <Image alt="" src="/assets/images/publicPages/portfolio/getStarted2.png" width={300} height={500} />
                            <Col className="relative border border-blue-1 rounded-lg p-5 w-full max-w-[300px]">
                                <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 bg-blue-1 w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold">2</p>
                                <p className="font-extrabold md:text-2xl text-white">{t("salesPage.linkYourAccount")}</p>
                            </Col>
                        </Col>
                        <Col className="gap-2 items-center justify-end w-[350px]">
                            <Image alt="Step 3" src="/assets/images/publicPages/portfolio/getStarted3.png" width={300} height={500} />

                            <Col className="relative border border-blue-1 rounded-lg p-5 w-full max-w-[300px]">
                                <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 bg-blue-1 w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold">3</p>
                                <p className="font-extrabold md:text-2xl text-white">{t("salesPage.manageYourCryptos")}</p>
                            </Col>
                        </Col>
                    </Col>
                    <Button onClick={onOpenSignUpClick} className={`${styles.startBtn} font-bold w-fit rounded-full`}>{t("salesPage.connectYourExchange")}</Button>
                </Col>
            </Col>
        )
    }, [onOpenSignUpClick, t]);

    const thirdSectionFeature = useCallback(({ title, description, imgSrc }: { title: string, description: string, imgSrc: string }) => {
        return (
            <Col className="p-8 items-center justify-center border-2 border-blue-1 rounded-3xl gap-4 hover:bg-gradient-to-bl hover:from-blue-1 text-center aspect-square w-[350px] bg-black-2">
                <Image alt="" src={imgSrc} className="w-32 h-32" width={128} height={128} />
                <h3 className="font-extrabold text-2xl text-white">{title}</h3>
                <h3 className="text-white">{description}</h3>
            </Col>
        )
    }, []);

    const thirdSection = useMemo(() => {
        return (
            <Col className={`py-20 w-full bg-[#111827] ${styles.securityBanner}`}>
                <Col className="container items-center gap-14">
                    <Col className="items-center text-center gap-3">
                        <h2 className="text-4xl md:text-5xl font-bold max-w-[700px]">{t("salesPage.theUltimateSecurityForYourDigitalAssets")}</h2>
                        <p className="max-w-[700px]">{t("salesPage.ARYACryptoIsEquippedWithTopQualityInfrastructure")}</p>
                    </Col>
                    <Col className="w-full md:flex-row gap-6 text-center justify-center items-center">
                        {thirdSectionFeature({
                            title: t("salesPage.encrypted"),
                            description: t("salesPage.weUseAdvancedEncryptionToSecurelyTransferAndStoreData"),
                            imgSrc: "/assets/images/publicPages/portfolio/4.png",
                        })}
                        {thirdSectionFeature({
                            title: t("salesPage.secured"),
                            description: t("salesPage.weProtectYouAndYourCryptoAssetsFromExternalThreats"),
                            imgSrc: "/assets/images/publicPages/portfolio/5.png",
                        })}
                        {thirdSectionFeature({
                            title: t("salesPage.bestPractices"),
                            description: t("salesPage.weFollowTheMostAdvancedSecurityProcedures"),
                            imgSrc: "/assets/images/publicPages/portfolio/6.png",
                        })}
                    </Col>
                </Col>
            </Col>
        )
    }, [t, thirdSectionFeature]);

    return (
        <Col className="w-full h-full text-white" id="parent">
            {mainBanner}
            {firstSection}
            {secondSection}
            {thirdSection}
            <PricingSection />
            <Testimonials />
        </Col>
    );
}