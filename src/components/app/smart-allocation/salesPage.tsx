import { FC } from "react";
import clsx from "clsx";
import Image from "next/image";

import { Col, Row } from "../../shared/layout/flex";
import PricingSection from "../../shared/pricing-section/pricing-section";
import { Testimonials } from "../../shared/Testimonials";

import styles from './index.module.scss';

const SmartAllocationSalesPage: FC = () => {
    return (
        <Col className="items-center justify-center w-full h-full gap-10 mt-16">
            <Row className=" gap-10 flex-col-reverse lg:flex-row items-center">
                <Col className="flex-1 w-full h-full gap-8">
                    <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">Transform the way you invest with  <span className="text-blue-1">Smart Allocation</span></h2>
                    <p className="font-medium text-white text-left">Smart Allocation give you granular control over your portfolio strategy. You can create custom asset allocations with unique weighting methods, set minimum and maximum allocation amounts, perform custom periodic or threshold rebalancing strategies, set your own stop-losses, and so much more.</p>

                    <button className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit")}>
                        Build my portfolio
                    </button>
                </Col>
                <Col className="flex-1 w-full h-full gap-4 relative">
                    <Image alt="" src={require('../../../../public/assets/images/publicPages/smart-allocation/firstSectionImg.png')} className={clsx("w-[80%] self-end h-full")} />
                    <Image alt="" src={require('../../../../public/assets/images/publicPages/smart-allocation/coinsCircle.png')} className={clsx(styles.rotate, styles.hightlight, "w-[40%] rounded-full absolute -z-20 -top-16 left-10 p-4")} />
                </Col>
            </Row>

            <Row className=" gap-10 flex-col lg:flex-row items-center mt-10 w-full lg:w-[100vw] bg-grey-6 px-4 lg:px-72 py-14 rounded-lg lg:rounded-none">
                <Col className="flex-1 w-full h-full gap-4 relative">
                    <Image alt="" src={require('../../../../public/assets/images/publicPages/smart-allocation/secondSectionImg.png')} className={clsx("w-full self-end h-full")} />
                </Col>
                <Col className="flex-1 w-full h-full gap-4">
                    <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">Your Cryptocurrency ETF</h2>
                    <h2 className="font-bold text-white text-3xl md:text-2xl text-left leading-snug">Diversify Across the Entire Market with Once Click</h2>
                    <p className="font-medium text-white text-left">Diversify mitigates risk and improves returns. Studies found that 95% of active traders fail to beat the market. With ARYA Crypto, you can build your own pool of crypto, adapted to your risk profile, in a few clicks.</p>

                    <button className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit")}>
                        Get Started
                    </button>
                </Col>
            </Row>

            <Row className=" gap-10 flex-col lg:flex-row items-center mt-10 w-full">
                <Col className="flex-1 w-full h-full gap-4">
                    <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">Automatic Rebalancing</h2>
                    <h2 className="font-bold text-white text-3xl md:text-2xl text-left leading-snug">Rebalance Keep Your Portfolio on Track</h2>
                    <p className="font-medium text-white text-left">When the market shifts, a portfolio will drift away from its target allocation. ARYA crypto automatically rebalances your portfolio to keep it on track, saving you time. Portfolio rebalances generally lead to risk mitigation and improved returns</p>

                    <button className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit")}>
                        Get Started
                    </button>
                </Col>
                <Col className="flex-1 w-full h-full gap-4 relative">
                    <Image alt="" src={require('../../../../public/assets/images/publicPages/smart-allocation/rebalanceImg.png')} className={clsx(styles.hightlight, "w-full self-end h-full")} />
                </Col>
            </Row>

            <Row className=" gap-10 flex-col lg:flex-row items-center mt-10 w-full lg:w-[100vw] bg-grey-6 px-4 lg:px-72 py-14 rounded-lg lg:rounded-none">
                <Col className="flex-1 w-full h-full gap-4 relative">
                    <Image alt="" src={require('../../../../public/assets/images/publicPages/smart-allocation/fourthSectionImg.png')} className={clsx("w-full self-end h-full")} />
                </Col>
                <Col className="flex-1 w-full h-full gap-4">
                    <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">Tailored to Your Needs</h2>
                    <h2 className="font-bold text-white text-3xl md:text-2xl text-left leading-snug">Customize ARYA Crypto to fit your Preferences.</h2>
                    <p className="font-medium text-white text-left">Change your rebalancing frequency, add stop losses, take profits, trailing modes, or liquidate your assets anytime. ARYA Crypto is highly customizable. On top of that, we provide 24/7 customer support.</p>

                    <button className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit")}>
                        Get Started
                    </button>
                </Col>
            </Row>
            <PricingSection />
            <Testimonials />
        </Col>
    );
}


export default SmartAllocationSalesPage;