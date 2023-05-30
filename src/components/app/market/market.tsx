import { FC, useCallback, useEffect, useMemo, useState } from "react";
import React from "react";
import { useTranslation } from "next-i18next";
import { StarIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import clsx from "clsx";


import { Col, Row } from "../../shared/layout/flex";
import MarketStats from "../../shared/containers/marketStats";
import { AssetsTable } from "../../shared/tables/assetsTable";
import { SearchInput } from "../../shared/inputs/searchInputs";
import { ShadowButton } from "../../shared/buttons/shadow_button";
import { selectMarketAssets } from "../../../services/redux/marketSlice";
import { fetchAssets, getMarketCap } from "../../../services/controllers/market";
import { FAVORITES_LIST } from "../../../utils/constants/config";
import useDebounce from "../../../utils/useDebounce";

const Market: FC = () => {
  const { t } = useTranslation(["market"]);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const _assets = useSelector(selectMarketAssets);
  const [marketCapDetails, setMarketCapDetails] = useState<any>({});

  useEffect(() => {
    getMarketCap().then(({ data: { data: { quote: { USD } } } }) => {
      setMarketCapDetails({
        vol24: USD.total_volume_24h,
        vol24Percentage: USD.total_volume_24h_yesterday_percentage_change,
        marketCap: USD.total_market_cap,
        marketCapPercentage: USD.total_market_cap_yesterday_percentage_change,
        marketCapYesterday: USD.total_market_cap_yesterday
      })
    })
  }, []);

  const BTCDominance = useMemo(() => {
    const btcMC = _assets.filter((asset: any) => asset.symbol === 'btc')[0]?.mrkCap;
    return btcMC != null && marketCapDetails?.marketCap != null ? (btcMC / marketCapDetails.marketCap) * 100 : 0;
  }, [_assets, marketCapDetails]);

  const BTCDominanceYesterday = useMemo(() => {
    const btcMC = _assets.filter((asset: any) => asset.symbol === 'btc')[0]?.mrkCapYesterday;
    return btcMC != null && marketCapDetails?.marketCapYesterday != null ? (btcMC / marketCapDetails.marketCapYesterday) * 100 : 0;
  }, [_assets, marketCapDetails]);

  useDebounce(
    () => {
      fetchAssets(search);
    },
    [search],
    400
  );

  const assets = useCallback(() => {
    if (typeof window !== "undefined") {
      let _list = localStorage.getItem(FAVORITES_LIST);
      if (_list) _list = JSON.parse(_list);

      if (tab === "all") return _assets;
      return _assets.filter((elm: any) => _list?.includes(elm.id));
    }
  }, [_assets, tab]);

  return (
    <div className="h-full w-full ">
      <Col className="flex items-center justify-center flex-1">
        <Col className="h-32 mb-40 mt-20 lg:mb-20 flex justify-center w-full">
          <p className="text-center  text-[#F9FAFB] font-medium text-4xl mb-10">
            {tab === "all" ? t("cryptocurrencies") : t("favorites")}
          </p>
          {tab === "all" ? (
            <div className="w-full items-center justify-center gap-4 flex flex-col lg:flex-row">
              <MarketStats
                bgColor={clsx({ "bg-green-2": marketCapDetails?.marketCapPercentage > 0, "bg-red-2": marketCapDetails?.marketCapPercentage < 0, "bg-grey-2": marketCapDetails?.marketCapPercentage === 0 }, "w-full lg:w-64")}
                value={marketCapDetails?.marketCapPercentage || '0'}
                amount={marketCapDetails?.marketCap || '0'}
                title={t("marketcap")}
              />
              <MarketStats
                bgColor={clsx({ "bg-green-2": marketCapDetails?.vol24Percentage > 0, "bg-red-2": marketCapDetails?.vol24Percentage < 0, "bg-grey-2": marketCapDetails?.vol24Percentage === 0 }, "w-full lg:w-64")}
                value={marketCapDetails?.vol24Percentage || '0'}
                amount={marketCapDetails?.vol24 || '0'}
                title={t("volume")}
              />
              <MarketStats
                bgColor={clsx({ "bg-green-2": BTCDominance > 0, "bg-red-2": BTCDominance < 0, "bg-grey-2": BTCDominance === 0 }, "w-full lg:w-64")}
                value={BTCDominanceYesterday}
                amount={String(BTCDominance)}
                title={t("btcDominance")}
                percent
              />
            </div>
          ) : null}
          <div className="w-full mt-7 lg:px-[500px] justify-center">
            <SearchInput
              onchange={(e: string) => setSearch(e)}
              placeholder={t("search")}
            />
          </div>
        </Col>
        <Row className="gap-0.5 justify-end pb-2 w-full">
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

        <AssetsTable assets={assets() ?? []} />
      </Col>
    </div>
  );
};

export default Market;
