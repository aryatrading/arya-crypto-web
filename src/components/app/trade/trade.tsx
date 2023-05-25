import { FC, useMemo, useState } from "react";
import { Col, Row } from "../../shared/layout/flex";
import ExchangeSwitcher from "../../shared/exchange-switcher/exchange-switcher";
import TradingViewWidget from "../../shared/charts/tradingView/tradingView";
import { TimeseriesPicker } from "../../shared/containers/asset/graphTimeseries";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { EntryTrade } from "./entry_trade";
import Button from "../../shared/buttons/button";
import { StoplossTrade } from "./stoploss_trade";
import { TakeprofitTrade } from "./takeprofit_trade";
import { TrailingTrade } from "./trailing_trade";
import { useSelector } from "react-redux";
import { getTrade, getValidations } from "../../../services/redux/tradeSlice";
import { AssetTradeDropdown } from "../../shared/assetDropdown/assetTradeDropdown";
import { OpenOrders } from "../../shared/tables/openOrderTable";
import { OrderHistory } from "../../shared/tables/orderHistoryTable";
import { useTranslation } from "next-i18next";

const Trade: FC = () => {
  const { t } = useTranslation(["trade"]);
  const [activeTab, setActiveTab] = useState("entry");
  const trade = useSelector(getTrade);
  const validations = useSelector(getValidations);

  const tradetabs = useMemo(() => {
    return [
      {
        title: t("entry"),
        value: "entry",
        key: "entry",
      },
      {
        title: t("stoploss"),
        value: "stoploss",
        key: "stoploss",
      },
      {
        title: t("takeprofit"),
        value: "takeprofit",
        key: "takeprofit",
      },
      {
        title: t("trailing"),
        value: "trailing",
        key: "trailing",
      },
    ];
  }, []);

  const renderTradeContent = () => {
    if (activeTab === "entry") return <EntryTrade />;
    if (activeTab === "stoploss") return <StoplossTrade />;
    if (activeTab === "takeprofit") return <TakeprofitTrade />;
    if (activeTab === "trailing") return <TrailingTrade />;
  };

  const onCreateTrade = () => {
    // console.log(validations);
    console.log(trade);
  };

  return (
    <Col className="flex justify-start w-full gap-6">
      <ExchangeSwitcher hideExchangeStats={true} canSelectOverall={false} />
      <AssetTradeDropdown />

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-2/3">
          <TradingViewWidget height={500} />
        </div>

        <div>
          <Col className="bg-black-2  py-5 rounded-md gap-5 px-3 ">
            <TimeseriesPicker
              series={tradetabs}
              active={activeTab}
              onclick={(e: any) => setActiveTab(e.key)}
            />
            {renderTradeContent()}
          </Col>
          <Button
            className="bg-green-1 rounded-md py-3 mt-4  w-full"
            onClick={() => {
              onCreateTrade();
            }}
          >
            <p>{t("placeorder")}</p>
          </Button>
        </div>
      </div>
      <Tabs selectedTabClassName="text-blue-1 font-bold text-lg border-b-2 border-blue-1">
        <TabList className="border-b-[1px] border-grey-3 mb-2">
          <Row className="gap-6">
            <Tab className="font-semibold text-sm outline-none cursor-pointer w-full text-center">
              {t("openorders")}
            </Tab>
            <Tab className="font-semibold text-sm outline-none cursor-pointer w-full text-center">
              {t("orderhistory")}
            </Tab>
          </Row>
        </TabList>
        <TabPanel>
          <OpenOrders />
        </TabPanel>
        <TabPanel>
          <OrderHistory />
        </TabPanel>
      </Tabs>
    </Col>
  );
};

export default Trade;
