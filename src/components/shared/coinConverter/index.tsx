import { ChangeEventHandler, useCallback, useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import clsx from "clsx";

import { Col, Row } from "../layout/flex";
import Button from "../buttons/button";
import { AssetType } from "../../../types/asset";
import LoadingSpinner from "../loading-spinner/loading-spinner";
import { converterTop6Coins, usdt } from "../../../utils/constants/defaultConverterList";
import { AssetDropdown } from "../assetDropdown";

const inputClasses = "font-medium text-white bg-transparent flex-1 h-[40px] pl-4 mr-12 border-transparent focus:ring-0 focus:border-0 focus:outline-none";

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
    const [secondCoin, setSecondCoin] = useState<AssetType>({ ...usdt, currentPrice: assetLivePrice?.[usdt.symbol] || 1 });
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
            <Button key={e.symbol} className="bg-blue-3 rounded-md hover:bg-grey-4 w-full px-5 py-2.5 lg:py-0 lg:px-0 h-full xl:font-sm font-xs font-medium" onClick={onClick}>
                {props.preDefined ? firstCoin?.symbol?.toUpperCase() + ' > ' + e?.symbol.toUpperCase() : e?.symbol.toUpperCase() + ' > ' + usdt?.symbol.toUpperCase()}
            </Button>
        );
    }), [assetLivePrice, convertValues, firstCoin, firstCoinAmount, props.preDefined]);

    return (
        <Col className="items-start w-full gap-4">
            <h3 className="asset-header">{t('cryptoConverter')}</h3>
            {assetLivePrice?.[usdt.symbol] != null ?
                <>
                    <Row className="flex-col gap-5 bg-transparent rounded-md lg:flex-row items-start justify-start w-full">
                        <Col className="justify-center gap-4 w-full lg:w-3/5">
                            <Row className="gap-4 items-center bg-blue-3 px-4 rounded-md">
                                <AssetDropdown
                                    onClick={(data: any) => {
                                        setFirstCoin(data);
                                        setSecondCoinAmount(convertValues(parseFloat(firstCoinAmount.toString()), data?.currentPrice || 0, secondCoin?.currentPrice || 0));
                                    }}
                                    t={t}
                                    disabled={props?.preDefined}
                                    title={firstCoin?.symbol}
                                />
                                <Col className="h-[40px] w-[4px] bg-black-1" />
                                {numericInput(firstCoinAmount, onChnageFirstCoinAmount, !firstCoin?.name || !secondCoin?.name)}
                            </Row>
                            <Row className="gap-4 items-center bg-blue-3 px-4 rounded-md">
                                <AssetDropdown
                                    onClick={(data: any) => {
                                        setSecondCoin(data);
                                        setSecondCoinAmount(convertValues(parseFloat(firstCoinAmount.toString()), firstCoin?.currentPrice || 0, data?.currentPrice || 0));
                                    }}
                                    t={t}
                                    title={secondCoin?.symbol}
                                />
                                <Col className="h-[40px] w-[4px] bg-black-1" />
                                {numericInput(secondCoinAmount, onChnageSecondCoinAmount, !secondCoin?.name || !secondCoin?.name)}
                            </Row>
                        </Col>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full justify-items-start lg:w-2/5 h-full">
                            {defaultList}
                        </div>
                    </Row>
                </>
                : <LoadingSpinner />}
        </Col>
    );
};

export default CoinConverter;