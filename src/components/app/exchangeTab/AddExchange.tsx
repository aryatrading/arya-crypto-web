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
import { ExchangesIcon } from '../../svg/exchanges';
import { useResponsive } from '../../../context/responsive.context';

interface AddExchangeTypes {
    onPressExchange: any,
    modal?: boolean,
};

const AddExchange = (props: AddExchangeTypes) => {
    const { t } = useTranslation(['settings', 'common']);
    const allProviders = useSelector(selectAllProviders);
    const { isTabletOrMobileScreen } = useResponsive();

    useEffect(() => {
        getAddableProviders();
    }, []);

    const classes = props.modal ? "items-center w-full py-4 gap-6 bg-black-1" : "items-center mt-[100px] gap-6"

    const gridView = useMemo(() => {
        return (
            <Col className={clsx({ "grid-cols-3": (allProviders?.length || 0) % 2 === 1, "grid-cols-2": (allProviders?.length || 0) % 2 === 0, "grid-cols-1": isTabletOrMobileScreen }, "grid gap-4")}>
                {
                    allProviders?.map(provider => {
                        return (
                            <Button className={clsx({ "hover:bg-grey-4": !provider?.isConnected, "cursor-not-allowed": provider?.isConnected }, 'w-[214px] h-[48px] bg-grey-3 rounded-md')} onClick={() => props.onPressExchange((st: any) => [...st, { provider_id: provider.id, name: provider.name, create: true }])} disabled={provider?.isConnected}>
                                <Row className='px-4 justify-between items-center'>
                                    <Row className='justify-center items-center gap-2'>
                                        <ExchangeImage providerId={provider.id} />
                                        <label className='font-bold text-base text-center text-white'>{provider.name.charAt(0) + provider.name.slice(1).toLowerCase()}</label>
                                    </Row>
                                    {provider?.isConnected && <CheckBadgeIcon stroke={"#22C55E"} className="w-6 h-6" />}

                                </Row>
                            </Button>
                        );
                    })
                }
            </Col>
        );
    }, [allProviders, isTabletOrMobileScreen, props]);

    return (
        <Col className={classes}>
            <Row className='items-center gap-3'>
                <ExchangesIcon />
                <h3 className='font-bold text-2xl'>{t('exchangeTitle')}</h3>
            </Row>
            <label className='font-medium text-base text-center text-grey-1'>{t('exchangeHint').split('.')[0]}.<br />{t('exchangeHint').split('.')[1]}</label>
            {gridView}

            <label className='font-bold text-lg text-center text-white'>{t('exchangeFutureInfo')}</label>
        </Col>
    )
}

export default AddExchange