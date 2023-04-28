import Link from "next/link";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useAuthUser, withAuthUser } from "next-firebase-auth";

import { HomeHover, HomeDefault } from "../../svg/navbar/homeIcon";
import { TradeHover, TradeDefault } from "../../svg/navbar/tradeIcon";
import { PortfolioHover, PortfolioDefault } from "../../svg/navbar/portfolioIcon";
import { MarketHover, MarketDefault } from "../../svg/navbar/marketIcon";
import UserDefaultIcon from "../../svg/UserDefaultIcon";
import SettingsIcon from "../../svg/SettingsIcon";
import Button from "../../shared/buttons/button";
import { Col, Row } from "../../shared/layout/flex";
import HamburgerIcon from "../../svg/navbar/hamburger";
import { logoIcon } from "../../../../public/assets/images/svg";
import { useAuthModal } from "../../../context/authModal.context";

import NavLink from "./NavLink/NavLink";

const Nav = () => {
  const { id } = useAuthUser();
  const [collapse, setCollapse] = useState(false)
  const { modalTrigger, setVisibleSection } = useAuthModal();
  const { t } = useTranslation(['nav']);

  const userOptions = useCallback(
    () => {
      if (!!id) {
        return <div className="grid grid-flow-col gap-4 items-center">
          <NavLink
            href="/settings"
            NavIcon={
              SettingsIcon
            }
            className="hidden md:block"
          />
          <NavLink
            href="/home"
            NavIcon={
              UserDefaultIcon
            }
          />
        </div>
      }
      else {
        return <Row className="gap-4 items-center">
          <Button className="px-6 py-3 font-semi-bold"
            onClick={() => {
              setVisibleSection('login');
              modalTrigger.show();
            }}
          >
            {t('login')}
          </Button>
          <Button className="dark:bg-blue-3 px-6 py-3 dark:text-blue-1 text-sm rounded-md font-bold hidden md:block"
            onClick={() => {
              setVisibleSection('signup');
              modalTrigger.show();
            }}
          > {t('signup')}
          </Button>
        </Row>
      }
    },
    [modalTrigger, id, setVisibleSection, t],
  )

  const navLinks = (className: string) => {
    return <div className={className}>
      <NavLink
        active={true}
        href="/login"
        navTitle="portfolio"
        NavIcon={
          HomeDefault
        }
        Hover={HomeHover}
      />
      <NavLink
        href="/allocation"
        navTitle="smartAllocation"
        NavIcon={
          PortfolioDefault
        }
        Hover={PortfolioHover}
      />
      <NavLink
        href="/trade"
        navTitle="trade"
        NavIcon={
          TradeDefault
        }
        Hover={TradeHover}
      />
      <NavLink
        href="/market"
        navTitle="market"
        NavIcon={
          MarketDefault
        }
        Hover={MarketHover}
      />
    </div>
  }

  return (
    <Col className="w-full lg:px-6 dark:bg-black-2 fixed lg:relative rounded-b-lg">
      <Row className="container w-full h-[72px] justify-between pt-3 px-6 lg:p-0">
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
          {userOptions()}
          <Button onClick={() => (setCollapse(!collapse))} className="dark:bg-blue-3 dark:text-blue-1 p-4 rounded-md font-bold lg:hidden">
            <HamburgerIcon className="w-3.5 h-3" />
          </Button>
        </Row>
      </Row>
      {collapse &&
        <Col className="lg:hidden gap-6">
          {navLinks("flex flex-col h-full")}
          <div className="px-6 pb-8 w-full md:hidden">
            {!!id ?
              <NavLink
                href="/settings"
                NavIcon={
                  SettingsIcon
                }
                navTitle="settings"
                className="rounded-md dark:bg-grey-3 w-full justify-center"
              />
              :
              <Link href='/signup' className="dark:bg-blue-3 py-3 dark:text-blue-1 text-sm rounded-md font-bold w-full">{t('signup')}</Link>
            }
          </div>
        </Col>
      }
    </Col>
  );
};

export default withAuthUser({
})(Nav)
