import { ChangeEventHandler, useCallback, useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import clsx from "clsx";

import { Col, Row } from "../layout/flex";
import { ConvertButtonIcon } from "../../svg/convert-CTA";
import Button from "../buttons/button";
import { AssetType } from "../../../types/asset";
import LoadingSpinner from "../loading-spinner/loading-spinner";
import { converterTop6Coins, usdt } from "../../../utils/constants/defaultConverterList";
import { AssetDropdown } from "../assetDropdown";

const inputClasses = "font-medium text-white bg-transparent flex-1 h-[40px] pl-4 mr-12 border-transparent";

const numericInput = (value: string | number, onChange: ChangeEventHandler, disabled: boolean) => {
    return (
        <input className={clsx({ "cursor-not-allowed": disabled }, inputClasses)} type="number" value={value} placeholder="0" onChange={onChange} disabled={disabled} />
    )
};

interface CoinConverterTypes {
    preDefined?: boolean;
    staticCoin?: any;
}

export const CoinConverter = (props: CoinConverterTypes) => {
    const { t } = useTranslation(["coin"]);
    const { assetLivePrice } = useSelector(({ market }: any) => market);

    const [firstCoin, setFirstCoin] = useState<AssetType>(props?.staticCoin);
    const [secondCoin, setSecondCoin] = useState<AssetType>();
    const [firstCoinAmount, setFirstCoinAmount] = useState<string | number>('');
    const [secondCoinAmount, setSecondCoinAmount] = useState<string | number>('');

    const convertValues = useCallback((amount: number, currentPrice1: number, currentPrice2: number) => {
        return amount * (currentPrice1 / currentPrice2);
    }, []);

    const onChnageFirstCoinAmount = useCallback((event: any) => {
        const value = event.target.value;
        setFirstCoinAmount(value);
        if (value === '') {
            setSecondCoinAmount('');
        } else {
            if (firstCoin?.name === secondCoin?.name) {
                setSecondCoinAmount(value);
                return;
            } else {
                setSecondCoinAmount(convertValues(parseFloat(value || 0), firstCoin?.currentPrice || 0, secondCoin?.currentPrice || 0));
            }
        }
    }, [convertValues, firstCoin, secondCoin]);

    const onChnageSecondCoinAmount = useCallback((event: any) => {
        const value = event.target.value;
        setSecondCoinAmount(value);
        if (value === '') {
            setFirstCoinAmount('');
        } else {
            if (firstCoin?.name === secondCoin?.name) {
                setFirstCoinAmount(value);
                return;
            } else {
                setFirstCoinAmount(convertValues(parseFloat(value || 0), secondCoin?.currentPrice || 0, firstCoin?.currentPrice || 0));
            }
        }
    }, [convertValues, firstCoin, secondCoin]);

    const defaultList = useMemo(() => converterTop6Coins.map(e => {
        const second = { ...usdt, currentPrice: assetLivePrice?.[usdt.symbol] };
        const onClick = () => {
            if (!props.preDefined) {
                const currentPrice = assetLivePrice?.[e.symbol];
                const first = { ...e, currentPrice: currentPrice };
                setFirstCoin(first);
                setSecondCoin(second);
            } else {
                const currentPrice = assetLivePrice?.[e.symbol];
                setSecondCoin({ ...e, currentPrice: currentPrice });
                if (e?.name === firstCoin?.name) {
                    setSecondCoinAmount(firstCoinAmount);
                } else {
                    setSecondCoinAmount(convertValues(parseFloat(firstCoinAmount.toString()), firstCoin?.currentPrice || 0, currentPrice || 0));
                }
            }
        }
        return (
            <Button key={e.symbol} className="btn bg-grey-3 rounded-md hover:bg-grey-4" onClick={onClick}>
                <label className="block text-sm text-white font-medium">{props.preDefined ? firstCoin?.name + ' > ' + e?.name : e?.name + ' > ' + usdt?.name}</label>
            </Button>
        );
    }), [assetLivePrice, convertValues, firstCoin?.currentPrice, firstCoin?.name, firstCoinAmount, props.preDefined]);

    return (
        <Col className="items-start w-full gap-10">
            <h3 className="font-extrabold text-white header-label">{t('cryptoConverter')}</h3>
            <Row className="container  gap-12 w-full bg-grey-2 rounded-md px-10 py-4 flex-wrap">
                <Col className="flex-[0.8] justify-center gap-6">
                    <Row className="gap-4 items-center">
                        <AssetDropdown
                            onClick={(data: any) => {
                                setFirstCoin(data);
                                setSecondCoinAmount(convertValues(parseFloat(firstCoinAmount.toString()), data?.currentPrice || 0, secondCoin?.currentPrice || 0));
                            }}
                            t={t}
                            disabled={props?.preDefined}
                            title={firstCoin?.name}
                        />
                        {numericInput(firstCoinAmount, onChnageFirstCoinAmount, !firstCoin?.name || !secondCoin?.name)}
                    </Row>
                    <Row className="relative">
                        <Row className="w-full h-1 bg-black-1" />
                        <Button className="absolute right-0 bottom-[-22px]" disabled>
                            <ConvertButtonIcon />
                        </Button>
                    </Row>
                    <Row className="gap-4 items-center">
                        <AssetDropdown
                            onClick={(data: any) => {
                                setSecondCoin(data);
                                setSecondCoinAmount(convertValues(parseFloat(firstCoinAmount.toString()), firstCoin?.currentPrice || 0, data?.currentPrice || 0));
                            }}
                            t={t}
                            title={secondCoin?.name}
                        />
                        {numericInput(secondCoinAmount, onChnageSecondCoinAmount, !secondCoin?.name || !secondCoin?.name)}
                    </Row>
                </Col>
                <Col className="flex-1">
                    {assetLivePrice?.[usdt.symbol] != null ?
                        <Row className="grid grid-cols-3 gap-4">
                            {defaultList}
                        </Row>
                        : <LoadingSpinner />}
                </Col>
            </Row>
        </Col>
    );
};

export default CoinConverter;