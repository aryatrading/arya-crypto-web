import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { CurrencyDollarIcon, MagnifyingGlassIcon, ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';

import { Col, Row } from "../layout/flex";
import { ChevronUp } from "../../svg/chevron-up";
import { ChevronDown } from "../../svg/chevron-down";
import Button from "../buttons/button";
import { CloseIcon } from "../../svg/close";

const Input = ({ icon, placeholder, value, onClear, ...rest }: any) => (
    <Row className="bg-grey-3 w-full h-[50px] rounded-md px-4 gap-2 relative">
        {icon}
        <input className="font-bold text-base text-white bg-transparent flex-1 pl-2 focus:ring-0 border-0" value={value} type="number" placeholder={placeholder} {...rest} />
        {!!value && <Button className="absolute right-3 bottom-[14px] bg-grey-3 px-1.5 py-1.5 rounded-xl" onClick={onClear}>
            <CloseIcon />
        </Button>}
    </Row>
);

export const CoinProfitCalculator = () => {
    const { t } = useTranslation(["coin"]);
    const [coin, setCoin] = useState();
    const [buyPrice, setBuyPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [investment, setInvestment] = useState('');
    const [profit, setProfit] = useState(0);
    const [totalExitAmount, setTotalExitAmount] = useState(0);

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

    return (
        <Col className="container gap-6 w-full items-center lg:flex-row">
            <Col className="gap-6 flex-1 w-full">
                <Row className="w-full gap-6">
                    <Row className="w-full gap-6 md:flex-nowrap flex-wrap">
                        <Col className="w-full md:w-1/2 gap-6">
                            <Input icon={<MagnifyingGlassIcon width="24px" color="#6B7280" />} placeholder={t('coin').toString()} />

                            <Input onChange={({ target: { value } }: any) => updateInputs(value, 'inv')} value={investment} placeholder={t('investment')} icon={<CurrencyDollarIcon width="24px" color="#6B7280" />} onClear={() => onClear('inv')} />
                        </Col>
                        <Col className="w-full md:w-1/2 gap-6">
                            <Input onChange={({ target: { value } }: any) => updateInputs(value, 'buy')} value={buyPrice} placeholder={t('buyPrice')} icon={<ArrowDownCircleIcon width="24px" color="#6B7280" />} onClear={() => onClear('buy')} />
                            <Input onChange={({ target: { value } }: any) => updateInputs(value, 'sell')} value={sellPrice} placeholder={t('sellPrice')} icon={<ArrowUpCircleIcon width="24px" color="#6B7280" />} onClear={() => onClear('sell')} />
                        </Col>
                    </Row>
                </Row>
            </Col>
            <Col className="border w-[300px] rounded-md border-grey-3 px-4 py-6 gap-4 self-start">
                <Row className="gap-10">
                    <Col>
                        <label className="text-base text-white font-bold">{t('totalInvestmentAmount')}</label>
                        <Row className={"rounded-md items-center gap-1 h-[50px]"}>
                            <p className={clsx({ "text-green-1": profit >= 0, "text-red-1": profit < 0 }, "block text-lg text-green-1 font-bold")}>${investment !== '' ? parseFloat(investment).toFixed(2) : '0.00'}</p>
                        </Row>
                    </Col>
                    <Col>
                        <label className="text-base text-white font-bold">{t('totalExitAmount')}</label>
                        <Row className={"rounded-md items-center gap-1 h-[50px]"}>
                            <p className={clsx({ "text-green-1": profit >= 0, "text-red-1": profit < 0 }, "block text-lg text-green-1 font-bold")}>${totalExitAmount.toFixed(2)}</p>
                        </Row>
                    </Col>
                </Row>
                <label className="text-base text-white font-bold">{t('profit/loss')}</label>
                <Row className={"h-1/5 max-w-[315px] rounded-md  items-center gap-1"}>
                    {profit >= 0 ? <ChevronUp /> :
                        <ChevronDown />}
                    <p className={clsx({ "text-green-1 ": profit >= 0, "text-red-1": profit < 0 }, "block text-lg text-green-1 font-bold")}>${profit.toFixed(2)} <span className={clsx({ "text-green-1 bg-green-2": profit >= 0, "text-red-1 bg-red-2": profit < 0 }, 'px-4 py-2')}>({totalProfitPercentage.toFixed(2)}%)</span></p>
                </Row>
            </Col>
        </Col>
    );
};

export default CoinProfitCalculator;