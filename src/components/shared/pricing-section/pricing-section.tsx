import { FC, useCallback, useMemo } from "react";
import { Col, Row } from "../layout/flex";
import Button from "../buttons/button";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useTranslation } from "next-i18next";

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
            <Col className="items-center gap-5 flex-1 text-center max-w-[33.333%]">
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
        <Col className="py-20 w-full bg-[#111827]">
            <Col className="container items-center gap-14">
                <h2 className="text-4xl md:text-5xl font-bold max-w-[700px]">{t("pricingPlans")}</h2>
                <p className="text-xl max-w-[700px] text-center">{t("automateYourCryptocurrencyStrategy")}</p>
                <Col className="md:flex-row gap-10">
                    {freePlan}
                    {premiumPlan}
                </Col>
                <p className="text-xl text-center mt-5">{t("yourSubscriptionWillRenewAutomatically")}</p>
                <Col className="md:flex-row w-full justify-around gap-10 md:gap-0">
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
        </Col>
    )
}

export default PricingSection;