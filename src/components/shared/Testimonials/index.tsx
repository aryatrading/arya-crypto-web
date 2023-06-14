import { StarIcon } from "@heroicons/react/24/solid";
import { Autoplay, Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "next-i18next";

import "swiper/css";
import "swiper/css/pagination";

import { Col, Row } from "../layout/flex";
import { useResponsive } from "../../../context/responsive.context";

import styles from './index.module.scss';

const Arr = [{
    name: "Arnaud B",
    contnet: "Good evening Fabien! It’s been a year since I started using ARYA following your USD/JPY signal for my first trade (It was a win of course). A big thank you!",
}, {
    name: "Yann Fsd",
    contnet: "ARYA is a great tool that allowed me to automate my trading. It also allowed me to optimize my time/money and risk/return ratio.",
}, {
    name: "Julien",
    contnet: "I started with ARYA at the end of 2018 (at the start of the company) and I have seen it all evolve, and I can tell you that it is impressive to find such professionalism and rigor.",
},
{
    name: "Manon Dejean",
    contnet: "Thank you for your work! I didn’t think I would ever be able to get into the trading world! I discovered a new hobby.",
}, {
    name: "Thibaut Trading",
    contnet: "I am a new ARYA user since the beginning of April. I used to be a manual trader for several years, and I must say that after 2 weeks of real use on a small account, I am very satisfied with the algo.",
}, {
    name: "Jeremie",
    contnet: "Thank you ARYA, 100% of this software is great. Fortunately my wife is there to stop me at the right moment and bring me back to reality!",
}, {
    name: "Yann",
    contnet: "Thanks to ARYA I had a great performance this month! My goal of the month is already reached.",
}, {
    name: "Matt",
    contnet: "Great results, while I’m sleeping on the Dow Jones in M15 for a buy order I made last night! Epic.",
}];

export const Testimonials = () => {
    const { t } = useTranslation(["pricing-plans"]);
    const { isTabletOrMobileScreen } = useResponsive();

    return (
        <Col className="my-10 gap-10 max-w-full px-10 md:px-40 lg:px-80">
            <h2 className="font-bold text-white text-3xl md:text-5xl leading-snug text-center">{t('testimonials')}</h2>
            <Swiper
                slidesPerView={isTabletOrMobileScreen ? 1 : 3}
                spaceBetween={30}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className={styles.swiper}
            >
                {
                    Arr.map((slide) => {
                        return (
                            <SwiperSlide key={slide.name}>
                                <Col className="items-center bg-offWhite-1 rounded-2xl py-12 px-10 border-4 border-blue-4 h-[250px]">
                                    <h4 className="font-bold text-blue-5 text-xl mb-4">{slide.name}</h4>
                                    <p className="font-light text-blue-5 text-sm text-center">{slide.contnet}</p>

                                    <Row className="absolute bottom-10">
                                        <StarIcon className="stroke-yellow-1 fill-yellow-1 w-8 h-8" />
                                        <StarIcon className="stroke-yellow-1 fill-yellow-1 w-8 h-8" />
                                        <StarIcon className="stroke-yellow-1 fill-yellow-1 w-8 h-8" />
                                        <StarIcon className="stroke-yellow-1 fill-yellow-1 w-8 h-8" />
                                        <StarIcon className="stroke-yellow-1 fill-yellow-1 w-8 h-8" />
                                    </Row>
                                </Col>
                            </SwiperSlide>
                        );
                    })
                }
            </Swiper>
        </Col>
    );
};