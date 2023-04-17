import { FC, useState } from "react";
import { Col, Row } from "../../shared/layout/flex";
import MarketStats from "../../shared/containers/marketStats";
import { AssetsTable } from "../../shared/tables/assetsTable";
import { SearchInput } from "../../shared/inputs/searchInputs";

const Market: FC = () => {
  const [title, setTitle] = useState("Cryptocurrencies");

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
          <h1>toggle</h1>
        </Row>
        <AssetsTable />
      </Col>
    </div>
  );
};

export default Market;
