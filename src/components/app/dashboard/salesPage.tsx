import Image from "next/image";
import clsx from "clsx";

import { Col, Row } from "../../shared/layout/flex";

import styles from './salesPage.module.scss';

export const PortfolioSalesPage = () => {
    return (
        <Col className="items-center justify-center w-full md:-mt-10 gap-32">
            <Col className="gap-8 items-center">
                <h2 className="font-bold text-white text-4xl text-center leading-snug">Manage Your Crypto Portfolios <br /> In One Place</h2>
                <p className="font-medium text-white text-center">Securely connect the portfolio you’re using to start.</p>

                <Col className="relative items-center justify-center">
                    <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/portfolioMainImg.png')} className={clsx(styles.animateImg, "w-full md:mx-60 absolute h-full")} />
                    <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/portfolioMainImg.png')} className={clsx("w-full md:mx-60 opacity-[0]")} />
                </Col>
                <button className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm md:-mt-10")}>
                    Get Started
                </button>
            </Col>

            <Col className="gap-8 items-center">
                <h2 className="font-bold text-white text-4xl text-center leading-snug">All-In-One Platform For Managing<br /> All your Crypto and DeFi Assets</h2>
                <p className="font-medium text-white text-center">ARYA Crypto supports the post popular cryptocurrency platforms, including <br /> Binance, coinable, and 25 others.</p>

                <Row className="gap-10 items-center justify-center mt-8 flex-col-reverse md:flex-row">
                    <Col className="flex-1 gap-6">
                        <Col className="gap-2">
                            <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/1.png')} className="w-14 h-14" />
                            <h3 className="font-extrabold text-2xl text-white">One Dashboard for Everything</h3>
                            <p className="text-white font-medium">Track Every asset you have from one dashboard, and stay on top of your game.</p>
                        </Col>

                        <Col className="gap-2">
                            <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/2.png')} className="w-14 h-14" />
                            <h3 className="font-extrabold text-2xl text-white">One Dashboard for Everything</h3>
                            <p className="text-white font-medium">Track Every asset you have from one dashboard, and stay on top of your game.</p>
                        </Col>

                        <Col className="gap-2">
                            <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/3.png')} className="w-14 h-14" />
                            <h3 className="font-extrabold text-2xl text-white">One Dashboard for Everything</h3>
                            <p className="text-white font-medium">Track Every asset you have from one dashboard, and stay on top of your game.</p>
                        </Col>

                    </Col>
                    <Col className="flex-1">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/portfolioSecondImg.png')} className="w-full md:w-[80%]" />
                    </Col>
                </Row>
            </Col>

            <Col className="md:w-[100vw] w-full bg-grey-6 py-14 items-center overflow-hidden rounded-lg">
                <h2 className="font-bold text-white text-4xl text-center leading-snug">Get started in a few minutes</h2>
                <p className="font-medium text-white text-center">ARYA Crypto supports the post popular cryptocurrency platforms, including <br /> Binance, coinable, and 25 others.</p>

                <div className="flex flex-col lg:flex-row gap-8 px-72 items-center justify-center mt-8 shrink-0">
                    <Row className="rounded-lg border p-2 border-blue-1 items-center  gap-4 pr-4 shrink-0 w-[80vw] md:w-auto hover:bg-gradient-to-br hover:from-blue-1">
                        <Col className="w-10 h-10 rounded-md bg-blue-1 items-center justify-center">
                            <span className="font-bold text-xl">1</span>
                        </Col>
                        <p className="font-bold text-white text-lg">Create an account</p>
                    </Row>
                    <Row className="rounded-lg border p-2 border-blue-1 items-center gap-4 pr-4 shrink-0 w-[80vw] md:w-auto hover:bg-gradient-to-br hover:from-blue-1">
                        <Col className="w-10 h-10 rounded-md bg-blue-1 items-center justify-center">
                            <span className="font-bold text-xl">2</span>
                        </Col>
                        <p className="font-bold text-white text-lg">Link your Account</p>
                    </Row>
                    <Row className="rounded-lg border p-2 border-blue-1 items-center  gap-4 pr-4 shrink-0 w-[80vw] md:w-auto hover:bg-gradient-to-br hover:from-blue-1">
                        <Col className="w-10 h-10 rounded-md bg-blue-1 items-center justify-center">
                            <span className="font-bold text-xl">3</span>
                        </Col>
                        <p className="font-bold text-white text-lg flex-1">Manage your cryptos In one place</p>
                    </Row>
                </div>

                <button className={clsx(styles.startBtn, styles.boxShadow, "text-white font-bold text-sm mt-10 self-center")}>
                    Start Now
                </button>
            </Col>

            <Col className="w-full items-center justify-center">
                <h2 className="font-bold text-white text-4xl text-center leading-snug">The Ultimate Security for<br /> Your Digital Assets</h2>
                <p className="font-medium text-white text-center max-w-[50%]">ARYA Crypto is equipped with top-quality infrastructure designed to ensure maximum protection of assets at all times. Since we ask for read-only access only, your holdings are perfectly safe under all conditions.</p>

                <div className="items-center justify-center gap-8 flex mt-10 flex-col md:flex-row">
                    <Col className="p-8 items-center justify-center border border-blue-1 rounded-lg gap-4 flex-1 hover:bg-gradient-to-bl hover:from-blue-1 text-center">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/4.png')} className="w-14 h-14" />
                        <h3 className="font-extrabold text-xl text-white">Military-grade Encryption</h3>
                        <h3 className="text-sm text-white">We use the most advanced military-grade encryption to securely transfer and store data.</h3>
                    </Col>
                    <Col className="p-8 items-center justify-center border border-blue-1 rounded-lg gap-4 flex-1 hover:bg-gradient-to-bl hover:from-blue-1 text-center">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/5.png')} className="w-14 h-14" />
                        <h3 className="font-extrabold text-xl text-white">Secured by Alex</h3>
                        <h3 className="text-sm text-white">We’re defending agains external threats and guarding misuse of insider access</h3>
                    </Col>
                    <Col className="p-8 items-center justify-center border border-blue-1 rounded-lg gap-4 flex-1 hover:bg-gradient-to-bl hover:from-blue-1 text-center">
                        <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/6.png')} className="w-14 h-14" />
                        <h3 className="font-extrabold text-xl text-white">Best Practices</h3>
                        <h3 className="text-sm text-white">We follow the most advanced security procedures to ensure that your account is safe as possible</h3>
                    </Col>
                </div>

            </Col>

        </Col>
    );
}