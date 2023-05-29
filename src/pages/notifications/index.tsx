import { withAuthUser } from "next-firebase-auth";
import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";

import Layout from "../../components/layout/layout";
import PageLoader from "../../components/shared/pageLoader/pageLoader";
import { Col } from "../../components/shared/layout/flex";
import { getNotifications } from "../../services/controllers/notifications";
import { useSelector } from "react-redux";
import { NotificationType } from "../../types/notifications";
import LoadingSpinner from "../../components/shared/loading-spinner/loading-spinner";
import { EmptyIcon } from "../../components/svg/emptyNotification";
import NotificationCard from "../../components/layout/Notifications/NotificationCard";


const NotificationPage = () => {
    const { t } = useTranslation(['notification']);
    const [isLoading, setIsLoading] = useState(false);
    const { notifications } = useSelector(({ notifications }: any) => notifications);

    useEffect(() => {
        // setIsLoading(true);
        // getNotifications(0, 100, 'asc').then(() => {
        //     setIsLoading(false);
        // }).catch(() => {
        //     setIsLoading(false);
        // });
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
                                <NotificationCard key={index} notification={notification} type="fullscreen" isLastItem={isLastItem} />
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
