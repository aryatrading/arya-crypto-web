import { FC } from "react";
import { Col } from "../layout/flex";
import { useSelector } from "react-redux";
import { getAsset, getAssetHolding } from "../../../services/redux/assetSlice";
import { CapitalizeString } from "../../../utils/format_string";
import AssetPnl from "../containers/asset/assetPnl";
import { formatNumber } from "../../../utils/helpers/prices";
import { selectAssetLivePrice } from "../../../services/redux/marketSlice";
import { useTranslation } from "next-i18next";

export const ExhangeHoldingTable: FC = () => {
  const { t } = useTranslation(["asset"]);
  const holding = useSelector(getAssetHolding);
  const _assetprice = useSelector(selectAssetLivePrice);
  const asset = useSelector(getAsset);

  const header = [
    t("exchange"),
    t("amount"),
    t("avgprice"),
    t("worth"),
    t("pnl"),
  ];

  return (
    <Col className="flex items-center justify-center flex-1 gap-10 w-full">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
                      : index === header.length - 1
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
          {holding.map((elm: any, index: number) => {
            return (
              <tr key={index} className="hover:bg-grey-1 cursor-pointer h-16">
                <td className="font-medium leading-6 text-white pl-5">
                  {CapitalizeString(elm.provider_name.toLowerCase())}
                </td>
                <td className="font-medium leading-6 text-white">
                  {formatNumber(elm.free)} {asset.symbol.toUpperCase()}
                </td>
                <td className="font-medium leading-6 text-white">
                  {formatNumber(elm.avg_price, true)}
                </td>
                <td className="font-medium leading-6 text-white">
                  {formatNumber(_assetprice[asset.symbol] * elm.free, true)}
                </td>
                <td className="font-medium leading-6 text-white flex flex-row mt-5">
                  <AssetPnl
                    value={elm.pnl_percent}
                  />
                  <AssetPnl
                    value={elm.pnl_value ?? 0}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Col>
  );
};
