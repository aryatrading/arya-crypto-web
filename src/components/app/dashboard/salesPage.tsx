import { useCallback, useMemo } from "react";
import Lottie from "lottie-react";
import Image from "next/image";

import PricingSection from "../../shared/pricing-section/pricing-section";
import Button from "../../shared/buttons/button";
import { Col } from "../../shared/layout/flex";
import styles from './salesPage.module.scss';

import logoWithCryptoLogos from "./logoWithCryptoLogos.json";

export const PortfolioSalesPage = () => {

    const mainBanner = useMemo(() => {
        return (
            <Col className={`${styles.mainBanner} min-h-screen justify-center`}>
                <Col className={`md:flex-row-reverse container text-center md:text-start gap-5`}>
                    <Col className="flex-1">
                        <Image src={require('../../../../public/assets/images/publicPages/portfolio/portfolioMainImg.png')} alt="portfolio image" />
                    </Col>
                    <Col className="flex-1 gap-10 items-center md:items-start">
                        <h2 className="text-4xl md:text-5xl font-bold flex flex-col items-center md:block">Track Your Crypto Portfolios In <span className="block md:inline w-fit highlighted-text">One Place</span></h2>
                        <p className="text-xl max-w-[500px]">Monitor your cryptos, across different exchanges, on a unified dashboard</p>
                        <Button className={`${styles.startBtn} text-xl font-bold w-fit rounded-full`}>Connect Portfolio Now</Button>
                    </Col>
                </Col>
            </Col>
        )
    }, []);

    const firstSection = useMemo(() => {
        return (
            <Col className="py-10 w-full bg-[#111827]">
                <Col className="container items-center">
                    <Col className="items-center text-center gap-3">
                        <h2 className="text-4xl md:text-5xl font-bold max-w-[700px]">All-In-One Platform For Tracking All your Crypto Assets</h2>
                        <p className="text-xl max-w-[700px]">ARYA Crypto supports the most popular cryptocurrency platforms, including Binance, Coinbase, and a lot more coming soon.</p>
                    </Col>
                    {/* <Lottie className="max-w-[750px]" animationData={logoWithCryptoLogos}/> */}
                    <Image src="/assets/images/publicPages/portfolio/logoWithCryptoLogos.png" alt="" width={750} height={500} />
                    <Col className="w-full md:flex-row gap-6 text-center justify-center items-center md:items-start">
                        <Col className="gap-5 items-center w-[350px]">
                            <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/1.png')} className="w-20 h-20" width={128} height={128} />
                            <h3 className="font-extrabold text-3xl text-white">One Dashboard for Everything</h3>
                            <p className="text-white font-medium max-w-[260px]">Track Every asset you have from one dashboard, and stay on top of your game.</p>
                        </Col>
                        <Col className="gap-5 items-center w-[350px]">
                            <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/2.png')} className="w-20 h-20" width={128} height={128} />
                            <h3 className="font-extrabold text-3xl text-white">Global Perspective</h3>
                            <p className="text-white font-medium max-w-[260px]">Have a global vision on your crypto wealth and start take steps to improve it.</p>
                        </Col>

                        <Col className="gap-5 items-center w-[350px]">
                            <Image alt="" src={require('../../../../public/assets/images/publicPages/portfolio/3.png')} className="w-20 h-20" width={128} height={128} />
                            <h3 className="font-extrabold text-3xl text-white">Quick & Secure</h3>
                            <p className="text-white font-medium max-w-[260px]">Getting started with ARYA Crypto only takes a few minutes, and it’s completely free and safe.</p>
                        </Col>

                    </Col>
                </Col>
            </Col>
        )
    }, []);


    const secondSection = useMemo(() => {
        return (
            <Col className="py-20 w-full">
                <Col className="container items-center gap-14">
                    <Col className="items-center text-center gap-3">
                        <h2 className="text-4xl md:text-5xl font-bold max-w-[700px]">Get started in a few minutes</h2>
                        <p className="text-xl max-w-[700px]">Seamlessly Connect Your Entire Crypto Portfolio in just a few steps.</p>
                    </Col>
                    <Col className="w-full md:flex-row gap-6 text-center justify-center items-center md:items-end">
                        <Col className="gap-2 items-center justify-end w-[350px]">
                            <Image alt="" src="/assets/images/publicPages/portfolio/getStarted1.png" width={300} height={500} />
                            <Col className="relative border border-blue-1 rounded-lg p-5 w-full max-w-[300px]">
                                <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 bg-blue-1 w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold">1</p>
                                <p className="font-extrabold text-xl md:text-2xl text-white">Create an account</p>
                            </Col>
                        </Col>
                        <Col className="gap-2 items-center justify-end w-[350px]">
                            <Image alt="" src="/assets/images/publicPages/portfolio/getStarted2.png" width={300} height={500} />
                            <Col className="relative border border-blue-1 rounded-lg p-5 w-full max-w-[300px]">
                                <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 bg-blue-1 w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold">2</p>
                                <p className="font-extrabold text-xl md:text-2xl text-white">link your account</p>
                            </Col>
                        </Col>
                        <Col className="gap-2 items-center justify-end w-[350px]">
                            <Image alt="Step 3" src="/assets/images/publicPages/portfolio/getStarted3.png" width={300} height={500} />

                            <Col className="relative border border-blue-1 rounded-lg p-5 w-full max-w-[300px]">
                                <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 bg-blue-1 w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold">3</p>
                                <p className="font-extrabold text-xl md:text-2xl text-white">Manage your cryptos</p>
                            </Col>
                        </Col>
                    </Col>
                    <Button className={`${styles.startBtn} text-xl font-bold w-fit rounded-full`}>Connect your exchange</Button>
                </Col>
            </Col>
        )
    }, []);

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
                        <h2 className="text-4xl md:text-5xl font-bold max-w-[700px]">The Ultimate Security for Your Digital Assets</h2>
                        <p className="text-xl max-w-[700px]">ARYA Crypto is equipped with top-quality infrastructure designed to ensure maximum protection of assets at all times. Since we ask for read-only access only, your holdings are perfectly safe under all conditions.</p>
                    </Col>
                    <Col className="w-full md:flex-row gap-6 text-center justify-center items-center">
                        {thirdSectionFeature({
                            title: "Encrypted",
                            description: "We use advanced encryption to securely transfer and store data.",
                            imgSrc: "/assets/images/publicPages/portfolio/4.png",
                        })}
                        {thirdSectionFeature({
                            title: "Secured",
                            description: "We protect you and your crypto assets from external threats.",
                            imgSrc: "/assets/images/publicPages/portfolio/5.png",
                        })}
                        {thirdSectionFeature({
                            title: "Best Practices",
                            description: "We follow the most advanced security procedures to ensure that your account is safe as possible.",
                            imgSrc: "/assets/images/publicPages/portfolio/6.png",
                        })}
                    </Col>
                </Col>
            </Col>
        )
    }, [thirdSectionFeature]);

    return (
        <Col className="items-center justify-center w-full">
            {mainBanner}
            {firstSection}
            {secondSection}
            {thirdSection}
            <PricingSection />
        </Col>
    );
}