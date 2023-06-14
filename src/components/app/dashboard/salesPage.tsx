import { useTranslation } from "next-i18next";
import { useCallback, useMemo } from "react";
import Lottie from "lottie-react";
import Image from "next/image";

import PricingSection from "../../shared/pricing-section/pricing-section";
import Button from "../../shared/buttons/button";
import { Col } from "../../shared/layout/flex";
import styles from './salesPage.module.scss';
import { Testimonials } from "../../shared/Testimonials";

import logoWithCryptoLogos from "./logoWithCryptoLogos.json";

export const PortfolioSalesPage = () => {

    const { t } = useTranslation(["dashboard"]);

    const mainBanner = useMemo(() => {
        return (
            <Col className={`${styles.mainBanner} min-h-[calc(100vh-65px)] justify-center`}>
                <Col className={`md:flex-row-reverse container text-center md:text-start gap-5`}>
                    <Col className="flex-1">
                        <Image src={require('../../../../public/assets/images/publicPages/portfolio/portfolioMainImg.png')} alt="portfolio image" />
                    </Col>
                    <Col className="flex-1 gap-10 items-center md:items-start">
                        <h2 className="text-4xl md:text-5xl font-bold flex flex-col items-center md:block">{t("salesPage.trackYourCryptoPortfoliosIn")} <span className="block md:inline w-fit highlighted-text">{t("salesPage.onePlace")}</span></h2>
                        <p className="text-xl max-w-[500px]">{t("salesPage.monitorYourCryptosAcrossDifferentExchangesOnUnifiedDashboard")}</p>
                        <Button className={`${styles.startBtn} text-xl font-bold w-fit rounded-full`}>{t("salesPage.connectPortfolioNow")}</Button>
                    </Col>
                </Col>
            </Col>
        )
    }, [t]);

    const firstSection = useMemo(() => {
        return (
            <Col className="py-10 w-full bg-[#111827]">
                <Col className="container items-center">
                    <Col className="items-center text-center gap-3">
                        <h2 className="text-4xl md:text-5xl font-bold max-w-[700px]">{t("salesPage.allInOnePlatformForTrackingAllYourAssets")}</h2>
                        <p className="text-xl max-w-[700px]">{t("salesPage.ARYACryptoSupportsTheMostPopularCryptocurrencyPlatforms")}</p>
                    </Col>
                    <Lottie className="max-w-[750px]" animationData={logoWithCryptoLogos} />
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
    }, [t]);


    const secondSection = useMemo(() => {
        return (
            <Col className="py-20 w-full">
                <Col className="container items-center gap-14">
                    <Col className="items-center text-center gap-3">
                        <h2 className="text-4xl md:text-5xl font-bold max-w-[700px]">{t("salesPage.getStartedInFewMinutes")}</h2>
                        <p className="text-xl max-w-[700px]">{t("salesPage.seamlesslyConnectYourEntireCryptoPortfolioInJustFewSteps")}</p>
                    </Col>
                    <Col className="w-full md:flex-row gap-6 text-center justify-center items-center md:items-end">
                        <Col className="gap-2 items-center justify-end w-[350px]">
                            <Image alt="" src="/assets/images/publicPages/portfolio/getStarted1.png" width={300} height={500} />
                            <Col className="relative border border-blue-1 rounded-lg p-5 w-full max-w-[300px]">
                                <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 bg-blue-1 w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold">1</p>
                                <p className="font-extrabold text-xl md:text-2xl text-white">{t("salesPage.createAnAccount")}</p>
                            </Col>
                        </Col>
                        <Col className="gap-2 items-center justify-end w-[350px]">
                            <Image alt="" src="/assets/images/publicPages/portfolio/getStarted2.png" width={300} height={500} />
                            <Col className="relative border border-blue-1 rounded-lg p-5 w-full max-w-[300px]">
                                <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 bg-blue-1 w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold">2</p>
                                <p className="font-extrabold text-xl md:text-2xl text-white">{t("salesPage.linkYourAccount")}</p>
                            </Col>
                        </Col>
                        <Col className="gap-2 items-center justify-end w-[350px]">
                            <Image alt="Step 3" src="/assets/images/publicPages/portfolio/getStarted3.png" width={300} height={500} />

                            <Col className="relative border border-blue-1 rounded-lg p-5 w-full max-w-[300px]">
                                <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 bg-blue-1 w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold">3</p>
                                <p className="font-extrabold text-xl md:text-2xl text-white">{t("salesPage.manageYourCryptos")}</p>
                            </Col>
                        </Col>
                    </Col>
                    <Button className={`${styles.startBtn} text-xl font-bold w-fit rounded-full`}>{t("salesPage.connectYourExchange")}</Button>
                </Col>
            </Col>
        )
    }, [t]);

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
                        <p className="text-xl max-w-[700px]">{t("salesPage.ARYACryptoIsEquippedWithTopQualityInfrastructure")}</p>
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
        <Col className="items-center justify-center w-full">
            {mainBanner}
            {firstSection}
            {secondSection}
            {thirdSection}
            <PricingSection />
            <Testimonials />
        </Col>
    );
}