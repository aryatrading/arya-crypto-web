import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ArrowLeftOnRectangleIcon, UserIcon, BellIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";
import clsx from "clsx";

import Button from "../../shared/buttons/button";
import { Col, Row } from "../../shared/layout/flex";
import HamburgerIcon from "../../svg/navbar/hamburger";
import { logoIcon } from "../../../../public/assets/images/svg";
import { useAuthModal } from "../../../context/authModal.context";
import { navLinkData } from "../../../utils/constants/nav";
import { FRIcon } from "../../svg/FRIcon";
import { ENIcon } from "../../svg/ENIcon";
import AssetSelector from "../../shared/AssetSelector/AssetSelector";
import { SearchIcon } from "../../svg/searchIcon";
import { SearchAssetInput } from "../../shared/assetSearchInputWithDropdown";
import { useResponsive } from "../../../context/responsive.context";
import { saveUserLanguage } from "../../../services/controllers/utils";
import { NotificationType } from "../../../types/notifications";
import { getNotifications, updateFCMToken, updateUnseenNotifications } from "../../../services/controllers/notifications";
import { setNotifications, updateNotificationBadge } from "../../../services/redux/notificationsSlice";

import NavLink from "./NavLink/NavLink";
import { EmptyIcon } from "../../svg/emptyNotification";
import NotificationCard from "../Notifications/NotificationCard";

