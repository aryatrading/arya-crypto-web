import { FC, useEffect, useState } from "react";
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

const Market: FC = () => {
  const [tab, setTab] = useState("all");

  const assets = () => {
    if (typeof window !== "undefined") {
      let _list = localStorage.getItem(FAVORITES_LIST);
      if (_list) _list = JSON.parse(_list);

      if (tab === "all") return useSelector(getMarketAssets);
      return useSelector(getMarketAssets).filter((elm: any) =>
        _list?.includes(elm.id)
      );
    }
  };

  return (
    <div className="h-full w-full items-center justify-center ">
      <Col className="flex items-center justify-center flex-1 mt-20">
        <p className="text-[#F9FAFB] font-medium text-4xl mb-10">
          {tab === "all" ? "Cryptocurrencies" : "Favorites"}
        </p>
        {tab === "all" ? (
          <Row className="w-full items-center justify-center mb-10">
            {/* TODO: update hardcoded color values */}
            <MarketStats
              bgColor="bg-green_two"
              textColor="text-green_one"
              value="+8.15"
              title="Market Cap"
            />
            <MarketStats
              bgColor="bg-red_two"
              textColor="text-red_one"
              value="-3.75"
              title="Volume 24H"
            />
          </Row>
        ) : null}

        <Row className="w-full justify-between mt-8 mb-2 align-center">
          <SearchInput
            onchange={(e: string) => fetchAssets(e)}
            placeholder="Search a coin"
          />
          <Row className="gap-0.5">
            <ShadowButton
              title="All"
              onClick={() => setTab("all")}
              border="rounded-l-md"
              bgColor={tab === "all" ? "bg-blue_three" : "bg-grey_two"}
              textColor={tab === "all" ? "text-blue_one" : "text-white"}
            />
            <ShadowButton
              title="Favorites"
              onClick={() => setTab("favorites")}
              border="rounded-r-md"
              bgColor={tab === "all" ? "bg-grey_two" : "bg-blue_three"}
              textColor={tab === "all" ? "text-white" : "text-blue_one"}
              iconSvg={
                <StarIcon className="w-4 h-4 fill-yellow_one stroke-0" />
              }
            />
          </Row>
        </Row>
        <AssetsTable header={marketAssetsHeader} assets={assets() ?? []} />
      </Col>
    </div>
  );
};

export default Market;
