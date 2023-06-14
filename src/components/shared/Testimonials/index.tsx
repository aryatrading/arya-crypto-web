import { StarIcon } from "@heroicons/react/24/solid";
import { Autoplay, Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "next-i18next";

import "swiper/css";
import "swiper/css/pagination";

import { Col, Row } from "../layout/flex";
import { useResponsive } from "../../../context/responsive.context";
import { testimonialsList } from "../../../utils/constants/salesPages";

import styles from './index.module.scss';


export const Testimonials = () => {
    const { t } = useTranslation(["pricing-plans"]);
    const { isTabletOrMobileScreen, isMobileOnly } = useResponsive();

    return (
        <Col className="my-10 gap-10 max-w-full px-10 lg:px-20 xl:px-80">
            <h2 className="font-bold text-white text-3xl md:text-5xl leading-snug text-center">{t('testimonials')}</h2>
            <Swiper
                slidesPerView={isMobileOnly ? 1 : isTabletOrMobileScreen ? 2 : 3}
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
                    testimonialsList.map((slide) => {
                        return (
                            <SwiperSlide key={slide.name}>
                                <Col className="items-center bg-offWhite-1 rounded-2xl py-12 px-10 border-4 border-blue-4 min-h-[250px]">
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