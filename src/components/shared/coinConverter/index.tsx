import { ChangeEventHandler, ChangeEvent, useCallback, useEffect, useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Image from "next/image";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";

import { Col, Row } from "../layout/flex";
import { ConvertButtonIcon } from "../../svg/convert-CTA";
import Button from "../buttons/button";
import { fetchAssets } from "../../../services/controllers/market";
import { AssetType } from "../../../types/asset";
import LoadingSpinner from "../loading-spinner/loading-spinner";
import { toast } from "react-toastify";
import clsx from "clsx";
import { converterTop6Coins, usdt } from "../../../utils/constants/defaultConverterList";

const inputClasses = "font-medium text-white bg-transparent flex-1 h-[40px] pl-4 mr-12";

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
    const [coins, setCoins] = useState<AssetType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [firstCoin, setFirstCoin] = useState<AssetType>(props?.staticCoin);
    const [secondCoin, setSecondCoin] = useState<AssetType>();
    const [firstCoinAmount, setFirstCoinAmount] = useState<string | number>('');
    const [secondCoinAmount, setSecondCoinAmount] = useState<string | number>('');
    const [keyword, setKeyword] = useState<string>('');

    const convertValues = useCallback((amount: number, currentPrice1: number, currentPrice2: number) => {
        return amount * (currentPrice1 / currentPrice2);
    }, []);

    useEffect(() => {
        fetchAssets(keyword, "50").then((response: AssetType[]) => {
            setCoins(response);
            setLoading(false);
        }).catch((err) => {
            toast.error(err);
            setLoading(false);
        })
    }, [firstCoin?.id, keyword, secondCoin?.id]);

    const onChangeKeyword = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCoins([]);
        setLoading(true);
        setKeyword(event.target.value);
    }, []);

    const dropdownItem = useCallback((data: any, addTo?: 'first' | 'second') => {
        return (
            <DropdownMenu.Item
                key={data.id}
                id={data.id + '_' + data?.name}
                className={"h-12 py-1 px-4 cursor-pointer bg-grey-4"}
                onClick={() => {
                    if (addTo === 'first') {
                        setFirstCoin(data);
                        setSecondCoinAmount(convertValues(parseFloat(firstCoinAmount.toString()), data?.currentPrice || 0, secondCoin?.currentPrice || 0));
                    } else if (addTo === 'second') {
                        setSecondCoin(data);
                        setSecondCoinAmount(convertValues(parseFloat(firstCoinAmount.toString()), firstCoin?.currentPrice || 0, data?.currentPrice || 0));
                        return;
                    } else {
                        return;
                    }
                }}
            >
                <Row className="items-center gap-3 h-full">
                    <Image src={data.iconUrl} alt={data?.name?.toLocaleLowerCase() + "_icon"} width={22} height={22} />
                    <Row className="gap-2 items-center">
                        <p className="capitalize font-extrabold text-sm">{data?.name}</p>
                        <p className="capitalize font-medium text-xs">{data?.symbol}</p>
                    </Row>
                </Row>
            </DropdownMenu.Item>
        )
    }, [convertValues, firstCoin?.currentPrice, firstCoinAmount, secondCoin?.currentPrice])

    const dropdown = useCallback((title: string, disabled?: boolean, addTo?: 'first' | 'second') => {
        return (
            <DropdownMenu.Root
                onOpenChange={(opened) => {
                    if (!opened) {
                        setKeyword('');
                    }
                }}>
                <DropdownMenu.Trigger asChild disabled={disabled}>
                    <button aria-label="Customise options" disabled={disabled} className="active:outline-none">
                        <Row className="gap-4 items-center">
                            <h3 className="font-extrabold text-white">{title}</h3>
                            {!disabled && <ChevronDownIcon height="20px" width="20px" color="#fff" />}
                        </Row>
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal className="z-10">
                    <DropdownMenu.Content className="min-w-[400px] bg-grey-4 rounded-md z-10 max-h-[340px] overflow-scroll" sideOffset={15}>
                        <Col className="gap-4 p-4 mb-3 absolute bg-grey-4 w-full">
                            <h3 className="font-extrabold text-white text-xl">{t('selectAsset')}</h3>
                            <Row className="bg-grey-3 w-full h-[40px] rounded-sm px-4">
                                <MagnifyingGlassIcon width="20px" color="#6B7280" />
                                <input id="assets search" className="font-bold text-sm text-white bg-transparent flex-1 pl-2 focus:outline-none" type="text" value={keyword} placeholder={t('searchAsset').toString()} onChange={onChangeKeyword} />
                            </Row>
                        </Col>
                        <Col className="mt-[120px]">
                            {coins?.map(coin => dropdownItem(coin, addTo))}
                            {coins.length === 0 && (
                                loading ?
                                    <Col className="mb-8">
                                        <LoadingSpinner />
                                    </Col>
                                    :
                                    <h3 className="text-center text-base font-bold text-white mb-4">{t('emptySearch')}</h3>)}
                        </Col>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        );
    }, [coins, dropdownItem, keyword, loading, onChangeKeyword, t]);

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
                        {dropdown(firstCoin?.name || "Coins", props?.preDefined, 'first')}
                        {numericInput(firstCoinAmount, onChnageFirstCoinAmount, !firstCoin?.name || !secondCoin?.name)}
                    </Row>
                    <Row className="relative">
                        <Row className="w-full h-1 bg-black-1" />
                        <Button className="absolute right-0 bottom-[-22px]" disabled>
                            <ConvertButtonIcon />
                        </Button>
                    </Row>
                    <Row className="gap-4 items-center">
                        {dropdown(secondCoin?.name || "Coins", false, 'second')}
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