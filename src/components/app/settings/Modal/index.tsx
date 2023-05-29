import { useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import clsx from 'clsx';

import { deleteExchange, changeExchangeName } from '../../../../services/controllers/settings';
import { Col, Row } from '../../../shared/layout/flex';
import Button from '../../../shared/buttons/button';
import CloseIcon from '../../../svg/Shared/CloseIcon';
import { DisccounetAlertIcon } from '../../../svg/discconetAlert';
import { ConnectedAlertIcon } from '../../../svg/connectedAlert';
import AddExchange from '../../exchangeTab/AddExchange';
import { useTranslation } from 'next-i18next';
import { getRemoteConfigValue } from '../../../../services/firebase/remoteConfig';

const ModalContainer = ({ closeModal, children, type, padding }: { closeModal: () => void, children?: any, type?: string, padding?: string, }) => {
    return (
        <Col className={clsx({ "items-center": type !== 'edit', "p-8": !padding }, 'min-w-full bg-black-1 min-h-[200px] rounded-md gap-4 relative', padding)}>
            <Button className='absolute top-6 right-6 z-10' onClick={closeModal}>
                <CloseIcon className='stroke-current text-[#89939F] w-3 h-3' />
            </Button>
            {children}
        </Col>
    );
}

interface ExchangeModalsTypes { id?: string, name?: string, setExchanges?: any, showModal: { type: string, bool: boolean }, closeModal: () => void }

const ExchangeModals = ({ id, name, setExchanges, showModal, closeModal }: ExchangeModalsTypes) => {
    const videoURL = getRemoteConfigValue('exchanges')?.[id || '']?.videoURL;
    const { t } = useTranslation(['settings'])
    const editNameRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const deleteDialog = useMemo(() => {
        const onPress = () => {
            deleteExchange(id, closeModal).then(() => {
                toast.success(t('discconectedSuccess'));
            });
        }
        return (
            <ModalContainer closeModal={closeModal}>
                <DisccounetAlertIcon />
                <h3 className='text-white text-2xl font-bold'>{t('deleteTitle')}</h3>
                <p className='text-grey-1 text-base font-medium text-center'>{t('deleteFirstHint')}</p>
                <p className='text-grey-1 text-base font-medium text-center'>{t('deleteHint')}</p>
                <Button className={'text-white font-medium rounded-lg text-sm py-2.5 focus:outline-none mt-8 px-10 bg-red-1 hover:bg-opacity-95'} onClick={onPress}>
                    <h5>{t('disconnect', { name: name || '' })}</h5>
                </Button>
            </ModalContainer>
        );
    }, [closeModal, name, id, t]);

    const editNameDialog = useMemo(() => {
        const saveNewName = () => {
            if (editNameRef.current) {
                setIsLoading(true);
                changeExchangeName(id, editNameRef.current.value).then(() => {
                    closeModal();
                    toast.success(t('updateNameSuccess'));
                    setIsLoading(false);
                }).catch(err => {
                    toast.error(err?.response?.data?.error || err);
                    setIsLoading(false);
                });
            }
        };

        return (
            <ModalContainer closeModal={closeModal} type="edit">
                <h3 className='text-white text-2xl font-bold'>{t("changeName")}</h3>

                <label className="text-base text-white font-semibold">{t('portfolioname')}</label>
                {name && <input ref={editNameRef} className="text-base rounded-lg block w-full overflow-auto p-2.5 bg-grey-3 placeholder-grey-1 h-[48px] justify-center text-white" defaultValue={name} />}

                <Row className='justify-end gap-4'>
                    <Button className={'text-white font-medium rounded-lg text-sm py-2.5 focus:outline-none mt-8 px-10 bg-transparent hover:bg-opacity-95'} onClick={closeModal}>
                        <h5>{t('cacnel')}</h5>
                    </Button>
                    <Button className={'text-white font-medium rounded-lg text-sm py-2.5 focus:outline-none mt-8 px-10 bg-blue-1 hover:bg-blue-2'} onClick={saveNewName} isLoading={isLoading}>
                        <h5>{t('save')}</h5>
                    </Button>
                </Row>
            </ModalContainer>
        );
    }, [closeModal, t, name, isLoading, id]);

    const videoPreviewer = useMemo(() => {
        return (
            <ModalContainer closeModal={closeModal} padding="pt-0">
                {videoURL != null && videoURL !== '' && <video width="100%" controls>
                    <source src={videoURL} type="video/mp4" />
                    Your browser does not support HTML video.
                </video>}
            </ModalContainer>
        );
    }, [closeModal, videoURL]);

    const connectedDialog = useMemo(() => {
        return (
            <ModalContainer closeModal={closeModal}>
                <ConnectedAlertIcon />
                <h3 className='text-white text-2xl font-bold'>{t('connected')}</h3>
                <p className='text-grey-1 text-base font-medium text-center'>{t('connectedNote')}</p>

                <Button className={'text-white font-medium rounded-lg text-sm py-2.5 focus:outline-none mt-8 px-10 bg-blue-1 hover:bg-opacity-95'} onClick={closeModal}>
                    <h5>{t('startTrade')}</h5>
                </Button>
            </ModalContainer>

        );
    }, [closeModal, t]);

    const addExchange = useMemo(() => {
        return (
            <ModalContainer closeModal={closeModal}>
                <AddExchange onPressExchange={(data: any) => {
                    setExchanges(data);
                    closeModal();
                }} modal />
            </ModalContainer>
        );
    }, [closeModal, setExchanges]);

    return (
        <Row className='gap-10 w-full overflow-hidden'>
            {showModal.type === 'delete' && deleteDialog}
            {showModal.type === 'edit' && editNameDialog}
            {showModal.type === 'connect' && connectedDialog}
            {showModal.type === 'add' && addExchange}
            {showModal.type === 'video' && videoPreviewer}
        </Row>
    );
}

export default ExchangeModals