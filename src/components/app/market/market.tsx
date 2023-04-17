import { FC, useState } from "react";
import { Col, Row } from "../../shared/layout/flex";
import MarketStats from "../../shared/containers/marketStats";
import { AssetsTable } from "../../shared/tables/assetsTable";
import { SearchInput } from "../../shared/inputs/searchInputs";
import { dummyMarket } from "../../../utils/constants/dummyData";
import { AssetType } from "../../../types/asset";
import { marketAssetsHeader } from "../../../utils/tableHead/marketAssetsHead";
import { ShadowButton } from "../../shared/buttons/shadow_button";

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={0}
                  stroke="currentColor"
                  className="w-4 h-4 fill-yellow_one "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
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
