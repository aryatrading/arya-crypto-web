import { FC, useEffect, useState } from "react";
import { Col, Row } from "../../shared/layout/flex";
import { ShadowButton } from "../../shared/buttons/shadow_button";
import { AssetDropdown } from "../../shared/assetDropdown";
import { useTranslation } from "next-i18next";
import { formatNumber } from "../../../utils/helpers/prices";
import {
  getFrom,
  getProvider,
  setFrom,
} from "../../../services/redux/swapSlice";
import { useDispatch, useSelector } from "react-redux";
import { getFree } from "../../../services/controllers/asset";
import LoadingSpinner from "../../shared/loading-spinner/loading-spinner";
import clsx from "clsx";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuthUser } from "next-firebase-auth";

const inputClasses =
  "font-medium text-white bg-transparent flex-1 h-5 w-5 border-transparent";

const AssetTradeFromInput: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["asset"]);
  const router = useRouter();
  const { s } = router.query;
  const asset = useSelector(getFrom);
  const provider = useSelector(getProvider);
  const [loading, setLoading] = useState(false);
  const authUser = useAuthUser();

  useEffect(() => {
    if (asset?.symbol) {
      onFromSelect(asset);
    }
  }, [asset.symbol, s]);

  const onFromSelect = async (elm: any) => {
    setLoading(true);
    if(authUser.id){
      let { data } = await getFree(
        elm?.symbol?.toUpperCase(0) ?? "btc",
        provider
      );

      dispatch(
        setFrom({
          symbol: elm.symbol.toUpperCase(),
          price: elm.currentPrice,
          quantity: 0,
          iconUrl: elm.iconUrl,
          availableBalance: data?.free ?? 0,
        })
      );
    }
    setLoading(false);
  };

  const onMaxPress = () => {
    if (!provider) {
      return toast.info("Please select a provider");
    }
    dispatch(setFrom({ ...asset, quantity: asset.availableBalance }));
  };

  return (
    <Col className="bg-black-1 rounded-md px-4 py-2 gap-4 w-full">
      <Row className="flex justify-between">
        <p className="font-medium text-base">{t("from_title")}</p>
        <p className="font-medium text-base">
          {t("balance_title")}: {formatNumber(asset.availableBalance)}{" "}
          {asset.symbol}
        </p>
      </Row>

      <Row className="items-center">
        <input
          className={clsx(inputClasses)}
          value={asset.quantity ?? 0}
          placeholder={asset.quantity}
          onChange={(e) =>
            dispatch(setFrom({ ...asset, quantity: e.target.value }))
          }
        />
        <Row className="gap-2 items-center">
          <ShadowButton
            title={t("max_title")}
            onClick={onMaxPress}
            py="py-1"
            border="rounded-md"
            bgColor="bg-transparent"
            textColor="text-blue-2"
          />
          {asset.iconUrl ? (
            <img
              className="w-5 h-5 rounded-full"
              src={asset.iconUrl ?? ""}
              alt="new"
            />
          ) : null}
          {loading ? (
            <LoadingSpinner />
          ) : s === asset?.symbol?.toLowerCase() ? (
            <p>{asset.symbol}</p>
          ) : (
            <AssetDropdown
              onClick={(data: any) => {
                if (!provider) {
                  return toast.info("Please select a provider");
                }
                onFromSelect(data);
              }}
              align="end"
              t={t}
              disabled={false}
              title={asset.symbol ?? t("selectAsset")}
              removeAsset={s}
              showContentHeaderLabel={false}
            />
          )}
        </Row>
      </Row>
    </Col>
  );
};

export default AssetTradeFromInput;
