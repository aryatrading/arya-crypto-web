import { FC } from "react";
import { AssetType } from "../../../types/asset";
import { marketAssetsHeader } from "../../../utils/tableHead/marketAssetsHead";
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
import styles from "./assetsTable.module.scss"
type AssetsTableProps = {
  assets: AssetType[];
  header: String[];
};

export const AssetsTable: FC<AssetsTableProps> = ({ header, assets }) => {
  const router = useRouter();
  const { t } = useTranslation(["market"]);
  const _assetprice = useSelector(selectAssetLivePrice);

  header = [
    t("rank") ?? "",
    t("name") ?? "",
    t("pnl") ?? "",
    t("currentprice") ?? "",
    t("priceinbtc") ?? "",
    t("marketcap") ?? "",
    t("volume") ?? "",
    "",
  ];

  const renderFavoritesSvg = (asset: AssetType) => {
    let _list = localStorage.getItem(FAVORITES_LIST);

    let _parsed = JSON.parse(_list ?? "");

    if (_parsed?.includes(asset.id ?? ""))
      return `w-4 h-4 fill-yellow-1 stroke-0`;
    else return `w-4 h-4 stroke-1`;
  };

  const handleFavoritesToggle = (asset: AssetType) => {
    // Check if a favorites list is found in local storage
    const favoritesList = localStorage.getItem(FAVORITES_LIST);

    if (!favoritesList) {
      return;
    }

    let _list = JSON.parse(favoritesList);

    if (_list.includes(asset.id)) {
      return localStorage.setItem(
        FAVORITES_LIST,
        JSON.stringify(_list.filter((elm: number) => elm !== asset.id))
      );
    } else {
      // ADD THE ASSET TO THE FAVORITES LIST
      _list.push(asset.id);
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
                  className={
                    index > 1
                      ? "text-right"
                      : "text-left"
                  }
                >
                  {elm}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {assets.map((elm, index) => {
            return (
              <tr
                key={index}
                className="hover:bg-black-2/25 hover:bg-blend-darken cursor-pointer"
                onClick={() => router.push(`/asset?symbol=${elm.symbol}`)}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-bold leading-6 text-white"
                >
                  {elm.rank}
                </th>
                <td
                >
                  <AssetRow
                    icon={elm.iconUrl ?? ""}
                    name={elm.name ?? ""}
                    symbol={elm.symbol ?? ""}
                    className="font-medium"
                  />
                </td>
                <td className="text-right">
                <Row className="justify-end">
                  <AssetPnl
                    value={elm.pnl}
                    className={
                      elm.pnl <= 0
                        ? "bg-red-2 text-red-1"
                        : "bg-green-2 text-green-1"
                    }
                    />
                    </Row>
                </td>
                <td className="font-medium leading-6 text-white text-right font-semibold">
                  {formatNumber(
                    _assetprice[elm.symbol ?? ""] ?? elm.currentPrice,
                    true
                  )}
                </td>
                <td className="font-medium leading-6 text-white text-right">
                  {!!_assetprice &&
                    (
                      _assetprice[elm.symbol ?? ""] / _assetprice["btc"]
                    ).toFixed(7)}
                </td>
                <td className="font-medium leading-6 text-white text-right">
                  {formatNumber(elm.mrkCap ?? 0, true)}
                </td>
                <td className="font-medium leading-6 text-white text-right">
                  {formatNumber(elm.volume ?? 0, true)}
                </td>
                <td
                  className="font-medium  text-white text-right"
                  onClick={() => handleFavoritesToggle(elm)}
                >
                  <Row className="justify-end"><StarIcon className={renderFavoritesSvg(elm)} /></Row>
                  
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Col>
  );
};
