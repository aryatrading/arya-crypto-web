import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";

import { Col, Row } from "../layout/flex";
import InputWithTag from "../form/inputs/inputWithTag/inputWithTag";
import { ChevronUp } from "../../svg/chevron-up";
import { ChevronDown } from "../../svg/chevron-down";

export const CoinProfitCalculator = () => {
    const { t } = useTranslation(["coin"]);
    const [coin, setCoin] = useState();
    const [buyPrice, setBuyPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [investment, setInvestment] = useState('');
    const [investmentFee, setInvestmentFee] = useState('');
    const [exitFee, setExitFee] = useState('');
    const [profit, setProfit] = useState(0);
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [totalExitAmount, setTotalExitAmount] = useState(0);

    useEffect(() => {
        const xProfit = ((parseFloat(investment) || 0) / (parseFloat(buyPrice) || 1)) * ((parseFloat(sellPrice) || 0) - (parseFloat(buyPrice) || 0)) - (parseFloat(investmentFee) || 0) - (parseFloat(exitFee) || 0);
        setProfit(xProfit);

        const xTotalInvestment = (parseFloat(investment) || 0) + (parseFloat(investmentFee) || 0);
        setTotalInvestment(xTotalInvestment);

        const xTotalExitAmount = ((parseFloat(investment) || 0) / (parseFloat(buyPrice) || 1) * (parseFloat(sellPrice) || 0)) - (parseFloat(exitFee) || 0);
        setTotalExitAmount(xTotalExitAmount);
    }, [buyPrice, sellPrice, investment, investmentFee, exitFee]);

    const totalProfitPercentage = useMemo(() => (((totalExitAmount || 0) - (totalInvestment || 0)) / (totalInvestment || 1)) * 100, [totalExitAmount, totalInvestment]);

    const updateInputs = useCallback((value: string, type: 'inv' | 'buy' | 'sell' | 'invFee' | 'exitFee') => {
        switch (type) {
            case "inv":
                return setInvestment(value);
            case 'buy':
                return setBuyPrice(value);
            case 'sell':
                return setSellPrice(value);
            case 'invFee':
                return setInvestmentFee(value);
            case 'exitFee':
                return setExitFee(value);
            default:
                return null;
        }
    }, []);

    const onClear = useCallback((type: 'inv' | 'buy' | 'sell' | 'invFee' | 'exitFee') => {
        switch (type) {
            case "inv":
                return setInvestment('');
            case 'buy':
                return setBuyPrice('');
            case 'sell':
                return setSellPrice('');
            case 'invFee':
                return setInvestmentFee('');
            case 'exitFee':
                return setExitFee('');
            default:
                return null;
        }
    }, []);

    return (
        <Row className="container min-h-[300px] gap-6 w-full">
            <Col className="gap-6 flex-1">
                <Row className="w-full gap-6">
                    <Row className="w-full gap-6">
                        <Col className="w-1/2 gap-6">
                            <InputWithTag label={t('coin')} />
                            <InputWithTag label={t('investment')} onChange={({ target: { value } }: any) => updateInputs(value, 'inv')} value={investment} placeholder="0" onClear={() => onClear('inv')} />
                        </Col>
                        <Col className="w-1/2 gap-6">
                            <InputWithTag label={t("buyPrice")} onChange={({ target: { value } }: any) => updateInputs(value, 'buy')} value={buyPrice} placeholder="0" onClear={() => onClear('buy')} />
                            <InputWithTag label={t("sellPrice")} onChange={({ target: { value } }: any) => updateInputs(value, 'sell')} value={sellPrice} placeholder="0" onClear={() => onClear('sell')} />
                        </Col>
                    </Row>
                </Row>
                <Row className="gap-6">
                    <InputWithTag label={t("investmentFee")} onChange={({ target: { value } }: any) => updateInputs(value, 'invFee')} value={investmentFee} placeholder="0" onClear={() => onClear('invFee')} />
                    <InputWithTag label={t("exitFee")} onChange={({ target: { value } }: any) => updateInputs(value, 'exitFee')} value={exitFee} placeholder="0" onClear={() => onClear('exitFee')} />
                </Row>
            </Col>
            <Col className="border w-[375px] rounded-md border-grey-3 px-4 py-6 gap-4">
                <h1 className="font-extrabold text-white header-label">{t('investmentResult')}</h1>
                <>
                    <label className="block text-sm text-grey-1 font-light">{t('profit/loss')}</label>
                    <Row className={clsx({ "bg-green-2": profit >= 0, "bg-red-2": profit < 0 }, "h-1/5 max-w-[315px] rounded-md justify-center items-center gap-1")}>
                        {profit >= 0 ? <ChevronUp /> :
                            <ChevronDown />}
                        <p className={clsx({ "text-green-1": profit >= 0, "text-red-1": profit < 0 }, "block text-lg text-green-1 font-bold")}>${profit.toFixed(2)} ({totalProfitPercentage.toFixed(2)}%)</p>
                    </Row>
                </>
                <Row className="gap-4">
                    <Col className="gap-4">
                        <label className="block text-sm text-grey-1 font-light">{t('totalInvestmentAmount')}</label>
                        <Row className={clsx({ "bg-green-2": profit >= 0, "bg-red-2": profit < 0 }, "rounded-md justify-center items-center gap-1 h-[50px]")}>
                            <p className={clsx({ "text-green-1": profit >= 0, "text-red-1": profit < 0 }, "block text-lg text-green-1 font-bold")}>${totalInvestment.toFixed(2)}</p>
                        </Row>
                    </Col>
                    <Col className="gap-4">
                        <label className="block text-sm text-grey-1 font-light">{t('totalExitAmount')}</label>
                        <Row className={clsx({ "bg-green-2": profit >= 0, "bg-red-2": profit < 0 }, "rounded-md justify-center items-center gap-1 h-[50px]")}>
                            <p className={clsx({ "text-green-1": profit >= 0, "text-red-1": profit < 0 }, "block text-lg text-green-1 font-bold")}>${totalExitAmount.toFixed(2)}</p>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default CoinProfitCalculator;