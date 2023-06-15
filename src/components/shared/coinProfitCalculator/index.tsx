import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CurrencyDollarIcon, MagnifyingGlassIcon, ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import { Col, Row } from "../layout/flex";
import Button from "../buttons/button";
import CloseIcon from "../../svg/Shared/CloseIcon";
import { SearchAssetInput } from "../assetSearchInputWithDropdown";
import AssetPnl from "../containers/asset/assetPnl";
import { twMerge } from "tailwind-merge";

const Input = ({ icon, placeholder, value, onClear, type = "number", ...rest }: any) => (
    <Row className="bg-grey-3 w-full h-[50px] rounded-md px-4 gap-2 relative">
        {icon}
        <input className="font-bold text-base text-white bg-transparent flex-1 pl-2 focus:ring-0 border-0" value={value} type={type} placeholder={placeholder} {...rest} />
        {!!value && <Button className="absolute right-3 bottom-[14px] bg-grey-3 px-1.5 py-1.5 rounded-xl" onClick={onClear}>
            <CloseIcon className="stroke-current text-[#89939F] w-2 h-2" />
        </Button>}
    </Row>
);

export const CoinProfitCalculator = () => {
    const { t } = useTranslation(["coin", "asset"]);
    const [buyPrice, setBuyPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [investment, setInvestment] = useState('');
    const [profit, setProfit] = useState(0);
    const [totalExitAmount, setTotalExitAmount] = useState(0);

    const ref = useRef<any>();

    useEffect(() => {
        const xProfit = ((parseFloat(investment) || 0) / (parseFloat(buyPrice) || 1)) * ((parseFloat(sellPrice) || 0) - (parseFloat(buyPrice) || 0));
        setProfit(xProfit);

        const xTotalExitAmount = ((parseFloat(investment) || 0) / (parseFloat(buyPrice) || 1) * (parseFloat(sellPrice) || 0));
        setTotalExitAmount(xTotalExitAmount);
    }, [buyPrice, sellPrice, investment]);

    const totalProfitPercentage = useMemo(() => (((totalExitAmount || 0) - (parseFloat(investment) || 0)) / (parseFloat(investment) || 1)) * 100, [investment, totalExitAmount]);

    const updateInputs = useCallback((value: string, type: 'inv' | 'buy' | 'sell') => {
        switch (type) {
            case "inv":
                return setInvestment(value);
            case 'buy':
                return setBuyPrice(value);
            case 'sell':
                return setSellPrice(value);
            default:
                return null;
        }
    }, []);

    const onClear = useCallback((type: 'inv' | 'buy' | 'sell') => {

        switch (type) {
            case "inv":
                return setInvestment('');
            case 'buy':
                return setBuyPrice('');
            case 'sell':
                return setSellPrice('');
            default:
                return null;
        }
    }, []);

    const customInput = useCallback(({ debouncedSearch, searchTerm, setSearchTerm, setFocused }: any) => (
        <Row className="bg-grey-3 w-full h-[50px] rounded-md px-4 gap-2 relative justify-center">
            <MagnifyingGlassIcon width="24px" color="#6B7280" />
            <input
                ref={ref}
                className="font-bold text-base text-white bg-transparent flex-1 pl-2 focus:ring-0 border-0"
                onChange={debouncedSearch}
                placeholder={t('coin').toString()}
                type="text"
                onFocus={() => setFocused(true)}
                onBlur={() => {
                    if (searchTerm !== '') {
                        return;
                    }
                    setTimeout(() => setFocused(false), 200);
                }} />
            {(searchTerm !== '' || ref?.current?.value || ref?.current?.value !== '') && <Button
                className="absolute right-3 bottom-[14px] bg-grey-3 px-1.5 py-1.5 rounded-xl"
                onClick={() => {
                    setFocused(false);
                    setSearchTerm('');
                    ref.current.value = '';
                }}>
                <CloseIcon className="stroke-current text-[#89939F] w-2 h-2" />
            </Button>}
        </Row>
    ), [t]);

    const onClick = useCallback((data: any) => {
        ref.current.value = data.name;
        setBuyPrice(data.currentPrice.toString());
        setSellPrice(data.currentPrice.toString());
    }, []);

    return (
        <Col className="gap-6 w-full items-center md:flex-row ">
            <Col className="gap-6 flex-1 w-full">
                <Row className="w-full gap-6">
                    <Row className="w-full gap-6 md:flex-nowrap flex-wrap">
                        <Col className="w-full md:w-1/2 gap-6">
                            <SearchAssetInput trigger={customInput} t={t} onClick={onClick} />

                            <Input onChange={({ target: { value } }: any) => updateInputs(value, 'inv')} value={investment} placeholder={t('investment')} icon={<CurrencyDollarIcon width="24px" color="#6B7280" />} onClear={() => onClear('inv')} />
                        </Col>
                        <Col className="w-full md:w-1/2 gap-6">
                            <Input onChange={({ target: { value } }: any) => updateInputs(value, 'buy')} value={buyPrice} placeholder={t('buyPrice')} icon={<ArrowDownCircleIcon width="24px" color="#6B7280" />} onClear={() => onClear('buy')} />
                            <Input onChange={({ target: { value } }: any) => updateInputs(value, 'sell')} value={sellPrice} placeholder={t('sellPrice')} icon={<ArrowUpCircleIcon width="24px" color="#6B7280" />} onClear={() => onClear('sell')} />
                        </Col>
                    </Row>
                </Row>
            </Col>
            <Row className="bg-grey-3 gap-20 md:gap-3 rounded-md p-4 text-sm font-semibold w-full  items-center md:w-auto md:flex-col sm:items-start">
                <Col className="gap-4 sm:flex-row">
                    <Col className="gap-2">
                        <label>{t('totalInvestmentAmount')}</label>
                        <p className={profit < 0 ? "text-red-1" : "text-green-1"}>${investment !== '' ? parseFloat(investment).toFixed(2) : '0.00'}</p>
                    </Col>
                    <Col className="gap-2">
                        <label>{t('totalExitAmount')}</label>
                        <p className={profit < 0 ? "text-red-1" : "text-green-1"}>${totalExitAmount.toFixed(2)}</p>
                    </Col>
                </Col>
                <Col className="gap-1 justify-start">
                    <label>{t('profit/loss')}</label>
                    <Row className="items-center gap-2 justify-start">
                        <AssetPnl className={twMerge('px-0', profit < 0 ? " text-red-1" : " text-green-1")} value={Math.round(profit * 1e2) / 1e2 || 0} />
                        <AssetPnl className={totalProfitPercentage < 0 ? "bg-red-2 text-red-1" : "bg-green-2 text-green-1"} value={Math.round(totalProfitPercentage * 1e2) / 1e2 || 0} />
                    </Row>
                </Col>

            </Row>
        </Col>
    );
};

export default CoinProfitCalculator;