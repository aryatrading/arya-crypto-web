import { FC } from "react";
import { AssetType } from "../../../types/asset";
import { marketAssetsHeader } from "../../../utils/tableHead/marketAssetsHead";
import { Col } from "../layout/flex";
import { formatNumber } from "../../../utils/format_currency";
import { useSelector } from "react-redux";
import { selectAssetLivePrice } from "../../../services/redux/marketSlice";
import { StarIcon } from "@heroicons/react/24/outline";
import { FAVORITES_LIST } from "../../../utils/constants/config";
import React from "react";
import { useTranslation } from "next-i18next";
import AssetPnl from "../containers/asset/assetPnl";
import { useRouter } from "next/navigation";
import AssetRow from "../AssetRow/AssetRow";

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
      <table className="w-full text-sm text-left text-gray-400">
        <thead className="text-xs text-gray-1">
          <tr>
            {header.map((elm, index) => {
              return (
                <th
                  key={index}
                  scope="col"
                  className={
                    index === 0
                      ? "px-6 py-3 rounded-l-lg bg-black-2 font-medium"
                      : index === marketAssetsHeader.length - 1
                      ? "rounded-r-lg bg-black-2 font-medium"
                      : "bg-black-2 h-14 font-medium"
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
                className="hover:bg-grey-1 cursor-pointer"
                onClick={() => router.push(`/asset?symbol=${elm.symbol}`)}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium leading-6 text-white"
                >
                  {elm.rank}
                </th>
                <td>
                  <AssetRow icon={elm.iconUrl??''} name={elm.name??''} symbol={elm.symbol??''} className="font-medium"/>
                </td>
                <td>
                  <AssetPnl
                    value={elm.pnl}
                    className={elm.pnl<=0?'bg-red-2 text-red-1':'bg-green-2 text-green-1'}
                  />
                </td>
                <td className="font-medium leading-6 text-white">
                  {formatNumber(
                    _assetprice[elm.symbol ?? ""] ?? elm.currentPrice
                  )}
                </td>
                <td className="font-medium leading-6 text-white">
                  {!!_assetprice &&
                    (
                      _assetprice[elm.symbol ?? ""] / _assetprice["btc"]
                    ).toFixed(7)}
                </td>
                <td className="font-medium leading-6 text-white">
                  {formatNumber(elm.mrkCap ?? 0)}
                </td>
                <td className="font-medium leading-6 text-white">
                  {formatNumber(elm.volume ?? 0)}
                </td>
                <td
                  className="font-medium  text-white"
                  onClick={() => handleFavoritesToggle(elm)}
                >
                  <StarIcon className={renderFavoritesSvg(elm)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Col>
  );
};
