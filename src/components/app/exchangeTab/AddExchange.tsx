import { useEffect, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import CheckBadgeIcon from '@heroicons/react/24/outline/CheckBadgeIcon'

import { Col, Row } from '../../shared/layout/flex';
import Button from '../../shared/buttons/button';
import { getAddableProviders } from '../../../services/controllers/market';
import { useSelector } from 'react-redux';
import { selectAllProviders } from '../../../services/redux/exchangeSlice';
import clsx from 'clsx';
import ExchangeImage from '../../shared/exchange-image/exchange-image';

interface AddExchangeTypes {
    onPressExchange: any,
    modal?: boolean,
};

const AddExchange = (props: AddExchangeTypes) => {
    const { t } = useTranslation(['settings', 'common']);
    const allProviders = useSelector(selectAllProviders);

    useEffect(() => {
        getAddableProviders();
    }, []);

    const classes = props.modal ? "items-center w-full py-4 gap-6 bg-black-1" : "items-center mt-[100px] gap-6"

    const gridView = useMemo(() => {
        return (
            <Col className={clsx({ "grid-cols-3": (allProviders?.length || 0) % 2 === 1, "grid-cols-2": (allProviders?.length || 0) % 2 === 0 }, "grid gap-4")}>
                {
                    allProviders?.map(provider => {
                        return (
                            <Button className={clsx({ "hover:bg-grey-4": !provider?.isConnected, "cursor-not-allowed": provider?.isConnected }, 'w-[214px] h-[48px] bg-grey-3 rounded-md')} onClick={() => props.onPressExchange((st: any) => [{ provider_id: provider.id, name: provider.name, create: true }, ...st,])} disabled={provider?.isConnected}>
                                <Row className={clsx({ "justify-between px-4": provider?.isConnected }, 'justify-center items-center')}>
                                    <Row className='justify-center items-center gap-2'>
                                        <ExchangeImage providerId={provider.id} />
                                        <label className='font-bold text-base text-center text-white'>{provider.name.charAt(0) + provider.name.slice(1).toLowerCase()}</label>
                                    </Row>
                                    {provider?.isConnected && <CheckBadgeIcon stroke="#22C55E" className="w-6 h-6" />}

                                </Row>
                            </Button>
                        );
                    })
                }
            </Col>
        );
    }, [allProviders, props]);

    return (
        <Col className={classes}>
            <Row className='items-center gap-3'>
                <svg width="44" height="44" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25 47.6236C37.7026 47.6236 48 37.4104 48 24.8118C48 12.2132 37.7026 2 25 2C12.2975 2 2 12.2132 2 24.8118C2 37.4104 12.2975 47.6236 25 47.6236Z" stroke="#558AF2" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M34 32.7947C34 35.28 29.9706 37.2947 25 37.2947C20.0294 37.2947 16 35.28 16 32.7947" stroke="#558AF2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M34 25.2947C34 27.78 29.9706 29.7947 25 29.7947C20.0294 29.7947 16 27.78 16 25.2947" stroke="#558AF2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M25 22.2947C29.9706 22.2947 34 20.28 34 17.7947C34 15.3094 29.9706 13.2947 25 13.2947C20.0294 13.2947 16 15.3094 16 17.7947C16 20.28 20.0294 22.2947 25 22.2947Z" fill="#558AF2" stroke="#558AF2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <h1 className='font-bold text-2xl'>{t('exchangeTitle')}</h1>
            </Row>
            <label className='font-medium text-base text-center text-grey-1'>{t('exchangeHint').split('.')[0]}.<br />{t('exchangeHint').split('.')[1]}</label>
            {gridView}

            <label className='font-bold text-lg text-center text-white'>{t('exchangeFutureInfo')}</label>
        </Col>
    )
}

export default AddExchange