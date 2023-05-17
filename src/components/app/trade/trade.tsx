import { FC, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrade, setSide } from "../../../services/redux/tradeSlice";
import { Col, Row } from "../../shared/layout/flex";
import ExchangeSwitcher from "../../shared/exchange-switcher/exchange-switcher";
import TradingViewWidget from "../../shared/charts/tradingView/tradingView";
import { TimeseriesPicker } from "../../shared/containers/asset/graphTimeseries";
import { ShadowButton } from "../../shared/buttons/shadow_button";
import { Tab, TabList, Tabs } from "react-tabs";
import { formatNumber } from "../../../utils/helpers/prices";
import TradeInput from "../../shared/inputs/tradeInput";

const Trade: FC = () => {
  const dispatch = useDispatch();
  const trade = useSelector(getTrade);
  const [activeTab, setActiveTab] = useState("entry");

  console.log(trade);

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
        <Row className="w-full justify-evenly gap-2">
          <ShadowButton
            title="Buy"
            bgColor={
              trade?.entry_order?.type === "BUY" ? "bg-green-1" : "bg-green-2"
            }
            onClick={() => dispatch(setSide({ side: "BUY" }))}
            textColor="text-white"
            border="rounded-md w-full text-center"
          />
          <ShadowButton
            title="Sell"
            bgColor={
              trade?.entry_order?.type === "SELL" ? "bg-red-1" : "bg-red-2"
            }
            onClick={() => dispatch(setSide({ side: "SELL" }))}
            textColor="text-white"
            border="rounded-md w-full text-center"
          />
        </Row>
        <div className="w-full">
          <Tabs selectedTabClassName="text-blue-1 font-bold text-lg border-b-2 border-blue-1">
            <TabList className="border-b-[1px] border-grey-3 mb-2">
              <Row className="gap-6">
                <Tab className="font-semibold text-sm outline-none cursor-pointer w-full text-center">
                  Market
                </Tab>
                <Tab className="font-semibold text-sm outline-none cursor-pointer w-full text-center">
                  Conditional
                </Tab>
              </Row>
            </TabList>
          </Tabs>
        </div>
        <p className="font-bold text-sm">
          Available: {formatNumber(trade.available_quantity)} {trade.base_name}
        </p>
        <TradeInput title="Price" value={trade.base_name} />
        <TradeInput title="Units" value={trade.asset_name} />
        <TradeInput title="Total" value={trade.base_name} />
      </Col>
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