const Nav = () => {
  const dispatch = useDispatch();
  const { id } = useAuthUser();
  const [collapse, setCollapse] = useState(false)
  const [isUserDropdownActive, setIsUserDropdownActive] = useState(false)
  const [isNotificationsActive, setIsNotificationsActive] = useState(false)
  const { modalTrigger, setVisibleSection } = useAuthModal();
  const { notifications, hasNewNotifications } = useSelector(({ notifications }: any) => notifications);
  const { t } = useTranslation(['nav', 'coin', 'asset', 'common', 'auth', 'notification']);
  const { pathname, push, locale, asPath, query } = useRouter()
  const { isTabletOrMobileScreen } = useResponsive();

  const onLogout = useCallback(() => {
    getAuth(getApp()).signOut().then(() => {
      updateFCMToken('');
      localStorage.removeItem('idToken');
      localStorage.removeItem('fcm_token');
      push('/home');
      setCollapse(false);
    });
  }, [push]);

  const userOptions = useCallback(
    () => {
      if (!!id) {
        return <div className="grid-flow-col gap-4 md:gap-6 items-center hidden md:flex">
          <DropdownMenu.Root modal={false} onOpenChange={(isOpened) => {
            if (isOpened) {
              setIsUserDropdownActive(true);
            } else {
              setIsUserDropdownActive(false);
            }
          }}>
            <DropdownMenu.Trigger asChild>
              <button className="focus:border-0 focus:ring-0 focus:outline-none">
                <UserIcon className={clsx({ "fill-blue-1 stroke-blue-1": isUserDropdownActive, "fill-current stroke-current": !isUserDropdownActive }, "w-6 h-6")} />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="z-50 bg-grey-6 p-4 rounded-md w-[200px] mt-6" sideOffset={5} align="end">
                <Link href="/settings">
                  <Row className="gap-4 items-center">
                    <Cog6ToothIcon className="stroke-current w-6 h-6" />
                    <p className="text-white font-medium text-base">{t('common:settings')}</p>
                  </Row>
                </Link>
                <DropdownMenu.Separator className="h-[1px] bg-grey-7 m-3" />
                <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:border-0 hover:ring-0" onClick={onLogout}>
                  <Row className="gap-4 items-center">
                    <ArrowLeftOnRectangleIcon width={20} height={20} />
                    <p className="text-white font-medium text-base">{t('auth:logout')}</p>
                  </Row>
                </DropdownMenu.Item>

              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      }
      else {
        return <Row className="gap-4 items-center">
          <Button className="px-6 py-3 font-semibold text-white hidden md:block"
            onClick={() => {
              if (isTabletOrMobileScreen) {
                push('/login')
              } else {
                setVisibleSection('login');
                modalTrigger.show();
              }
            }}
          >
            {t('common:login')}
          </Button>
          <Button className="bg-blue-3 px-6 py-3 min-w-[100px] text-blue-1 text-sm rounded-md font-medium hidden md:block"
            onClick={() => {
              if (isTabletOrMobileScreen) {
                push('/signup')
              } else {
                setVisibleSection('signup');
                modalTrigger.show();
              }
            }}
          > {t('common:signup')}
          </Button>
        </Row>
      }
    },
    [id, isUserDropdownActive, t, onLogout, isTabletOrMobileScreen, push, setVisibleSection, modalTrigger],
  )

  const navLinks = (className: string) => {
    return <div className={className}>
      {
        navLinkData.map((navLink) => <NavLink
          key={navLink.title}
          active={pathname === navLink.route}
          href={navLink.route}
          navTitle={navLink.title}
          NavIcon={
            navLink.Icon
          }
          Hover={navLink.Hover}
        />)
      }
    </div>
  }

  const changeLanguage = useCallback((lang: 'en' | 'fr') => {
    push({ pathname, query }, asPath, { locale: lang })
    saveUserLanguage(lang);
    window.localStorage.setItem('language', lang);

    getNotifications(0, notifications.length, 'desc');
  }, [asPath, notifications.length, pathname, push, query])

  const changeLanguageView = useCallback((hide: boolean) => {
    if (locale == null || hide) {
      return;
    }
    if (locale === 'en') {
      return (
        <Button onClick={() => {
          changeLanguage('fr')
        }} className="w-full h-full py-3">
          <Row className="gap-4 items-center justify-center">
            <FRIcon />
            {isTabletOrMobileScreen && <span className="text-sm font-bold">{t('common:french')}</span>}
          </Row>
        </Button>
      )
    } else {
      return <Button onClick={() => {
        changeLanguage('en')
      }} className="w-full h-full py-3">
        <Row className="gap-4 items-center justify-center">
          <ENIcon />
          {isTabletOrMobileScreen && <span className="text-sm font-bold">{t('common:english')}</span>}
        </Row>
      </Button>
    }
  }, [locale, isTabletOrMobileScreen, t, changeLanguage]);

  const isNotificationActive = useMemo(() => typeof window !== 'undefined' ? window.location.pathname === '/notifications' : false, []);

  const notificationDropdown = useCallback((hide: boolean) => {
    if (locale == null || hide || id == null) {
      return;
    }
    return (
      <Col className="grid grid-flow-col gap-4 md:gap-6 items-center">
        {isTabletOrMobileScreen ?
          <button className="focus:outline-none focus:border-0 focus:ring-0 relative" aria-label="Customise options" onClick={() => push('/notifications')}>
            {hasNewNotifications && <Col className="w-3 h-3 rounded-lg bg-red-1 absolute z-10 right-0" />}
            <BellIcon className={clsx({ "fill-blue-1 stroke-blue-1": isNotificationActive, "fill-current stroke-current": !isNotificationActive }, "w-6 h-6")} />
          </button>
          :
          <DropdownMenu.Root modal={false} onOpenChange={(isOpened) => {
            if (isOpened) {
              setIsNotificationsActive(true);
              dispatch(updateNotificationBadge(false));
            } else {
              const updatedArr = [...notifications.map((notification: NotificationType) => notification.is_seen === 'false' ? ({ ...notification, is_seen: 'true' }) : notification)];
              dispatch(setNotifications({
                notifications: updatedArr,
              }));
              setIsNotificationsActive(false);
              updateUnseenNotifications(notifications.map((e: NotificationType) => !e.is_seen ? e.id : null).filter((x: number) => x != null));
            }
          }}>
            <DropdownMenu.Trigger asChild>
              <button className="focus:outline-none focus:border-0 focus:ring-0 relative" aria-label="Customise options">
                {hasNewNotifications && <Col className="w-3 h-3 rounded-lg bg-red-1 absolute z-10 right-0" />}
                <BellIcon className={clsx({ "fill-blue-1 stroke-blue-1": isNotificationsActive, "fill-current stroke-current": !isNotificationsActive }, "w-6 h-6")} />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="w-full bg-black-2 rounded-md p-6 md:w-[420px] shadow-md shadow-black-1 z-50" sideOffset={25}>
                <h3 className="font-bold text-white header-label mb-4">{t('notification:title')}</h3>

                {notifications.length <= 0 ?
                  <Col className="items-center mt-14 gap-6">
                    <EmptyIcon />
                    <p className="font-bold text-lg text-grey-1">{t('notification:emptyList')}</p>
                  </Col>
                  :
                  notifications.slice(0, 5).map((notification: NotificationType) => {
                    return (
                      <NotificationCard key={notification.id} notification={notification} type="dropdown" />
                    );
                  })
                }

                <Button className="w-full h-[40px] bg-grey-3 rounded-md mt-6" onClick={() => push('/notifications')}>
                  <h3 className="font-bold text-white">{t('notification:seeMore')}</h3>
                </Button>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        }
      </Col>
    );
  }, [dispatch, hasNewNotifications, id, isNotificationActive, isNotificationsActive, isTabletOrMobileScreen, locale, notifications, push, t]);

  return (
    <Col className="w-full bg-black-2 border-b border-gray-800 shadow-md  fixed lg:relative z-40">
      <Row className="container w-full py-3 justify-between">
        <Row className="xl:gap-20 md:gap-16 items-center">
          <Link href={"/home"}>
            <Image
              src={logoIcon}
              alt='Arya Logo'
            />
          </Link>
          {navLinks("gap-10 h-full hidden lg:flex")}
        </Row>
        <Row className="gap-3 justify-center items-center">
          <SearchAssetInput t={t} />
          <Row className="gap-5">
            {changeLanguageView(isTabletOrMobileScreen)}
            {notificationDropdown(isTabletOrMobileScreen)}
            {userOptions()}
          </Row>
          <AssetSelector
            trigger={
              <Button className="md:hidden">
                <SearchIcon />
              </Button>
            }
            showDialogTitle={false}
            dismissOnClick
            onClick={({ symbol }) => {
              push(`/asset?symbol=${symbol?.toLowerCase()}`);
            }}
            fullModal
          />
          {notificationDropdown(!isTabletOrMobileScreen)}
          <Button onClick={() => (setCollapse(!collapse))} className="text-blue-1 p-4 rounded-md font-bold lg:hidden">
            <HamburgerIcon className="w-5.5 h-4" color={collapse ? "#558AF2" : "white"} />
          </Button>
        </Row>
      </Row>
      {collapse &&
        <Col className="lg:hidden gap-6">
          {navLinks("flex flex-col h-full")}
          <Col className="px-6 pb-8 w-full md:hidden">
            {!!id ?
              <Col className="gap-4">
                <Button className="rounded-md bg-grey-3 w-full justify-center py-3 px-6" onClick={onLogout}>
                  <h3 className="text-white font-medium">{t('auth:logout')}</h3>
                </Button>
                <Row className="gap-4 items-center justify-center">
                  <Col className="bg-grey-3 text-white text-sm rounded-md font-medium items-center flex-1 px-6">{changeLanguageView(!isTabletOrMobileScreen)}</Col>

                  <NavLink
                    href="/settings"
                    NavIcon={
                      Cog6ToothIcon
                    }
                    navTitle="settings"
                    className="rounded-md bg-grey-3 justify-center flex-1"
                  />
                </Row>
              </Col>
              :
              <Col className="gap-4">
                <Link href='/signup' className="bg-blue-1 py-3 text-white text-sm rounded-md font-medium w-full text-center">{t('common:signup')}</Link>
                <Link href='/login' className="bg-grey-3 py-3 text-white text-sm rounded-md font-medium w-full text-center">{t('common:login')}</Link>
                <Col className="bg-grey-3 text-white text-sm rounded-md font-medium w-full items-center">{changeLanguageView(!isTabletOrMobileScreen)}</Col>
              </Col>
            }
          </Col>
        </Col>
      }
    </Col>
  );
};

export default withAuthUser({
})(Nav)
