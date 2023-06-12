import { FC, useCallback, useMemo } from "react";
import { Col, Row } from "../layout/flex";
import Button from "../buttons/button";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid";
import Image from "next/image";

const PricingSection: FC = () => {

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
                <Button className="border border-[#1F2F4D] rounded-full py-1 px-5 w-fit">Basic</Button>
                <h2 className="text-6xl font-extrabold">FREE</h2>
                <hr />
                <Col className="gap-5">
                    {freeFeature("Single Exchange Tracking")}
                    {freeFeature("Market Order Trading")}
                    {freeFeature("Portfolio Backtesting")}
                </Col>
                <Button className="bg-[#1F2F4D] rounded-full py-3 px-10 w-fit absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 font-bold">
                    Get Started
                </Button>
            </Col>
        )
    }, [freeFeature]);

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
                <Button className="border border-[#668EF1] bg-[#3c5eb1] rounded-full py-1 px-5 w-fit">Premium</Button>
                <Col>
                    <p className="text-4xl font-bold text-green-1">$14.99 <span className="text-base text-white">/mo</span></p>
                    <p className="text-bold">Billed <span className="text-blue-1">$144.99</span> per year</p>
                </Col>
                <hr className="bg-grey-1" />
                <Col className="gap-5 md:flex-row">
                    <Col className="gap-5">
                        {premiumFeature("Multi Exchange Tracking")}
                        {premiumFeature("Smart Allocation")}
                        {premiumFeature("Auto-Rebalancing")}
                        {premiumFeature("Portfolio Backtesting")}
                        {premiumFeature("Advanced Trading")}
                    </Col>
                    <Col className="gap-5">
                        {premiumFeature("5 Take Profits")}
                        {premiumFeature("Stop Loss")}
                        {premiumFeature("Trailling Mode")}
                        {premiumFeature("Exit Strategy")}
                    </Col>
                </Col>
                <Button className="bg-blue-1 rounded-full py-3 px-10 w-fit absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 font-bold">
                    Get Started
                </Button>
            </Col>
        )
    }, [premiumFeature]);

    const subscriptionPromise = useCallback(({ mainImage, title, description, images }: { mainImage: string, title: string, description?: string, images?: string[] }) => {
        return (
            <Col className="items-center gap-5 w-[350px] text-center">
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
                <h2 className="text-4xl md:text-5xl font-bold max-w-[700px]">Pricing Plans</h2>
                <p className="text-xl max-w-[700px] text-center">Automate your cryptocurrency strategy with a plan that works for you.</p>
                <Col className="md:flex-row gap-10">
                    {freePlan}
                    {premiumPlan}
                </Col>
                <p className="text-xl text-center mt-5">Your subscription will renew automatically unless it is cancelled at least 24 hours before the end of the current period, by upgrading your account, you agree to the Terms of Use & Privacy Policy.</p>
                <Col className="md:flex-row justify-center gap-10">
                    {subscriptionPromise({
                        mainImage: "/assets/images/publicPages/satisfactionGuaranteedImg.png",
                        title: "Satisfaction guaranteed",
                        description: "Change your mind within 14 days and get a full refund."
                    })}
                    {subscriptionPromise({
                        mainImage: "/assets/images/publicPages/securePaymentImg.png",
                        title: "Secure payment",
                        images: []
                    })}
                    {subscriptionPromise({
                        mainImage: "/assets/images/publicPages/technicalSupportImg.png",
                        title: "Technical support",
                        description: "We have a support team ready to answer any questions."
                    })}
                </Col>
            </Col>
        </Col>
    )
}

export default PricingSection;