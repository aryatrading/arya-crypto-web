import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ArrowLeftOnRectangleIcon,
  UserIcon,
  BellIcon,
  Cog6ToothIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/solid";
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
import {
  getNotifications,
  updateFCMToken,
  updateUnseenNotifications,
} from "../../../services/controllers/notifications";
import {
  setNotifications,
  updateNotificationBadge,
} from "../../../services/redux/notificationsSlice";

import NavLink from "./NavLink/NavLink";
import { EmptyIcon } from "../../svg/emptyNotification";
import NotificationCard from "../Notifications/NotificationCard";

const Nav = () => {
  const dispatch = useDispatch();
  const { id } = useAuthUser();
  const [collapse, setCollapse] = useState(false);
  const [isUserDropdownActive, setIsUserDropdownActive] = useState(false);
  const [isNotificationsActive, setIsNotificationsActive] = useState(false);
  const { modalTrigger, setVisibleSection } = useAuthModal();
  const {
    notifications: { notifications },
    hasNewNotifications,
  } = useSelector(({ notifications }: any) => notifications);
  const { t } = useTranslation([
    "nav",
    "coin",
    "asset",
    "common",
    "auth",
    "notification",
  ]);
  const { pathname, push, locale, asPath, query } = useRouter();
  const { isTabletOrMobileScreen } = useResponsive();
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme != null) {
      if (theme === "dark") {
        setCurrentTheme("dark");
        document.documentElement.classList.add("dark");
      } else {
        setCurrentTheme("light");
        document.documentElement.classList.remove("dark");
      }
    } else {
      localStorage.setItem("theme", "dark");
    }
  }, []);

  const onLogout = useCallback(() => {
    getAuth(getApp())
      .signOut()
      .then(() => {
        updateFCMToken("");
        localStorage.removeItem("idToken");
        localStorage.removeItem("fcm_token");
        push("/home");
        setCollapse(false);
      });
  }, [push]);

  const userOptions = useCallback(() => {
    if (!!id) {
      return (
        <div className="grid-flow-col gap-4 md:gap-6 items-center hidden md:flex">
          <DropdownMenu.Root
            modal={false}
            onOpenChange={(isOpened) => {
              if (isOpened) {
                setIsUserDropdownActive(true);
              } else {
                setIsUserDropdownActive(false);
              }
            }}
          >
            <DropdownMenu.Trigger asChild>
              <button className="focus:border-0 focus:ring-0 focus:outline-none">
                <UserIcon
                  className={clsx(
                    {
                      "fill-blue-1 stroke-blue-1": isUserDropdownActive,
                      "dark:fill-current dark:stroke-current fill-grey-1 stroke-grey-1": !isUserDropdownActive,
                    },
                    "w-6 h-6"
                  )}
                />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="w-[200px] dark:bg-black-2 bg-offWhite-2 mt-6 p-4 rounded-md shadow-md dark:shadow-black-1 shadow-grey-1/25 z-50"
                sideOffset={5}
                align="end"
              >
                <Link href="/settings">
                  <Row className="gap-4 items-center">
                    <Cog6ToothIcon className="dark:stroke-current stroke-grey-1 w-6 h-6" />
                    <p className="dark:text-white text-grey-1 font-medium text-base">
                      {t("common:settings")}
                    </p>
                  </Row>
                </Link>
                <DropdownMenu.Separator className="h-[1px] dark:bg-grey-7 bg-offWhite-3 m-3" />
                <DropdownMenu.Item
                  className="cursor-pointer hover:outline-none hover:border-0 hover:ring-0"
                  onClick={onLogout}
                >
                  <Row className="gap-4 items-center">
                    <ArrowLeftOnRectangleIcon className="dark:fill-current fill-grey-1 w-6 h-6" />
                    <p className="dark:text-white text-grey-1 font-medium text-base">
                      {t("auth:logout")}
                    </p>
                  </Row>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      );
    } else {
      return (
        <Row className="gap-4 items-center">
          <Button
            className="px-6 py-3 font-semibold dark:text-white text-black-1 hidden md:block"
            onClick={() => {
              if (isTabletOrMobileScreen) {
                push("/login");
              } else {
                setVisibleSection("login");
                modalTrigger.show();
              }
            }}
          >
            {t("common:login")}
          </Button>
          <Button
            className="dark:bg-blue-3 bg-blue-1 px-6 py-3 min-w-[100px] dark:text-blue-1 text-white text-sm rounded-md font-medium hidden md:block"
            onClick={() => {
              if (isTabletOrMobileScreen) {
                push("/signup");
              } else {
                setVisibleSection("signup");
                modalTrigger.show();
              }
            }}
          >
            {" "}
            {t("common:signup")}
          </Button>
        </Row>
      );
    }
  }, [
    id,
    isUserDropdownActive,
    t,
    onLogout,
    isTabletOrMobileScreen,
    push,
    setVisibleSection,
    modalTrigger,
  ]);

  const navLinks = (className: string) => {
    return (
      <div className={className}>
        {navLinkData.map((navLink) => (
          <NavLink
            key={navLink.title}
            active={pathname === navLink.route}
            href={navLink.route}
            navTitle={navLink.title}
            NavIcon={navLink.Icon}
            Hover={navLink.Hover}
            theme={currentTheme}
          />
        ))}
      </div>
    );
  };

  const changeLanguage = useCallback(
    (lang: "en" | "fr") => {
      push({ pathname, query }, asPath, { locale: lang });
      saveUserLanguage(lang);
      window.localStorage.setItem("language", lang);

      getNotifications(0, notifications.length, "desc");
    },
    [asPath, notifications.length, pathname, push, query]
  );

  const changeLanguageView = useCallback(
    (hide: boolean) => {
      if (locale == null || hide) {
        return;
      }
      if (locale === "en") {
        return (
          <Button
            onClick={() => {
              changeLanguage("fr");
            }}
            className="w-full h-full py-3"
          >
            <Row className="gap-4 items-center justify-center">
              <FRIcon />
              {isTabletOrMobileScreen && (
                <span className="text-sm font-bold">{t("common:french")}</span>
              )}
            </Row>
          </Button>
        );
      } else {
        return (
          <Button
            onClick={() => {
              changeLanguage("en");
            }}
            className="w-full h-full py-3"
          >
            <Row className="gap-4 items-center justify-center">
              <ENIcon />
              {isTabletOrMobileScreen && (
                <span className="text-sm font-bold">{t("common:english")}</span>
              )}
            </Row>
          </Button>
        );
      }
    },
    [locale, isTabletOrMobileScreen, t, changeLanguage]
  );

  const isNotificationActive = useMemo(
    () =>
      typeof window !== "undefined"
        ? window.location.pathname === "/notifications"
        : false,
    []
  );

  const notificationDropdown = useCallback(
    (hide: boolean) => {
      if (locale == null || hide || id == null) {
        return;
      }
      return (
        <Col className="grid grid-flow-col gap-4 md:gap-6 items-center">
          {isTabletOrMobileScreen ? (
            <button
              className="focus:outline-none focus:border-0 focus:ring-0 relative"
              aria-label="Customise options"
              onClick={() => push("/notifications")}
            >
              {hasNewNotifications && (
                <Col className="w-3 h-3 rounded-lg bg-red-1 absolute z-10 right-0" />
              )}
              <BellIcon
                className={clsx(
                  {
                    "fill-blue-1 stroke-blue-1": isNotificationActive,
                    "dark:fill-current dark:stroke-current fill-grey-1 stroke-grey-1": !isNotificationActive,
                  },
                  "w-6 h-6"
                )}
              />
            </button>
          ) : (
            <DropdownMenu.Root
              modal={false}
              onOpenChange={(isOpened) => {
                if (isOpened) {
                  setIsNotificationsActive(true);
                  dispatch(updateNotificationBadge(false));
                } else {
                  const updatedArr = [
                    ...notifications.map((notification: NotificationType) =>
                      notification.is_seen === "false"
                        ? { ...notification, is_seen: "true" }
                        : notification
                    ),
                  ];
                  dispatch(
                    setNotifications({
                      notifications: updatedArr,
                    })
                  );
                  setIsNotificationsActive(false);
                  updateUnseenNotifications(
                    notifications
                      .map((e: NotificationType) => (!e.is_seen ? e.id : null))
                      .filter((x: number) => x != null)
                  );
                }
              }}
            >
              <DropdownMenu.Trigger asChild>
                <button
                  className="focus:outline-none focus:border-0 focus:ring-0 relative"
                  aria-label="Customise options"
                >
                  {hasNewNotifications && (
                    <Col className="w-3 h-3 rounded-lg bg-red-1 absolute z-10 right-0" />
                  )}
                  <BellIcon
                    className={clsx(
                      {
                        "fill-blue-1 stroke-blue-1": isNotificationsActive,
                        "dark:fill-current dark:stroke-current fill-grey-1 stroke-grey-1": !isNotificationsActive,
                      },
                      "w-6 h-6"
                    )}
                  />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="w-full dark:bg-black-2 bg-offWhite-2 rounded-md p-6 md:w-[420px] shadow-md dark:shadow-black-1 shadow-grey-1/25 z-50"
                  sideOffset={25}
                >
                  <h3 className="font-bold dark:text-white text-black-1 header-label mb-4">
                    {t("notification:title")}
                  </h3>

                  {notifications.length <= 0 ? (
                    <Col className="items-center mt-14 gap-6">
                      <EmptyIcon />
                      <p className="font-bold text-lg text-grey-1">
                        {t("notification:emptyList")}
                      </p>
                    </Col>
                  ) : (
                    notifications
                      .slice(0, 5)
                      .map((notification: NotificationType) => {
                        return (
                          <NotificationCard
                            key={notification.id}
                            notification={notification}
                            type="dropdown"
                          />
                        );
                      })
                  )}

                  <Button
                    className="w-full h-[40px] dark:bg-grey-3 bg-offWhite-3 rounded-md mt-6"
                    onClick={() => push("/notifications")}
                  >
                    <h3 className="font-bold dark:text-white text-grey-1">
                      {t("notification:seeMore")}
                    </h3>
                  </Button>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
        </Col>
      );
    },
    [
      dispatch,
      hasNewNotifications,
      id,
      isNotificationActive,
      isNotificationsActive,
      isTabletOrMobileScreen,
      locale,
      notifications,
      push,
      t,
    ]
  );

  return (
    <Col className="w-full dark:bg-black-2 bg-white border-b dark:border-gray-800 shadow-md  fixed lg:relative z-40">
      <Row className="container w-full py-3 justify-between">
        <Row className="xl:gap-16 md:gap-10 items-center">
          <Link href={"/home"}>
            <Image src={logoIcon} alt="Arya Logo" />
          </Link>
          {navLinks("gap-6 h-full hidden lg:flex")}
        </Row>
        <Row className="gap-3 justify-center items-center">
          <button onClick={() => {
            if (document.documentElement.classList.contains('dark')) {
              document.documentElement.classList.remove('dark');
              setCurrentTheme("light")
              localStorage.setItem("theme", "light");
            } else {
              document.documentElement.classList.add('dark');
              setCurrentTheme("dark")
              localStorage.setItem("theme", "dark");
            }
          }} className="me-2 md:flex hidden">
            {
              currentTheme === "light" ?
                <MoonIcon className="w-6 h-6  fill-grey-1" />
                :
                <SunIcon className="w-8 h-8  fill-white" />
            }
          </button>
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
          <Button
            onClick={() => setCollapse(!collapse)}
            className="text-blue-1 p-4 rounded-md font-bold lg:hidden"
          >
            <HamburgerIcon
              className={clsx({"stroke-blue-1": collapse}, "w-5.5 h-4 dark:stroke-white stroke-grey-1")}
            />
          </Button>
        </Row>
      </Row>
      {collapse && (
        <Col className="lg:hidden gap-6">
          {navLinks("flex flex-col h-full")}
          <Col className="px-6 pb-8 w-full md:hidden">
            {!!id ? (
              <Col className="gap-4">
                <Button
                  className="rounded-md dark:bg-grey-3 bg-offWhite-3 w-full justify-center py-3 px-6"
                  onClick={onLogout}
                >
                  <h3 className="dark:text-white text-grey-1 font-medium">{t("auth:logout")}</h3>
                </Button>
                  <NavLink
                    href="/settings"
                    NavIcon={Cog6ToothIcon}
                    navTitle="settings"
                    className="rounded-md dark:bg-grey-3 bg-offWhite-3 dark:text-white text-grey-1 justify-center flex-1"
                  />
                <Row className="gap-4 items-center justify-center">
                  <Col className="dark:bg-grey-3 bg-offWhite-3 dark:text-white text-grey-1 text-sm rounded-md font-medium items-center flex-1 px-6">
                    {changeLanguageView(!isTabletOrMobileScreen)}
                  </Col>
                    <button onClick={() => {
                      if (document.documentElement.classList.contains('dark')) {
                        document.documentElement.classList.remove('dark');
                        setCurrentTheme("light")
                        localStorage.setItem("theme", "light");
                      } else {
                        document.documentElement.classList.add('dark');
                        setCurrentTheme("dark")
                        localStorage.setItem("theme", "dark");
                      }
                  }} className="dark:bg-grey-3 bg-offWhite-3 dark:text-white text-grey-1 text-sm rounded-md font-medium items-center justify-center flex-1 px-6 md:hidden flex h-[39px]">
                      {
                        currentTheme === "light" ?
                        <Row className="gap-2 items-center">
                          <MoonIcon className="w-6 h-6  fill-grey-1" />
                          <p className="text-sm font-bold">{t("common:dark")}</p>
                        </Row>
                          :
                        <Row className="gap-2 items-center">
                          <SunIcon className="w-6 h-6  fill-white" />
                          <p className="text-sm font-bold">{t("common:light")}</p>
                        </Row>
                      }
                    </button>
                </Row>
              </Col>
            ) : (
              <Col className="gap-4">
                <Link
                  href="/signup"
                  className="bg-blue-1 py-3 text-white text-sm rounded-md font-medium w-full text-center"
                >
                  {t("common:signup")}
                </Link>
                <Link
                  href="/login"
                  className="dark:bg-grey-3 bg-offWhite-3 py-3 dark:text-white text-grey-1 text-sm rounded-md font-medium w-full text-center"
                >
                  {t("common:login")}
                </Link>
                <Col className="dark:bg-grey-3 bg-offWhite-3 dark:text-white text-grey-1 text-sm rounded-md font-medium w-full items-center">
                  {changeLanguageView(!isTabletOrMobileScreen)}
                </Col>
              </Col>
            )}
          </Col>
        </Col>
      )}
    </Col>
  );
};

export default withAuthUser({})(Nav);
