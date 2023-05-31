import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import * as Accordion from '@radix-ui/react-accordion';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import { Row } from '../../shared/layout/flex';
import Button from '../../shared/buttons/button';
import AddExchange from '../../app/exchangeTab/AddExchange';
import { selectConnectedExchanges, selectSelectedExchange } from '../../../services/redux/exchangeSlice';
import { Modal } from '../modal';
import { ExchangeType } from '../../../types/exchange.types';

import ExchangeAccordionCard from './Accordion';
import ExchangeModals from './Modal';


const ExchangeTab = () => {
    const activeExchange = useSelector(selectSelectedExchange);
    const connectedExchanges = useSelector(selectConnectedExchanges);
    const { t } = useTranslation(['settings', 'common']);
    const [exchanges, setExchanges] = useState<any>([]);
    const [showModal, setShowModal] = useState({ bool: false, type: '' });

    useEffect(() => {
        const connectedExchangesExceptOverall = connectedExchanges?.filter(e => e.provider_id != null);
        if (connectedExchanges?.filter(e => e.provider_id)?.length) {
            setExchanges(connectedExchangesExceptOverall);
        }
    }, [connectedExchanges, activeExchange]);

    const openModal = useCallback(() => setShowModal({ bool: true, type: 'add' }), []);
    const closeModal = useCallback(() => setShowModal({ bool: false, type: '' }), []);

    return (
        <>
            {
                exchanges?.length === 0 ?
                    <AddExchange onPressExchange={(data: any) => {
                        setExchanges(data);
                    }} />
                    :
                    <>
                        <Accordion.Root className="w-full rounded-lg" type="single" collapsible>
                            {exchanges.map((exchange: ExchangeType, index: number, arr: ExchangeType[]) => {
                                return (
                                    <ExchangeAccordionCard key={index} t={t} exchanges={arr} exchange={exchange} cardId={"item-" + (index + 1)} setExchanges={setExchanges} />
                                );
                            })}
                        </Accordion.Root>

                        <Button className={clsx({ "cursor-not-allowed hover:bg-grey-2 opacity-75": exchanges[exchanges.length - 1]?.create }, 'w-full h-[80px] bg-grey-2 rounded-lg hover:bg-grey-3 px-5')} onClick={openModal} disabled={exchanges[exchanges.length - 1]?.create}>
                            <Row className='gap-4'>
                                <PlusIcon stroke="currentColor" className="w-6 h-6 stroke-blue-1" />

                                <label className='font-bold text-blue-1 text-lg'>{t('addExchange')}</label>
                            </Row>
                        </Button>
                        <Modal isVisible={showModal.bool} size='5xl'>
                            <ExchangeModals closeModal={closeModal} showModal={showModal} setExchanges={setExchanges} />
                        </Modal>
                    </>
            }
        </>
    );
}

export default ExchangeTab