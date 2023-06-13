import { FC, useMemo, useState } from "react";
import { Col, Row } from "../../shared/layout/flex";
import ExchangeSwitcher from "../../shared/exchange-switcher/exchange-switcher";
import TradingViewWidget from "../../shared/charts/tradingView/tradingView";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { EntryTrade } from "./entry_trade";
import Button from "../../shared/buttons/button";
import { StoplossTrade } from "./stoploss_trade";
import { TakeprofitTrade } from "./takeprofit_trade";
import { TrailingTrade } from "./trailing_trade";
import { useDispatch, useSelector } from "react-redux";
import { clearTrade, getTrade } from "../../../services/redux/tradeSlice";
import { AssetTradeDropdown } from "../../shared/assetDropdown/assetTradeDropdown";
import { OpenOrders } from "../../shared/tables/openOrderTable";
import { OrderHistory } from "../../shared/tables/orderHistoryTable";
import { useTranslation } from "next-i18next";
import { selectSelectedExchange } from "../../../services/redux/exchangeSlice";
import {
  createTrade,
  initiateTrade,
} from "../../../services/controllers/trade";
import { toast } from "react-toastify";
import { ShadowButton } from "../../shared/buttons/shadow_button";
import { twMerge } from "tailwind-merge";

const Trade: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["trade"]);
  const [activeTab, setActiveTab] = useState("entry");
  let trade = useSelector(getTrade);
  const [laoding, setLoading] = useState(false);
  const selectedExchange = useSelector(selectSelectedExchange);

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
  }, [t]);

  const renderTradeContent = () => {
    if (activeTab === "entry") return <EntryTrade />;
    if (activeTab === "stoploss") return <StoplossTrade assetScreen={false} />;
    if (activeTab === "takeprofit")
      return <TakeprofitTrade assetScreen={false} />;
    if (activeTab === "trailing") return <TrailingTrade assetScreen={false} />;
  };

  const onCreateTrade = async () => {
    if (!trade.entry_order.price || trade.entry_order.price <= 0) {
      return toast.info(t("addentryerror"));
    }

    if (!trade.entry_order?.quantity || trade.entry_order?.quantity <= 0) {
      return toast.info(t("addentrtyqty"));
    }

    setLoading(true);

    try {
      await createTrade(trade, selectedExchange?.provider_id ?? 1);
      toast.success(`${trade.symbol_name} ${t("tradecreated")}`);

      dispatch(clearTrade());

      await initiateTrade(
        trade.asset_name,
        selectedExchange?.provider_id ?? 1,
        trade.base_name
      );
    } catch (error: any) {
      toast.error(`${t("errorcreating")} ${trade.symbol_name}`);
      const _list = error.response.data.trade_engine_response.detail.list;

      for (var i = 0; i < _list.length; i++) {
        toast.info(_list[i]);
      }
    } finally {
      setLoading(false);
    }
  };

  const tabHasData = (key: string) => {
    if (key === "stoploss") {
      if (trade?.stop_loss?.length) return true;
      else return false;
    }

    if (key === "takeprofit") {
      if (trade?.take_profit?.length) return true;
      else return false;
    }

    if (key === "trailing") {
      if (trade?.trailing_stop_loss?.length) return true;
      else return false;
    }
    return false;
  };

  const renderTabs = () => {
    return (
      <Row className="gap-0.5">
        {tradetabs.map((elm, index) => {
          return (
            <ShadowButton
              className={twMerge(
                "px-3 py-2 gap-0",
                elm.title === "3M" ? "hidden md:flex" : ""
              )}
              key={index}
              title={elm.title}
              onClick={() => setActiveTab(elm.key)}
              showBadge={tabHasData(elm.key)}
              border={
                index === 0
                  ? "rounded-l-md"
                  : index === tradetabs.length - 1
                  ? "rounded-r-md"
                  : ""
              }
              bgColor={activeTab === elm.key ? "bg-blue-3" : "bg-grey-2"}
              textColor={activeTab === elm.key ? "text-blue-2" : "text-grey-1"}
            />
          );
        })}
      </Row>
    );
  };

  const renderTradingView = useMemo(() => {
    return (
      <div className="h-[500px] w-full">
        <TradingViewWidget
          height={500}
          asset={`${trade.asset_name?.toUpperCase()}USDT`}
        />
      </div>
    );
  }, [trade.asset_name]);

  return (
    <Col className="flex justify-start w-full gap-6">
      <ExchangeSwitcher hideExchangeStats={true} canSelectOverall={false} />
      <AssetTradeDropdown />

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-2/3 flex-none">{renderTradingView}</div>

        <div className="w-full">
          <Col className=" bg-black-2 rounded-md gap-5 px-5 py-5">
            <div className="w-full flex justify-center">{renderTabs()}</div>
            {renderTradeContent()}
          </Col>
          <Button
            className="bg-green-1 rounded-md py-3 mt-4  w-full"
            isLoading={laoding}
            onClick={() => {
              onCreateTrade();
            }}
          >
            <p>{t("placeorder")}</p>
          </Button>
        </div>
      </div>
      <Tabs className="text-blue-1 font-bold text-lg border-b-2 border-blue-1">
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
