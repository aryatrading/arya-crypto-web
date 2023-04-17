import { FC } from "react";
import { AssetType } from "../../../types/asset";
import { marketAssetsHeader } from "../../../utils/tableHead/marketAssetsHead";
import AssetPnl from "../containers/assetPnl";
import { Col } from "../layout/flex";

type AssetsTableProps = {
  assets: AssetType[];
  header: String[];
};

export const AssetsTable: FC<AssetsTableProps> = ({ header, assets }) => {
  return (
    <Col className="flex items-center justify-center flex-1 gap-10 w-2/4">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {header.map((elm, index) => {
              return (
                <th
                  key={index}
                  scope="col"
                  className={
                    index === 0
                      ? "px-6 py-3 rounded-l-lg"
                      : index === marketAssetsHeader.length - 1
                      ? "rounded-r-lg"
                      : ""
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
              <tr key={index}>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium leading-6 text-white"
                >
                  {elm.rank}
                </th>
                <td className="font-medium leading-6 text-white">{elm.name}</td>
                <td>
                  <AssetPnl
                    value={elm.pnl > 0 ? `+${elm.pnl}` : elm.pnl}
                    bgColor={elm.pnl <= 0 ? "bg-red_two" : "bg-green_two"}
                    textColor={elm.pnl <= 0 ? "text-red_one" : "text-green_one"}
                  />
                </td>
                <td className="font-medium leading-6 text-white">
                  {elm.currentPrice}
                </td>
                <td className="font-medium leading-6 text-white">
                  {elm.price}
                </td>
                <td className="font-medium leading-6 text-white">
                  {elm.mrkCap}
                </td>
                <td className="font-medium leading-6 text-white">
                  {elm.volume}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Col>
  );
};
