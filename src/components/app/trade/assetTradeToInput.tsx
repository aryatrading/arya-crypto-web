import { FC } from "react";
import { Col, Row } from "../../shared/layout/flex";
import { useDispatch, useSelector } from "react-redux";
import {
  getFrom,
  getTo,
  setFrom,
  setTo,
} from "../../../services/redux/swapSlice";
import { formatNumber } from "../../../utils/helpers/prices";
import { selectAssetLivePrice } from "../../../services/redux/marketSlice";
import { useTranslation } from "next-i18next";
import { AssetDropdown } from "../../shared/assetDropdown";
import { useRouter } from "next/router";
import clsx from "clsx";

const inputClasses =
  "font-medium text-white bg-transparent flex-1 h-5 w-2 border-transparent";

const AssetTradeToInput: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["asset"]);
  const router = useRouter();
  const { symbol } = router.query;
  const asset = useSelector(getTo);
  const fromAsset = useSelector(getFrom);
  const _assetprice = useSelector(selectAssetLivePrice);

  const qty =
    (fromAsset.quantity *
      _assetprice[fromAsset?.symbol?.toLowerCase() ?? "btc"]) /
    _assetprice[asset?.symbol?.toLowerCase() ?? "btc"];

  const onchangeInput = (value: number) => {
    let _value =
      (value * _assetprice[asset?.symbol?.toLowerCase() ?? "btc"]) /
      _assetprice[fromAsset?.symbol?.toLowerCase() ?? "btc"];
    console.log(_value);
    dispatch(setFrom({ ...fromAsset, quantity: _value }));
  };

  return (
    <Col className="bg-black-1 rounded-md px-4 py-2 gap-4 w-full">
      <Row className="flex justify-between">
        <p className="font-medium text-base">To</p>
        <p className="font-medium text-base text-grey-1">
          Price ~{" "}
          {formatNumber(
            _assetprice[asset.symbol?.toLowerCase() ?? "btc"] ?? asset.price,
            true
          )}
        </p>
      </Row>

      <Row className="flex justify-between gap-10">
        <input
          className={clsx(inputClasses)}
          value={formatNumber(qty)}
          maxLength={8}
          placeholder={formatNumber(qty)}
          onChange={(e) => onchangeInput(parseInt(e.target.value))}
        />
        <Row className="gap-2 items-center">
          <img className="w-5 h-5 rounded-full" src={asset.iconUrl} alt="new" />
          {symbol === asset?.symbol?.toLowerCase() ? (
            <p>{asset.symbol}</p>
          ) : (
            <AssetDropdown
              onClick={(data: any) => {
                dispatch(
                  setTo({
                    price: data.currentPrice,
                    quantity: 0,
                    symbol: data.symbol.toUpperCase(),
                    iconUrl: data.iconUrl,
                  })
                );
              }}
              t={t}
              disabled={false}
              title={asset.symbol}
              removeAsset={symbol}
            />
          )}
        </Row>
      </Row>
    </Col>
  );
};

export default AssetTradeToInput;
