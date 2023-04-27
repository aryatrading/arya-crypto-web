import { FC, useState } from "react";
import { Col, Row } from "../../shared/layout/flex";
import MarketStats from "../../shared/containers/marketStats";
import { AssetsTable } from "../../shared/tables/assetsTable";
import { SearchInput } from "../../shared/inputs/searchInputs";
import { marketAssetsHeader } from "../../../utils/tableHead/marketAssetsHead";
import { ShadowButton } from "../../shared/buttons/shadow_button";
import { StarIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { getMarketAssets } from "../../../services/redux/marketSlice";
import { fetchAssets } from "../../../services/controllers/market";
import { FAVORITES_LIST } from "../../../utils/constants/config";
import useDebounce from "../../../utils/useDebounce";
import React from "react";
import { useTranslation } from "next-i18next";

const Market: FC = () => {
  const { t } = useTranslation(["market"]);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const _assets = useSelector(getMarketAssets);

  useDebounce(
    () => {
      fetchAssets(search);
    },
    [search],
    400
  );

  const assets = () => {
    if (typeof window !== "undefined") {
      let _list = localStorage.getItem(FAVORITES_LIST);
      if (_list) _list = JSON.parse(_list);

      if (tab === "all") return _assets;
      return _assets.filter((elm: any) => _list?.includes(elm.id));
    }
  };

  return (
    <div className="h-full w-full items-center justify-center ">
      <Col className="flex items-center justify-center flex-1">
        <Col className="h-32 mb-20">
          <p className="text-center  text-[#F9FAFB] font-medium text-4xl mb-10">
            {tab === "all" ? t("cryptocurrencies") : t("cryptocurrencies")}
          </p>
          {tab === "all" ? (
            <Row className="w-full items-center justify-center mb-10">
              {/* TODO: update hardcoded color values */}
              <MarketStats
                bgColor="bg-green-2"
                textColor="text-green-1"
                value="+8.15"
                title={t("marketcap")}
              />
              <MarketStats
                bgColor="bg-red-2"
                textColor="text-red-1"
                value="-3.75"
                title={t("volume")}
              />
            </Row>
          ) : null}
        </Col>
        <Row className="w-full justify-between mt-8 mb-2 align-center">
          <SearchInput
            onchange={(e: string) => setSearch(e)}
            placeholder={t("search")}
          />
          <Row className="gap-0.5">
            <ShadowButton
              title={t("all")}
              onClick={() => setTab("all")}
              border="rounded-l-md"
              bgColor={tab === "all" ? "bg-blue-3" : "bg-grey-2"}
              textColor={tab === "all" ? "text-blue-2" : "text-white"}
            />
            <ShadowButton
              title={t("favorites")}
              onClick={() => setTab("favorites")}
              border="rounded-r-md"
              bgColor={tab === "all" ? "bg-grey-2" : "bg-blue-3"}
              textColor={tab === "all" ? "text-white" : "text-blue-2"}
              iconSvg={<StarIcon className="w-4 h-4 fill-yellow-1 stroke-0" />}
            />
          </Row>
        </Row>
        <AssetsTable header={marketAssetsHeader} assets={assets() ?? []} />
      </Col>
    </div>
  );
};

export default Market;
