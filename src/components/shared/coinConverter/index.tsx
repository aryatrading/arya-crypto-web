import { ChangeEventHandler, useCallback, useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import clsx from "clsx";

import { Col, Row } from "../layout/flex";
import Button from "../buttons/button";
import { AssetType } from "../../../types/asset";
import { converterTop6Coins, usdt } from "../../../utils/constants/defaultConverterList";
import { AssetDropdown } from "../assetDropdown";
import { TextSkeleton } from "../skeletons/skeletons";
import { ConverterIcon } from "../../svg/converter";

const inputClasses = "font-bold text-white bg-transparent flex-1 h-[50px] pl-4 mr-12 border-transparent focus:ring-0 focus:border-0 focus:outline-none";

const numericInput = (value: string | number, onChange: ChangeEventHandler, disabled: boolean) => {
    return (
        <input className={clsx({ "cursor-not-allowed": disabled }, inputClasses)} type="number" value={value} placeholder="0" onChange={onChange} disabled={disabled} />
    )
};

interface CoinConverterTypes {
    preDefined?: boolean;
    staticCoin?: any;
    isFullPage?: boolean;
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
            <Button key={e.symbol} className="bg-grey-3 rounded-md text-grey-1 hover:text-white hover:bg-grey-4 w-full px-5 py-2.5 lg:py-0 lg:px-2 xl:font-sm  font-xs font-bold h-[50px]" onClick={onClick}>
                {props.preDefined ? firstCoin?.symbol?.toUpperCase() + ' > ' + e?.symbol.toUpperCase() : e?.symbol.toUpperCase() + ' > ' + usdt?.symbol.toUpperCase()}
            </Button>
        );
    }), [assetLivePrice, convertValues, firstCoin, firstCoinAmount, props.preDefined]);

    const coinConverterSkeleton = useMemo(() => {
        if (props.isFullPage) {
            return (
                <Col className="flex-col gap-5 bg-transparent rounded-md items-center justify-center w-full">
                    <div className="flex flex-row gap-4 w-full justify-items-start h-full">
                        <TextSkeleton widthClassName="w-full" />
                        <TextSkeleton widthClassName="w-full" />
                        <TextSkeleton widthClassName="w-full" />
                        <TextSkeleton widthClassName="w-full" />
                        <TextSkeleton widthClassName="w-full" />
                        <TextSkeleton widthClassName="w-full" />
                    </div>
                    <Col className="justify-center gap-4 w-full lg:w-3/5">
                        <Row className="gap-4 items-center rounded-md">
                            <TextSkeleton widthClassName="w-20" />
                            <TextSkeleton widthClassName="w-full" />
                        </Row>
                        <Row className="gap-4 items-center rounded-md">
                            <TextSkeleton widthClassName="w-20" />
                            <TextSkeleton widthClassName="w-full" />
                        </Row>
                    </Col>
                </Col>
            );
        } else {
            return (
                <Col className="flex-col gap-5 bg-transparent rounded-md lg:flex-row items-start justify-start w-full">
                    <Col className="justify-center gap-4 w-full lg:w-3/5">
                        <Row className="gap-4 items-center rounded-md">
                            <TextSkeleton widthClassName="w-20" />
                            <TextSkeleton widthClassName="w-full" />
                        </Row>
                        <Row className="gap-4 items-center rounded-md">
                            <TextSkeleton widthClassName="w-20" />
                            <TextSkeleton widthClassName="w-full" />
                        </Row>
                    </Col>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full justify-items-start lg:w-2/5 h-full">
                        <TextSkeleton widthClassName="w-full" />
                        <TextSkeleton widthClassName="w-full" />
                        <TextSkeleton widthClassName="w-full" />
                        <TextSkeleton widthClassName="w-full" />
                        <TextSkeleton widthClassName="w-full" />
                        <TextSkeleton widthClassName="w-full" />
                    </div>
                </Col>
            )
        }
    }, [])

    return (
        <Col className={props.isFullPage ? "gap-10 items-center px-4 md:px-12 lg:px-20 xl:px-60 py-20 justify-center w-full" : "items-start w-full gap-6"}>
            {!props.isFullPage && <h3 className="asset-header">{t('cryptoConverter')}</h3>}
            {props.isFullPage &&
                <Col className='gap-4 items-center justify-center'>
                    <ConverterIcon className="mb-4" />
                    <h2 className='font-bold text-white text-4xl md:leading-snug text-center'>{t("coin:cryptoConverter")}</h2>
                    <p className="font-bold text-grey-1 text-xl md:leading-snug text-center">{t('preSelectConv')}</p>

                </Col>
            }
            {assetLivePrice?.[usdt.symbol] != null ?
                <>
                    <Row className={props.isFullPage ? "flex-col-reverse gap-6 bg-transparent rounded-md items-center justify-center w-full" : "flex-col gap-6 bg-transparent rounded-md lg:flex-row items-start justify-start w-full"}>
                        <Col className="justify-center gap-6 w-full lg:w-3/5">
                            {props.isFullPage && <h3 className="asset-header">{t('cryptoConverter')}</h3>}
                            <Row className="gap-4 items-center bg-grey-3 px-4 rounded-md">
                                <AssetDropdown
                                    onClick={(data: any) => {
                                        setFirstCoin(data);
                                        if (data?.name === secondCoin?.name) {
                                            setSecondCoinAmount(firstCoinAmount.toString());
                                            return;
                                        } else {
                                            setSecondCoinAmount(convertValues(parseFloat(firstCoinAmount.toString()), data?.currentPrice || 0, secondCoin?.currentPrice || 0));
                                        }
                                    }}
                                    t={t}
                                    disabled={props?.preDefined}
                                    title={firstCoin?.symbol?.toUpperCase()}
                                />
                                <Col className="h-[50px] w-[4px] bg-black-2" />
                                {numericInput(firstCoinAmount, onChnageFirstCoinAmount, !firstCoin?.name || !secondCoin?.name)}
                            </Row>
                            <Row className="gap-4 items-center bg-grey-3 px-4 rounded-md">
                                <AssetDropdown
                                    onClick={(data: any) => {
                                        setSecondCoin(data);
                                        if (data?.name === firstCoin?.name) {
                                            setSecondCoinAmount(firstCoinAmount.toString());
                                            return;
                                        } else {
                                            setSecondCoinAmount(convertValues(parseFloat(firstCoinAmount.toString()), firstCoin?.currentPrice || 0, data?.currentPrice || 0));
                                        }
                                    }}
                                    t={t}
                                    title={secondCoin?.symbol?.toUpperCase()}
                                />
                                <Col className="h-[50px] w-[4px] bg-black-2" />
                                {numericInput(secondCoinAmount, onChnageSecondCoinAmount, !secondCoin?.name || !secondCoin?.name)}
                            </Row>
                        </Col>
                        <div className={props.isFullPage ? "flex flex-row gap-4 w-full justify-items-start h-full mb-4" : "grid grid-cols-2 md:grid-cols-3 gap-6 w-full justify-items-start lg:w-2/5 h-full"}>
                            {defaultList}
                        </div>
                    </Row>
                </>
                : coinConverterSkeleton}
        </Col>
    );
};

export default CoinConverter;