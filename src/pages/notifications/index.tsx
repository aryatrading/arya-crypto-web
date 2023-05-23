import { withAuthUser } from "next-firebase-auth";
import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import moment from "moment";
import clsx from "clsx";

import Layout from "../../components/layout/layout";
import PageLoader from "../../components/shared/pageLoader/pageLoader";
import { Col, Row } from "../../components/shared/layout/flex";
import Button from "../../components/shared/buttons/button";
import { getNotifications } from "../../services/controllers/notifications";
import { useSelector } from "react-redux";
import { NotificationType } from "../../types/notifications";
import LoadingSpinner from "../../components/shared/loading-spinner/loading-spinner";
import { EmptyIcon } from "../../components/svg/emptyNotification";
import { notificationIcon, titleColor } from "../../utils/notifications";


const NotificationPage = () => {
    const { t } = useTranslation(['notification']);
    const [isLoading, setIsLoading] = useState(true);
    const { notifications } = useSelector(({ notifications }: any) => notifications);

    useEffect(() => {
        setIsLoading(true);
        getNotifications(0, 100, 'asc').then(() => {
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <Layout>
            <Col className="w-full gap-4 md:w-[55%] p-6 min-h-[300px] bg-black-1 lg:bg-black-2">
                <h3 className="font-bold text-white header-label mb-4 tracking-[2px]">{t('title')}</h3>

                {isLoading ?
                    <LoadingSpinner />
                    : notifications.length <= 0 ?
                        <Col className="items-center mt-14 gap-6">
                            <EmptyIcon />
                            <p className="font-bold text-lg text-grey-1">{t('emptyList')}</p>
                        </Col>
                        : notifications.map((notification: NotificationType, index: number, arr: NotificationType[]) => {
                            const isLastItem = index === arr.length - 1;
                            return (
                                <Col key={index}>
                                    <Row className={clsx({ "bg-grey-3 rounded-md": notification?.seen === false, "bg-transparent": notification?.seen }, "gap-6 px-4 py-2")}>
                                        <Col className="mt-2">
                                            {notificationIcon(notification.notification_type || '', notification.provider_id)}
                                        </Col>
                                        <Button className="mb-2 focus:outline-none focus:ring-0 focus:border-0 w-full" disabled>
                                            <Col className="gap-1">
                                                <Row className="justify-between items-center">
                                                    <p className={clsx(titleColor(notification.notification_type), "text-base font-medium")}>{notification.title}</p>
                                                    <p className="text-sm text-grey-1 font-medium">{moment(new Date(notification.created_time || '')).fromNow()}</p>
                                                </Row>
                                                <p className="text-sm text-white font-medium text-start">{notification.body}</p>
                                            </Col>
                                        </Button>
                                    </Row>

                                    {!isLastItem && <div className="w-full h-[1px] bg-grey-3 my-2" />}
                                </Col>
                            );
                        })}
            </Col>
        </Layout>
    );
};

export default withAuthUser({ LoaderComponent: PageLoader })(NotificationPage);

export const getStaticProps: GetStaticProps<any> = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale ?? "en")),
    },
});
