import { FC, useCallback, useEffect, useState } from "react";
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
import {
  fetchAssets,
  getMarketCap,
} from "../../../services/controllers/market";
import { FAVORITES_LIST, MODE_DEBUG } from "../../../utils/constants/config";
import { firebaseId } from "../../../services/redux/userSlice";
import { formatNumber } from "../../../utils/helpers/prices";

const Market: FC = () => {
  const { t } = useTranslation(["market"]);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const _assets = useSelector(selectMarketAssets);
  const [count, setCount] = useState(100);
  const [marketCapDetails, setMarketCapDetails] = useState<any>({});
  const fId = useSelector(firebaseId);

  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (bottom) setCount(count + 100);
  };

  useEffect(() => {
    fetchAssets(search, count, fId);
  }, [count, search]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useEffect(() => {
  //   getMarketCap()
  //     .then(({ data: { data } }) => {
  //       const USD = data.quote.USD;
  //       setMarketCapDetails({
  //         vol24: USD.total_volume_24h,
  //         vol24Percentage: USD.total_volume_24h_yesterday_percentage_change,
  //         marketCap: USD.total_market_cap,
  //         marketCapPercentage: USD.total_market_cap_yesterday_percentage_change,
  //         BTCDominance: data.btc_dominance,
  //         BTCDominancePercentage: data.btc_dominance_24h_percentage_change,
  //       });
  //     })
  //     .catch((error) => {
  //       if (MODE_DEBUG) {
  //         console.error(error);
  //       }
  //     });
  // }, []);

  const assets = useCallback(() => {
    if (typeof window !== "undefined") {
      let _list = localStorage.getItem(FAVORITES_LIST);
      if (_list) _list = JSON.parse(_list);

      if (tab === "all") return _assets;
      return _assets.filter((elm: any) => _list?.includes(elm.id));
    }
  }, [_assets, tab]);

  return (
    <div className="h-full w-full " onScroll={handleScroll}>
      <Col className="flex items-center justify-center flex-1">
        <Col className="h-32 mb-40 mt-36 md:mt-0 lg:mb-20 flex justify-center w-full">
          <p className="text-center  text-[#F9FAFB] font-medium text-4xl mb-10">
            {tab === "all" ? t("cryptocurrencies") : t("favorites")}
          </p>
          {/* {tab === "all" ? (
            <Row className="w-full items-center justify-center gap-8 flex flex-col lg:flex-row">
              <MarketStats
                bgColor={clsx(
                  {
                    "bg-green-2": marketCapDetails?.marketCapPercentage > 0,
                    "bg-red-2": marketCapDetails?.marketCapPercentage < 0,
                    "bg-grey-2": marketCapDetails?.marketCapPercentage === 0,
                  },
                  "w-full lg:w-64"
                )}
                percent={marketCapDetails?.marketCapPercentage || "0"}
                amount={formatNumber(parseFloat(marketCapDetails?.marketCap))}
                title={t("marketcap")}
              />
              <MarketStats
                bgColor={clsx(
                  {
                    "bg-green-2": marketCapDetails?.vol24Percentage > 0,
                    "bg-red-2": marketCapDetails?.vol24Percentage < 0,
                    "bg-grey-2": marketCapDetails?.vol24Percentage === 0,
                  },
                  "w-full lg:w-64"
                )}
                percent={marketCapDetails?.vol24Percentage || "0"}
                amount={formatNumber(parseFloat(marketCapDetails.vol24))}
                title={t("volume")}
              />
              <MarketStats
                bgColor={clsx(
                  {
                    "bg-green-2": marketCapDetails.BTCDominancePercentage > 0,
                    "bg-red-2": marketCapDetails.BTCDominancePercentage < 0,
                    "bg-grey-2": marketCapDetails.BTCDominancePercentage === 0,
                  },
                  "w-full lg:w-64"
                )}
                percent={marketCapDetails.BTCDominancePercentage}
                amount={`${formatNumber(
                  parseFloat(marketCapDetails.BTCDominance)
                )}%`}
                title={t("btcDominance")}
              />
            </Row>
          ) : null} */}
          <SearchInput
            onchange={(e: string) => setSearch(e)}
            placeholder={t("search")}
          />
        </Col>
        <Row className="gap-0.5 justify-end pb-2 pt-6 w-full">
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
