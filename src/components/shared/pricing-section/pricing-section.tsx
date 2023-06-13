import { FC, useCallback, useMemo } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleIconSolid, StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useTranslation } from "next-i18next";

import { Col, Row } from "../layout/flex";
import Button from "../buttons/button";

const Arr = [{
    name: "Arnaud B",
    contnet: "Good evening Fabien! It’s been a year since I started using ARYA following your USD/JPY signal for my first trade (It was a win of course). A big thank you!",
}, {
    name: "Arnaud B",
    contnet: "Good evening Fabien! It’s been a year since I started using ARYA following your USD/JPY signal for my first trade (It was a win of course). A big thank you!",
}, {
    name: "Arnaud B",
    contnet: "Good evening Fabien! It’s been a year since I started using ARYA following your USD/JPY signal for my first trade (It was a win of course). A big thank you!",
}];

const PricingSection: FC = () => {

    const { t } = useTranslation(["pricing-plans"]);

    const freeFeature = useCallback((text: string) => {
        return (
            <Row className="gap-2 items-center">
                <CheckCircleIcon width={25} />
                <p className="text-xl">{text}</p>
            </Row>
        )
    }, [])

    const freePlan = useMemo(() => {
        return (
            <Col className="border-4 border-[#1F2F4D] rounded-2xl py-14 px-14 gap-5 relative">
                <Button className="border border-[#1F2F4D] rounded-full py-1 px-5 w-fit">{t("Basic")}</Button>
                <h2 className="text-6xl font-extrabold">{t("FREE")}</h2>
                <hr />
                <Col className="gap-5">
                    {freeFeature(t("singleExchangeTracking"))}
                    {freeFeature(t("marketOrderTrading"))}
                    {freeFeature(t("portfolioBacktesting"))}
                </Col>
                <Button className="bg-[#1F2F4D] rounded-full py-3 px-10 w-fit absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 font-bold">
                    {t("common:getStarted")}
                </Button>
            </Col>
        )
    }, [freeFeature, t]);

    const premiumFeature = useCallback((text: string) => {
        return (
            <Row className="gap-2 items-center">
                <CheckCircleIconSolid width={25} />
                <p className="text-xl">{text}</p>
            </Row>
        )
    }, [])

    const premiumPlan = useMemo(() => {
        return (
            <Col className="border-4 border-blue-1 rounded-2xl py-14 px-14 gap-5 relative bg-[#152445]">
                <Button className="border border-[#668EF1] bg-[#3c5eb1] rounded-full py-1 px-5 w-fit">{t("premium")}</Button>
                <Col>
                    <p className="text-4xl font-bold text-green-1">$14.99 <span className="text-base text-white">/mo</span></p>
                    <p className="text-bold">{t("Billed")} <span className="text-blue-1">$144.99</span> {t("perYear")}</p>
                </Col>
                <hr className="bg-grey-1" />
                <Col className="gap-5 md:flex-row">
                    <Col className="gap-5">
                        {premiumFeature(t("multiExchangeTracking"))}
                        {premiumFeature(t("smartAllocation"))}
                        {premiumFeature(t("autoRebalancing"))}
                        {premiumFeature(t("portfolioBacktesting"))}
                        {premiumFeature(t("advancedTrading"))}
                    </Col>
                    <Col className="gap-5">
                        {premiumFeature(t("5TakeProfits"))}
                        {premiumFeature(t("stopLoss"))}
                        {premiumFeature(t("traillingMode"))}
                        {premiumFeature(t("exitStrategy"))}
                    </Col>
                </Col>
                <Button className="bg-blue-1 rounded-full py-3 px-10 w-fit absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 font-bold">
                    {t("common:getStarted")}
                </Button>
            </Col>
        )
    }, [premiumFeature, t]);

    const subscriptionPromise = useCallback(({ mainImage, title, description, images }: { mainImage: string, title: string, description?: string, images?: string[] }) => {
        return (
            <Col className="items-center gap-5 md:flex-1 text-center md:max-w-[33.333%]">
                <Image src={mainImage} alt="" width={56} height={56} />
                <p className="text-2xl font-bold">{title}</p>
                {description && <p className="max-w-[250px] text-xl">{description}</p>}
                {images &&
                    <Row className="gap-2">
                        <Image src="/assets/images/publicPages/visaImg.png" alt="" width={70} height={25} />
                        <Image src="/assets/images/publicPages/mastercardImg.png" alt="" width={50} height={20} />
                        <Image src="/assets/images/publicPages/bankImg.png" alt="" width={40} height={40} />
                    </Row>
                }
            </Col>
        )
    }, [])

    return (
        <Col className="py-20 w-full bg-[#111827] gap-14">
            <Col className="container items-center gap-14">
                <h2 className="text-4xl md:text-5xl font-bold max-w-[700px]">{t("pricingPlans")}</h2>
                <p className="text-xl max-w-[700px] text-center">{t("automateYourCryptocurrencyStrategy")}</p>
                <Col className="md:flex-row gap-10">
                    {freePlan}
                    {premiumPlan}
                </Col>
                <p className="text-xl text-center mt-5">{t("yourSubscriptionWillRenewAutomatically")}</p>
                <Col className="md:flex-row w-full items-center justify-center md:justify-around gap-10 md:gap-0">
                    {subscriptionPromise({
                        mainImage: "/assets/images/publicPages/satisfactionGuaranteedImg.png",
                        title: t("satisfactionGuaranteed"),
                        description: t<string>("changeYourMindWithin14DaysAndGetFullRefund")
                    })}
                    {subscriptionPromise({
                        mainImage: "/assets/images/publicPages/securePaymentImg.png",
                        title: t("securePayment"),
                        images: []
                    })}
                    {subscriptionPromise({
                        mainImage: "/assets/images/publicPages/technicalSupportImg.png",
                        title: t("technicalSupport"),
                        description: t<string>("weHaveSupportTeamReadyToAnswerAnyQuestions")
                    })}
                </Col>
            </Col>

            <Col className="gap-10 w-full mb-10">
                <h2 className="font-bold text-white text-3xl md:text-5xl leading-snug text-center">{t('testimonials')}</h2>

                <Row className="gap-2 overflow-hidden w-full lg:justify-center px-4 md:px-12 lg:px-80">
                    {Arr.map((item, index) => {
                        return (
                            <Col key={index} className="w-[calc(95vw-1rem)] md:w-[calc(50%-1rem)] xl:w-[calc(33.3333%-1rem)] shrink-0 aspect-video items-center bg-[#E2EAFF] rounded-2xl py-12 px-10 border-4 border-[#3C5EB1]">
                                <h4 className="font-bold text-blue-5 text-xl mb-4">{item.name}</h4>
                                <p className="font-light text-blue-5 text-sm text-center">{item.contnet}</p>

                                <Row className="mt-4">
                                    <StarIcon className="stroke-yellow-1 fill-yellow-1 w-8 h-8" />
                                    <StarIcon className="stroke-yellow-1 fill-yellow-1 w-8 h-8" />
                                    <StarIcon className="stroke-yellow-1 fill-yellow-1 w-8 h-8" />
                                    <StarIcon className="stroke-yellow-1 fill-yellow-1 w-8 h-8" />
                                    <StarIcon className="stroke-yellow-1 fill-yellow-1 w-8 h-8" />
                                </Row>
                            </Col>
                        );
                    })}
                </Row>
            </Col>
        </Col>
    )
}

export default PricingSection;