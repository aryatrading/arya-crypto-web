import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import moment from "moment";

import { Col, Row } from "../../shared/layout/flex";
import { notificationIcon, titleColor } from "../../../utils/notifications";
import Button from "../../shared/buttons/button";

function NotificationCard({ notification, type, isLastItem }: any) {
    if (type === 'dropdown') {
        return (
            <Col key={notification.id}>
                <DropdownMenu.Item className="mb-4 focus:outline-none focus:ring-0 focus:border-0" disabled>
                    <Row className="gap-4 items-center">
                        {notificationIcon(notification.notification_type || '', notification.provider_id)}
                        <Col className="gap-2 w-full overflow-hidden">
                            <Row className="justify-between">
                                <p className={clsx(titleColor(notification.notification_type), "text-sm font-medium")}>{notification.title}</p>
                                <p className="text-sm text-grey-1 font-medium">{moment(new Date(notification.created_time || '')).fromNow()}</p>
                            </Row>
                            <p className="text-sm dark:text-white text-black-1 font-medium max-w-full">{notification.body}</p>
                        </Col>
                    </Row>
                    {notification.is_seen === 'false' && <Col className="w-3 h-3 rounded-lg bg-red-1 absolute z-10 right-8" />}
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="w-full h-[1px] dark:bg-grey-3 bg-offWhite-3 my-4" />
            </Col>
        );
    }
    return (
        <Col key={notification.id}>
            <Row className={clsx({ "bg-grey-3 rounded-md": notification?.is_seen === 'false', "bg-transparent": notification?.is_seen === 'true' }, "gap-6 px-4 py-2")}>
                <Col className="mt-2">
                    {notificationIcon(notification.notification_type || '', notification.provider_id)}
                </Col>
                <Button className="mb-2 focus:outline-none focus:ring-0 focus:border-0 w-full" disabled>
                    <Col className="gap-2 md:gap-1">
                        <Row className="justify-between">
                            <p className={clsx(titleColor(notification.notification_type), "text-base font-medium text-left")}>{notification.title}</p>
                            <p className="text-sm text-grey-1 font-medium min-w-[80px]">{moment(new Date(notification.created_time || '')).fromNow()}</p>
                        </Row>
                        <p className="text-sm text-white font-medium text-start">{notification.body}</p>
                    </Col>
                </Button>
            </Row>

            {!isLastItem && <div className="w-full h-[1px] bg-grey-3 my-2" />}
        </Col>
    );
}

export default NotificationCard;