import { FC, useState } from "react";
import { Col, Row } from "../../shared/layout/flex";
import MarketStats from "../../shared/containers/marketStats";
import { AssetsTable } from "../../shared/tables/assetsTable";
import { SearchInput } from "../../shared/inputs/searchInputs";
import { dummyMarket } from "../../../utils/constants/dummyData";
import { AssetType } from "../../../types/asset";
import { marketAssetsHeader } from "../../../utils/tableHead/marketAssetsHead";
import { ShadowButton } from "../../shared/buttons/shadow_button";
import { StarIcon } from "@heroicons/react/24/outline";

const Market: FC = () => {
  const [title, setTitle] = useState("Cryptocurrencies");
  const [tab, setTab] = useState("all");

  return (
    <div className="h-full items-center justify-center">
      <Col className="flex items-center justify-center flex-1 mt-20">
        <p className="text-[#F9FAFB] font-medium text-4xl mb-10">{title}</p>
        <Row className="w-full items-center justify-center mb-10">
          <MarketStats
            bgColor="bg-[#0E3F2D]"
            textColor="text-[#22C55E]"
            value="+8.15"
            title="Market Cap"
          />
          <MarketStats
            bgColor="bg-[#440C10]"
            textColor="text-[#F2323F]"
            value="-3.75"
            title="Volume 24H"
          />
        </Row>
        <Row className="w-2/4 justify-between mt-8 mb-2 align-center">
          <SearchInput onChange={() => console.log("d")} placeholder=":" />
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
                <StarIcon className="w-4 h-4 fill-yellow_one stroke-yellow_one" />
              }
            />
          </Row>
        </Row>
        <AssetsTable
          header={marketAssetsHeader}
          assets={dummyMarket as unknown as AssetType}
        />
      </Col>
    </div>
  );
};

export default Market;
