import { FC, useMemo, useState } from "react";
import { Col, Row } from "../../shared/layout/flex";
import ExchangeSwitcher from "../../shared/exchange-switcher/exchange-switcher";
import TradingViewWidget from "../../shared/charts/tradingView/tradingView";
import { TimeseriesPicker } from "../../shared/containers/asset/graphTimeseries";
import { Tab, TabList, Tabs } from "react-tabs";
import { EntryTrade } from "./entry_trade";
import Button from "../../shared/buttons/button";
import { StoplossTrade } from "./stoploss_trade";
import { TakeprofitTrade } from "./takeprofit_trade";

const Trade: FC = () => {
  const [activeTab, setActiveTab] = useState("entry");

  const tradetabs = useMemo(() => {
    return [
      {
        title: "Entry",
        value: "entry",
        key: "entry",
      },
      {
        title: "Stop loss",
        value: "stoploss",
        key: "stoploss",
      },
      {
        title: "Take profit",
        value: "takeprofit",
        key: "takeprofit",
      },
      {
        title: "Trailing",
        value: "trailing",
        key: "trailing",
      },
    ];
  }, []);

  const renderTradeContent = () => {
    if (activeTab === "entry") return <EntryTrade />;
    if (activeTab === "stoploss") return <StoplossTrade />;
    if (activeTab === "takeprofit") return <TakeprofitTrade />;
  };

  return (
    <Col className="flex justify-start w-full gap-6">
      <ExchangeSwitcher hideExchangeStats={true} canSelectOverall={false} />

      <TradingViewWidget height={500} />

      <Col className="bg-black-2  py-5 rounded-md gap-5 px-3 ">
        <TimeseriesPicker
          series={tradetabs}
          active={activeTab}
          onclick={(e: any) => setActiveTab(e.key)}
        />
        {renderTradeContent()}
      </Col>
      <Button className="bg-green-1 rounded-md py-3" onClick={() => {}}>
        <p>Place order</p>
      </Button>
      <Tabs selectedTabClassName="text-blue-1 font-bold text-lg border-b-2 border-blue-1">
        <TabList className="border-b-[1px] border-grey-3 mb-2">
          <Row className="gap-6">
            <Tab className="font-semibold text-sm outline-none cursor-pointer w-full text-center">
              Open Orders
            </Tab>
            <Tab className="font-semibold text-sm outline-none cursor-pointer w-full text-center">
              Order History
            </Tab>
          </Row>
        </TabList>
      </Tabs>
    </Col>
  );
};

export default Trade;
