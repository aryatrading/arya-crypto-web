import { withAuthUser } from "next-firebase-auth";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";

import Layout from "../../components/layout/layout";
import PageLoader from "../../components/shared/pageLoader/pageLoader";
import { Col } from "../../components/shared/layout/flex";
import { getNotifications, updateUnseenNotifications } from "../../services/controllers/notifications";
import { useSelector } from "react-redux";
import { NotificationType } from "../../types/notifications";
import LoadingSpinner from "../../components/shared/loading-spinner/loading-spinner";
import { EmptyIcon } from "../../components/svg/emptyNotification";
import NotificationCard from "../../components/layout/Notifications/NotificationCard";


const NotificationPage = () => {
    const { t } = useTranslation(['notification']);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [canLoadMore, setCanLoadMore] = useState(true);
    const { notifications: { notifications } } = useSelector(({ notifications }: any) => notifications);
    const observer = useRef<any>();

    useEffect(() => {
        return () => { updateUnseenNotifications(notifications.map((e: NotificationType) => !e.is_seen ? e.id : null).filter((x: number) => x != null)) };
    }, [notifications]);

    const loadMore = useCallback(
        async () => {
            if (!isLoadingMore && canLoadMore) {
                setIsLoadingMore(true);
                getNotifications(notifications.length, notifications.length + 10, 'desc', setCanLoadMore).finally(() => {
                    setIsLoadingMore(false);
                });
            }
        }
        ,
        [canLoadMore, isLoadingMore, notifications.length],
    )

    const lastMessageElementRef = useCallback(
        (node: any) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && canLoadMore) {
                    loadMore();
                }
            });
            if (node) observer.current.observe(node);
        }, [canLoadMore, loadMore]
    )

    return (
        <Layout>
            <Col className="w-full gap-4 md:w-[55%] p-2 min-h-[300px] bg-black-1 lg:bg-black-2 md:p-6">
                <h3 className="font-bold text-white header-label mb-4 tracking-[2px]">{t('title')}</h3>

                {notifications.length <= 0 ?
                    <LoadingSpinner />
                    : notifications.length <= 0 ?
                        <Col className="items-center mt-14 gap-6">
                            <EmptyIcon />
                            <p className="font-bold text-lg text-grey-1">{t('emptyList')}</p>
                        </Col>
                        : <Col>
                            {notifications.map((notification: NotificationType, index: number, arr: NotificationType[]) => {
                                const isLastItem = index === arr.length - 1;
                                return (
                                    <span ref={isLastItem ? lastMessageElementRef : null} key={index}>
                                        <NotificationCard notification={notification} type="fullscreen" isLastItem={isLastItem} />
                                    </span>
                                );
                            })}

                            {isLoadingMore && <Col className="mt-10">
                                <LoadingSpinner />
                            </Col>}
                        </Col>}
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
