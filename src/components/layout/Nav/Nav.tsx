import Link from "next/link";
import React, { useCallback, useState } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import { screens } from "tailwindcss/defaultTheme";
import { useMediaQuery } from 'react-responsive';
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";

import UserDefaultIcon from "../../svg/UserDefaultIcon";
import SettingsIcon from "../../svg/SettingsIcon";
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

import NavLink from "./NavLink/NavLink";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";

const Nav = () => {
  const { id } = useAuthUser();
  const [collapse, setCollapse] = useState(false)
  const { modalTrigger, setVisibleSection } = useAuthModal();
  const { t } = useTranslation(['nav', 'coin', 'asset', 'common', 'auth']);
  const { pathname, push, locale, asPath, query } = useRouter()
  const isMD = useMediaQuery({ query: `(max-width: ${screens.md})` });

  const onLogout = useCallback(() => {
    getAuth(getApp()).signOut().then(() => {
      localStorage.removeItem('idToken');
      push('/home');
      setCollapse(false);
    });
  }, [push]);

  const userOptions = useCallback(
    () => {
      if (!!id) {
        return <div className="grid grid-flow-col gap-4 md:gap-6 items-center">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="IconButton" aria-label="Customise options">
                <UserDefaultIcon width={24} height={24} />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="z-50 bg-grey-6 p-4 rounded-md w-[200px] mt-6" sideOffset={5} align="end">
                <Link href="/settings">
                  <Row className="gap-4 items-center">
                    <SettingsIcon width={20} height={20} />
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
              setVisibleSection('login');
              modalTrigger.show();
            }}
          >
            {t('common:login')}
          </Button>
          <Button className="bg-blue-3 px-6 py-3 min-w-[100px] text-blue-1 text-sm rounded-md font-medium hidden md:block"
            onClick={() => {
              setVisibleSection('signup');
              modalTrigger.show();
            }}
          > {t('common:signup')}
          </Button>
        </Row>
      }
    },
    [id, t, onLogout, setVisibleSection, modalTrigger],
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

  const changeLanguageView = useCallback((hide: boolean) => {
    if (locale == null || hide) {
      return;
    }
    if (locale === 'en') {
      return (
        <Button onClick={() => {
          push({ pathname, query }, asPath, { locale: 'fr' })
        }} className="w-full h-full py-3">
          <Row className="gap-4 items-center justify-center">
            <FRIcon />
            {isMD && <span className="text-sm font-bold">{t('common:french')}</span>}
          </Row>
        </Button>
      )
    } else {
      return <Button onClick={() => {
        push({ pathname, query }, asPath, { locale: 'en' })
      }} className="w-full h-full py-3">
        <Row className="gap-4 items-center justify-center">
          <ENIcon />
          {isMD && <span className="text-sm font-bold">{t('common:english')}</span>}
        </Row>
      </Button>
    }
  }, [asPath, locale, pathname, push, query, t, isMD]);

  return (
    <Col className="w-full bg-black-2 border-b border-gray-800 shadow-md  fixed lg:relative z-20">
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
            {changeLanguageView(isMD)}
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
          <Button onClick={() => (setCollapse(!collapse))} className="text-blue-1 p-4 rounded-md font-bold lg:hidden">
            <HamburgerIcon className="w-5.5 h-4" />
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
                  <Col className="bg-grey-3 text-white text-sm rounded-md font-medium items-center flex-1 px-6">{changeLanguageView(!isMD)}</Col>

                  <NavLink
                    href="/settings"
                    NavIcon={
                      SettingsIcon
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
                <Col className="bg-grey-3 text-white text-sm rounded-md font-medium w-full items-center">{changeLanguageView(!isMD)}</Col>
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
