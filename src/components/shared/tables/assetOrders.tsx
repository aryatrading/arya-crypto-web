import { FC } from "react";
import { useSelector } from "react-redux";
import { getAsset, getOrders } from "../../../services/redux/assetSlice";
import { Col } from "../layout/flex";
import { formatNumber } from "../../../utils/helpers/prices";
import moment from "moment";
import { CapitalizeString } from "../../../utils/format_string";
import { useTranslation } from "next-i18next";
import { ThemedContainer } from "../containers/themedContainer";

export const AssetOrdersTable: FC = () => {
  const { t } = useTranslation(["asset"]);
  const orders = useSelector(getOrders);
  const asset = useSelector(getAsset);

  const header = [
    t("type"),
    t("status"),
    t("amount"),
    t("price"),
    t("date"),
    t("exchange"),
  ];

  const renderOrderColumn = (order: string) => {
    if (order === "PENDING_ENTRY" || order === "ACTIVE") return t("pending");
    if (order === "CANCELLED") return t("cancelled");
    if (order === "FULFILLED") return t("executed");

    return t("error");
  };

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
          {orders.map((elm: any, index: number) => {
            return (
              <tr key={index} className="hover:bg-grey-1 cursor-pointer h-16">
                <ThemedContainer
                  colorClass={
                    elm.order_data?.side === "SELL" ? "bg-red-2" : "bg-green-2"
                  }
                  textColor={
                    elm.order_data?.side === "SELL"
                      ? "text-red-1"
                      : "text-green-1"
                  }
                  content={elm.order_data?.side?.toUpperCase()}
                />
                <td className="font-medium leading-6 text-white pl-5">
                  {renderOrderColumn(elm.order_status)}
                </td>

                <td className="font-medium leading-6 text-white pl-5">
                  {formatNumber(elm?.quantity)} {asset?.symbol?.toUpperCase()}
                </td>
                <td className="font-medium leading-6 text-white pl-5">
                  {formatNumber(elm?.value, true)}
                </td>
                <td className="font-medium leading-6 text-white pl-5">
                  {moment(elm?.created_at).format("DD/MM/YY")}
                </td>
                <td className="font-medium leading-6 text-white pl-5">
                  {CapitalizeString(elm?.provider_name?.toLowerCase())}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Col>
  );
};
