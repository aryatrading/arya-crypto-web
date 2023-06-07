import Image from "next/image";
import clsx from "clsx";

import { Col, Row } from "../../shared/layout/flex";

import styles from './index.module.scss';
import { useResponsive } from "../../../context/responsive.context";

export const TradingSalesPage = () => {
    const { isTabletOrMobileScreen } = useResponsive();

    return (
        <Col className="items-center justify-center w-full h-full gap-10">
            <Row className=" gap-10 flex-col-reverse lg:flex-row items-center">
                <Col className="flex-1 w-full h-full gap-8">
                    <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">The world’s <span className="text-blue-1">most advanced</span> crypto trading tool</h2>
                    <p className="font-medium text-white text-left">Our platform helps you better control your trading by transforming manual work into automated actions.</p>

                    <Row className="md:gap-8 gap-2 flex-col md:flex-row">
                        <button className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm")}>
                            Get Started
                        </button>

                        <button className={clsx(styles.secondBtn, styles.boxShadow, "text-white font-bold text-sm")}>
                            Watch Video Presentation
                        </button>
                    </Row>
                </Col>
                <Col className="flex-1 w-full h-full gap-4 relative">
                    <Image alt="" src={require('../../../../public/assets/images/publicPages/trading/firstSectionImg.png')} className={clsx(styles.animateImg, "w-full absolute h-full")} />
                    <Image alt="" src={require('../../../../public/assets/images/publicPages/trading/firstSectionImg.png')} className={clsx("w-full opacity-[0]")} />
                </Col>
            </Row>

            <Col className=" gap-10 items-center w-full md:w-[60%] relative">
                <Col className="gap-4">
                    <h2 className="font-bold text-white text-3xl md:text-5xl text-center leading-snug">Upgrade your trading</h2>
                    <p className="font-medium text-white text-center">Take your emotion out of the equation</p>
                </Col>
                {!isTabletOrMobileScreen && <>
                    <Image alt="" src={require('../../../../public/assets/images/publicPages/trading/bigShadow.png')} className="w-3/5 absolute -left-40 -top-20" />
                    <Image alt="" src={require('../../../../public/assets/images/publicPages/trading/smallShadow.png')} className="w-2/5 absolute -right-40 -bottom-20" />
                </>}

                <Row className="gap-8 items-centermin- justify-center w-full flex-wrap md:flex-nowrap z-20">
                    <Col className="w-full md:w-[50%] min-h-[320px] bg-blue-5 rounded-lg p-2 md:p-6 gap-4 items-center justify-center">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/trading/1.png')} className="w-20" />
                        <h2 className="font-bold text-white text-3xl text-center leading-snug">Manage your portfolio</h2>
                        <p className="font-medium text-white text-center">Connect all your exchange accounts and manage them with our trading terminal. Free of charge!</p>
                    </Col>
                    <Col className="w-full md:w-[50%] min-h-[320px] bg-blue-5 rounded-lg p-2 md:p-6 gap-4 items-center justify-center">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/trading/2.png')} className="w-20" />
                        <h2 className="font-bold text-white text-3xl text-center leading-snug">Trailing features</h2>
                        <p className="font-medium text-white text-center">Follow the prices movement and sell/buy automatically when the prices goes in another direction.</p>
                    </Col>
                </Row>
                <Row className="gap-8 items-centermin- justify-center w-full flex-wrap md:flex-nowrap z-20">
                    <Col className="w-full md:w-[50%] min-h-[320px] bg-blue-5 rounded-lg p-2 md:p-6 gap-4 items-center justify-center">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/trading/3.png')} className="w-20" />
                        <h2 className="font-bold text-white text-3xl text-center leading-snug">Profit scheduling</h2>
                        <p className="font-medium text-white text-center">Schedule unto 5 take profits in advance and maximize your exit without having to sit in front of your screen.</p>
                    </Col>
                    <Col className="w-full md:w-[50%] min-h-[320px] bg-blue-5 rounded-lg p-2 md:p-6 gap-4 items-center justify-center">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/trading/4.png')} className="w-20" />
                        <h2 className="font-bold text-white text-3xl text-center leading-snug">Pro Strategies</h2>
                        <p className="font-medium text-white text-center">Use ARYA Crypto for your DCA, Scalping, Arbitrage or short-selling strategies.</p>
                    </Col>
                </Row>
            </Col>

            <Col className="w-full md:w-[100vw] md:px-40 bg-grey-6 py-14 items-center justify-center rounded-lg gap-8 px-4">
                <h2 className="font-bold text-white text-3xl md:text-5xl text-center leading-snug">Social Trading Platform</h2>
                <p className="font-medium text-white md:mx-[20%] mx-8 text-center">Join the Social Trading revolution. Subscribe to trading signals and discuss trading strategies on our internal chat. You don’t need to be an expert to trade like one.</p>

                <Row className="mt-8 gap-10 flex-col lg:flex-row">
                    <Image alt="" src={require('../../../../public/assets/images/publicPages/trading/triggers.png')} className="w-[100%] flex-1" />

                    <Col className="flex-1 w-full gap-8 justify-center">
                        <Col className="bg-white rounded-lg px-6 py-2 w-fit">
                            <p className="text-blue-5 font-medium text-sm">Triggers</p>
                        </Col>
                        <h2 className="font-bold text-white text-3xl md:text-5xl text-left leading-snug">Adapt automatically, by creating trading rules.</h2>
                        <p className="font-medium text-white text-left">Adapt automatically on market change. Decide what needs to happen when markets dip and set up on action. So you can rest easy while your ARYA crypto works for you</p>

                        <button className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit")}>
                            Watch the presentation
                        </button>
                    </Col>
                </Row>

                <Row className="mt-8 gap-10 flex-col-reverse lg:flex-row">
                    <Col className="flex-1 w-full gap-8 justify-center">
                        <Col className="bg-white rounded-lg px-6 py-2 w-fit self-end">
                            <p className="text-blue-5 font-medium text-sm">Trailing & DCA</p>
                        </Col>
                        <h2 className="font-bold text-white text-3xl md:text-5xl text-left lg:text-right leading-snug">The magic touch, only ARYA can do.</h2>
                        <p className="font-medium text-white text-left lg:text-right">Selling too early? Use the trailing stop-loss, which tracks the price up and only sells when it drops. Buying at the wrong moments? Use DCA to buy extra and lower your average buying price. All automatically.</p>

                        <button className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit self-end")}>
                            Get Started
                        </button>
                    </Col>

                    <Image alt="" src={require('../../../../public/assets/images/publicPages/trading/trailing.png')} className="w-[100%] flex-1" />
                </Row>
            </Col>

            <Row className="w-full pt-6 items-center bg-blue-3 justify-center gap-8 rounded-lg px-8 lg:mt-[300px] flex-col-reverse lg:flex-row">
                <Col className="gap-4 items-start flex-1 h-full justify-center py-4">
                    <h2 className="font-bold text-white text-4xl leading-snug">Start trading with Arya crypto for free!</h2>
                    <p className="font-bold text-white text-xl">Free to use - no credit card required</p>

                    <button className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm w-fit")}>
                        Get Started
                    </button>
                </Col>
                <Col className="flex-1 relative">
                    <Image alt="" src={require('../../../../public/assets/images/publicPages/trading/lastSectionImg.png')} className="w-full lg:w-[80%] lg:absolute lg:-top-[400px]" />
                </Col>
            </Row>
        </Col>
    );
}