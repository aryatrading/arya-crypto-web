import Link from "next/link";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";

import UserDefaultIcon from "../../svg/UserDefaultIcon";
import SettingsIcon from "../../svg/SettingsIcon";
import Button from "../../shared/buttons/button";
import { Col, Row } from "../../shared/layout/flex";
import HamburgerIcon from "../../svg/navbar/hamburger";
import { logoIcon } from "../../../../public/assets/images/svg";
import { useAuthModal } from "../../../context/authModal.context";
import { navLinkData } from "../../../utils/constants/nav";

import NavLink from "./NavLink/NavLink";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { AssetDropdown } from "../../shared/assetDropdown";
import { useDispatch } from "react-redux";
import { setAsset } from "../../../services/redux/assetSlice";
import { CapitalizeString } from "../../../utils/format_string";

const Nav = () => {
  const dispatch = useDispatch();
  const { id } = useAuthUser();
  const [collapse, setCollapse] = useState(false)
  const { modalTrigger, setVisibleSection } = useAuthModal();
  const { t } = useTranslation(['nav']);
  const { pathname, push } = useRouter()

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
          <Button className="px-6 py-3 font-semi-medium text-white"
            onClick={() => {
              setVisibleSection('login');
              modalTrigger.show();
            }}
          >
            {t('login')}
          </Button>
          <Button className="bg-blue-3 px-6 py-3 text-blue-1 text-sm rounded-md font-medium hidden md:block"
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
      {
        navLinkData.map((navLink) => <NavLink
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

  return (
    <Col className="w-full bg-black-2 fixed lg:relative rounded-b-lg">
      <Row className="container w-full h-[72px] justify-between">
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
          <AssetDropdown
            onClick={(asset) => {
              console.log({ asset });
              const data = {
                iconUrl: asset.iconUrl,
                id: asset.id,
                rank: asset.rank,
                currentPrice: asset.currentPrice,
                symbol: asset.symbol.toLowerCase(),
                pnl: asset.pnl,
                mrkCap: asset.mrkCap,
                volume: asset.volume,
                name: CapitalizeString(asset.name),
              };
              dispatch(setAsset(data));
              push(`/asset?symbol=${asset.symbol}`);
            }}
            t={t}
            trigger={
              <button aria-label="Customise options" className="active:outline-none">
                <Row className="bg-grey-3 w-full h-[40px] rounded-sm px-4">
                  <MagnifyingGlassIcon width="20px" color="#6B7280" />
                  <input id="assets search" className="font-bold text-sm text-white bg-transparent flex-1 pl-2 focus:outline-none border-transparent" type="text" placeholder={t('searchAsset').toString()} disabled />
                </Row>
              </button>
            }
            showContentHeaderLabel={false}
            showTopCoinsList
            side="center"
            sideOffset={-100}
          />
          {userOptions()}
          <Button onClick={() => (setCollapse(!collapse))} className="bg-blue-3 text-blue-1 p-4 rounded-md font-bold lg:hidden">
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
                className="rounded-md bg-grey-3 w-full justify-center"
              />
              :
              <Link href='/signup' className="bg-blue-3 py-3 text-blue-1 text-sm rounded-md font-medium w-full">{t('signup')}</Link>
            }
          </div>
        </Col>
      }
    </Col>
  );
};

export default withAuthUser({
})(Nav)
