import { FC, useEffect, useMemo, useState } from "react";
import { AssetType } from "../../../types/asset";
import { Col, Row } from "../layout/flex";
import { useSelector } from "react-redux";
import { selectAssetLivePrice } from "../../../services/redux/marketSlice";
import { StarIcon } from "@heroicons/react/24/outline";
import { FAVORITES_LIST } from "../../../utils/constants/config";
import React from "react";
import { useTranslation } from "next-i18next";
import AssetPnl from "../containers/asset/assetPnl";
import { useRouter } from "next/navigation";
import { formatNumber } from "../../../utils/helpers/prices";
import AssetRow from "../AssetRow/AssetRow";
import styles from "./assetsTable.module.scss";
import { useMediaQuery } from "react-responsive";
import { useAuthUser } from "next-firebase-auth";
import {
  addAssetToWatchlist,
  removeAssetFromWatchlist,
} from "../../../services/controllers/market";

type AssetsTableProps = {
  assets: AssetType[];
};

export const AssetsTable: FC<AssetsTableProps> = ({ assets }) => {
  const router = useRouter();
  const { t } = useTranslation(["market"]);
  const _assetprice = useSelector(selectAssetLivePrice);
  const authUser = useAuthUser();
  const isTabletOrMobileScreen = useMediaQuery({
    query: `(max-width:950px)`,
  });

  const isMobileScreen = useMediaQuery({
    query: `(max-width:600px)`,
  });

  let [header, setheader] = useState([
    t("rank") ?? "",
    t("name") ?? "",
    t("pnl") ?? "",
    t("currentprice") ?? "",
    // t("priceinbtc") ?? "",
    t("marketcap") ?? "",
    t("volume") ?? "",
    "",
  ]);

  useEffect(() => {
    if (isTabletOrMobileScreen) {
      setheader([
        t("rank") ?? "",
        t("name") ?? "",
        t("pnl") ?? "",
        t("currentprice") ?? "",
        "",
      ]);
    } else if (isMobileScreen) {
      setheader([t("rank") ?? "", t("name") ?? "", t("currentprice") ?? ""]);
    } else {
      setheader([
        t("rank") ?? "",
        t("name") ?? "",
        t("pnl") ?? "",
        t("currentprice") ?? "",
        // t("priceinbtc") ?? "",
        t("marketcap") ?? "",
        t("volume") ?? "",
        "",
      ]);
    }
  }, [isTabletOrMobileScreen, isMobileScreen, t]);

  const renderFavoritesSvg = (asset: AssetType) => {
    let _list = localStorage.getItem(FAVORITES_LIST);

    let _parsed = JSON.parse(_list ?? "");

    if (_parsed?.includes(asset.id ?? ""))
      return `w-4 h-4 fill-yellow-1 stroke-0`;
    else return `w-4 h-4 stroke-1`;
  };

  const handleFavoritesToggle = async (asset: AssetType) => {
    // Check if a favorites list is found in local storage
    const favoritesList = localStorage.getItem(FAVORITES_LIST);

    if (!favoritesList) {
      return;
    }

    let _list = JSON.parse(favoritesList);

    if (_list.includes(asset.id)) {
      // TRIGGER THE BACKEND IF USER IS LOGGED IN
      if (authUser.email) {
        await removeAssetFromWatchlist(asset.id ?? 1);
      }
      return localStorage.setItem(
        FAVORITES_LIST,
        JSON.stringify(_list.filter((elm: number) => elm !== asset.id))
      );
    } else {
      // ADD THE ASSET TO THE FAVORITES LIST
      _list.push(asset.id);

      // TRIGGER THE BACKEND IF USER IS LOGGED IN
      if (authUser.email) {
        await addAssetToWatchlist(asset.id ?? 1);
      }

      return localStorage.setItem(FAVORITES_LIST, JSON.stringify(_list));
    }
  };

  return (
    <Col className="flex items-center justify-center flex-1 gap-10 w-full">
      <table className={styles.table}>
        <thead>
          <tr>
            {header.map((elm, index) => {
              return (
                <th
                  key={index}
                  scope="col"
                  className={index > 1 ? "text-right" : "text-left"}
                >
                  {elm}
                </th>
              );
            })}
          </tr>
        </thead>
        {assets.length ? (
          <tbody>
            {assets.map((elm, index) => {
              return (
                <tr
                  key={index}
                  className="hover:bg-black-2/25 hover:bg-grey-4 cursor-pointer"
                  onClick={() => router.push(`/asset?s=${elm.symbol}`)}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-bold leading-6 text-white"
                  >
                    {elm.rank}
                  </th>
                  <td>
                    <AssetRow
                      icon={elm.iconUrl ?? ""}
                      name={elm.name ?? ""}
                      symbol={elm.symbol ?? ""}
                      className={`font-medium ${index === 0 ? "pt-2" : "pt-0"}`}
                      showIcon
                    />
                  </td>
                  <td className="text-right">
                    <Row className="justify-end">
                      <AssetPnl
                        value={elm.pnl}
                        className={
                          elm.pnl <= 0
                            ? "bg-red-2 text-red-1 px-2"
                            : "bg-green-2 text-green-1 px-2"
                        }
                      />
                    </Row>
                  </td>
                  {!isTabletOrMobileScreen && !isMobileScreen ? (
                    <td className="leading-6 text-white text-right font-semibold">
                      {formatNumber(
                        _assetprice[elm.symbol ?? ""] ?? elm.currentPrice,
                        true
                      )}
                    </td>
                  ) : null}

                  {!isTabletOrMobileScreen ? (
                    <>
                      {/* <td className="font-medium leading-6 text-white text-right">
                        {elm.currentPrice ?? 0 / _assetprice["btc"]}
                      </td> */}
                      <td className="font-medium leading-6 text-white text-right">
                        {formatNumber(elm.mrkCap ?? 0, true)}
                      </td>
                      <td className="font-medium leading-6 text-white text-right">
                        {formatNumber(elm.volume ?? 0, true)}
                      </td>
                    </>
                  ) : null}

                  <td
                    className="font-medium  text-white text-right"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoritesToggle(elm);
                    }}
                  >
                    <Row className="justify-end">
                      <StarIcon className={renderFavoritesSvg(elm)} />
                    </Row>
                  </td>
                </tr>
              );
            })}
          </tbody>
        ) : null}
      </table>
      {assets.length === 0 ? (
        <div className="w-full  flex justify-center">
          <Col className="text-center gap-3">
            <p className="font-semibold text-4xl">{t("no_assets")}</p>
            <p className="text-2xl text-grey-1">{t("no_assets_sub")}</p>
          </Col>
        </div>
      ) : null}
    </Col>
  );
};
