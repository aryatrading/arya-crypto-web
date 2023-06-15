import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FC, useMemo, useState } from "react";
import { Row } from "../layout/flex";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { AssetPairSelector } from "../containers/trade/assetpairSelector";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import {
  clearTrade,
  getFilter,
  getTrade,
  getTradedAssets,
  setTrade,
} from "../../../services/redux/tradeSlice";
import { selectSelectedExchange } from "../../../services/redux/exchangeSlice";
import { getAssetAvailable } from "../../../services/controllers/trade";

export const AssetTradeDropdown: FC = () => {
  const { t } = useTranslation(["nav", "coin", "asset"]);
  const [searchFilter, setSearchFilter] = useState("");
  const dispatch = useDispatch();
  const trade = useSelector(getTrade);
  const filter = useSelector(getFilter);
  const tradedAssets = useSelector(getTradedAssets);
  const selectedExchange = useSelector(selectSelectedExchange);

  const assets = useMemo(() => {
    if (searchFilter.length) {
      return tradedAssets.filter(
        (elm: string) =>
          elm.endsWith(filter) && elm.includes(searchFilter.toUpperCase())
      );
    }

    return tradedAssets.filter((elm: string) => elm.endsWith(filter));
  }, [filter, searchFilter, selectedExchange]);

  const assetSelect = async (asset: string) => {
    setSearchFilter("");
    dispatch(clearTrade());

    const _symbol = asset.split(filter);

    dispatch(
      setTrade({
        asset_name: _symbol[0].replace("-", "") ?? "btc",
        base_name: filter,
        available_quantity: await getAssetAvailable(
          filter,
          selectedExchange?.provider_id ?? 1
        ),
      })
    );
  };

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          className="bg-grey-3 md:w-40 py-2 rounded-full"
          aria-label="Customise options"
          onClick={() => setSearchFilter("")}
        >
          <Row className="flex flex-row justify-between mx-3 items-center">
            <p className="font-bold text-base">
              {trade?.symbol_name ?? "Select Asset"}
            </p>
            <ChevronDownIcon width={15} height={15} />
          </Row>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal className="z-10">
        <DropdownMenu.Content
          className={clsx(
            "md:min-w-[400px] max-h-[400px] bg-grey-2 shadow-md shadow-black-1 rounded-md overflow-auto z-50 p-5 flex flex-col gap-4 "
          )}
          align="start"
        >
          <Row className="bg-transparent h-[40px] items-center md:bg-grey-3 px-4 rounded-md overflow-hidden">
            <MagnifyingGlassIcon width="20px" color="#6B7280" />
            <input
              className={clsx(
                "font-bold text-sm text-white bg-transparent flex-1 pl-2 focus:outline-none focus:border-transparent focus:ring-0 border-transparent"
              )}
              type="text"
              id="searchInput"
              maxLength={20}
              placeholder={t("coin:searchAsset").toString()}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </Row>
          <AssetPairSelector />
          <div className="w-full border border-grey-1" />

          {assets &&
            assets.map((elm: string, index: number) => {
              return (
                <DropdownMenu.Item
                  onClick={() => assetSelect(elm)}
                  key={index}
                  className="ring-0 cursor-pointer"
                >
                  {elm.replace("-", "")}
                </DropdownMenu.Item>
              );
            })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
