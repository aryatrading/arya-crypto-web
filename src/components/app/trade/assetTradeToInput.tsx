import { FC, useMemo } from "react";
import { Col, Row } from "../../shared/layout/flex";
import { useDispatch, useSelector } from "react-redux";
import { getFrom, getTo, setTo } from "../../../services/redux/swapSlice";
import { formatNumber } from "../../../utils/helpers/prices";
import { selectAssetLivePrice } from "../../../services/redux/marketSlice";
import { useTranslation } from "next-i18next";
import { AssetDropdown } from "../../shared/assetDropdown";
import { useRouter } from "next/router";

const AssetTradeToInput: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["asset"]);
  const router = useRouter();
  const { symbol } = router.query;
  const asset = useSelector(getTo);
  const fromAsset = useSelector(getFrom);
  const _assetprice = useSelector(selectAssetLivePrice);

  const qty = useMemo(() => {
    return (
      (fromAsset.quantity *
        _assetprice[fromAsset?.symbol?.toLowerCase() ?? "btc"]) /
      _assetprice[asset?.symbol?.toLowerCase() ?? "btc"]
    );
  }, [fromAsset.quantity, asset.symbol]);

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

      <Row className="flex justify-between">
        <p className="font-medium text-base">{formatNumber(qty)}</p>
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
            />
          )}
        </Row>
      </Row>
    </Col>
  );
};

export default AssetTradeToInput;
