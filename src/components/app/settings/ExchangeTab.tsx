import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ErrorMessage, Form, Formik } from "formik";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import * as Yup from 'yup';
import { PlusIcon } from '@heroicons/react/24/solid';

import { Col, Row } from '../../shared/layout/flex';
import Button from '../../shared/buttons/button';
import AddExchange from '../../app/exchangeTab/AddExchange';
import TextInput from '../../shared/form/inputs/textInput';
import { selectConnectedExchanges, selectSelectedExchange } from '../../../services/redux/exchangeSlice';
import { DisccounetAlertIcon } from '../../svg/discconetAlert';
import CloseIcon from '../../svg/Shared/CloseIcon'
import { Modal } from '../modal';
import { ConnectedAlertIcon } from '../../svg/connectedAlert';
import { EditIcon } from '../../svg/edit';
import { deleteExchange, addExchange as addNewExchange, changeExchangeName } from '../../../services/controllers/settings';
import { ExchangeType } from '../../../types/exchange.types';
import { IPs } from '../../../utils/constants/settings';
import ExchangeImage from '../../shared/exchange-image/exchange-image';

const ModalContainer = ({ closeModal, children, type }: { closeModal: () => void, children?: any, type?: string }) => {
    return (
        <Col className={clsx({ "items-center": type !== 'edit' }, 'min-w-[400px] min-h-[200px] bg-black-1 rounded-md p-8 gap-4 relative')}>
            <Button className='absolute top-6 right-6' onClick={closeModal}>
                <CloseIcon className='stroke-current text-[#89939F] w-3 h-3' />
            </Button>
            {children}
        </Col>
    );
}

const ExchangeTab = () => {
    const activeExchange = useSelector(selectSelectedExchange);
    const connectedExchanges = useSelector(selectConnectedExchanges);
    const { t } = useTranslation(['settings', 'common']);
    const [exchanges, setExchanges] = useState<any>([]);
    const [selectedExchange, setSelectedExchange] = useState<any>({});
    const [showModal, setShowModal] = useState({ bool: false, type: '' });
    const editNameRef = useRef<any>(null);

    const formScheme = useCallback(() => {
        return Yup.object().shape({
            portfolioname: Yup.string().min(4).required(t('common:required').toString()),
            creationDate: Yup.string().required(t('common:required').toString()),
            apiKey: Yup.string().min(10).required(t('common:required').toString()),
            apiSecret: Yup.string().min(10).required(t('common:required').toString()),
        });
    }, [t]);

    useEffect(() => {
        if (connectedExchanges?.filter(e => e.provider_id)?.length) {
            setExchanges(connectedExchanges?.filter(e => e.provider_id != null));
        }

        if (activeExchange?.provider_id != null) {
            setSelectedExchange(activeExchange || {});
        }
    }, [connectedExchanges, activeExchange]);

    useEffect(() => {
        if (exchanges.filter((e: ExchangeType) => e?.create).length) {
            setSelectedExchange(exchanges.filter((e: ExchangeType) => e?.create)[0]);
        }
    }, [exchanges]);

    const openModal = useCallback((type: string) => setShowModal({ bool: true, type }), []);
    const closeModal = useCallback(() => setShowModal({ bool: false, type: '' }), []);

    const form = useMemo(() => {
        return (
            <Formik
                initialValues={{ portfolioname: '', creationDate: '', apiKey: '', apiSecret: '' }}
                validationSchema={formScheme}
                onSubmit={(values, { setSubmitting, }) => {
                    addNewExchange(selectedExchange.provider_id, {
                        ...selectedExchange,
                        name: values.portfolioname,
                        public_key: values.apiKey,
                        private_key: values.apiSecret,
                        creation_date: values.creationDate,
                    }, setSelectedExchange).then(() => {
                        openModal('connect');
                        setSubmitting(false);
                    }).catch((err) => {
                        toast.error(err);
                        setSubmitting(false);
                    });
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col w-full gap-4">
                        <Row className='gap-4'>
                            <Col className='flex-1'>
                                <TextInput type="text" name="portfolioname" label={t('portfolioname')} />
                                <ErrorMessage name="portfolioname" component="p" className="text-red-400" />
                            </Col>
                            <Col className='flex-1'>
                                <TextInput type="date" name="creationDate" label={t('creationDate')} />
                                <ErrorMessage name="creationDate" component="p" className="text-red-400" />
                            </Col>
                        </Row>
                        <Row className='justify-center items-center gap-4 h-[90px]'>
                            <Col className='flex-1 gap-2'>
                                <label className="block text-smtext-white font-semibold">{t('whitelistIPs')}</label>
                                <textarea disabled rows={2} cols={4} className="text-sm resize-none rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white">
                                    {IPs}
                                </textarea>
                            </Col>
                            <Button className='text-white bg-grey-3 hover:bg-grey-4 font-medium rounded-lg text-sm h-[44px] min-w-[110px] mt-6' type="button" onClick={() => {
                                navigator.clipboard.writeText(IPs).then(() => {
                                    toast.success(t('common:copied'));
                                });
                            }}>
                                <h5>{t('copy')}</h5>
                            </Button>
                        </Row>
                        <Col>
                            <TextInput type="text" name="apiKey" label={t('APIKey')} />
                            <ErrorMessage name="apiKey" component="p" className="text-red-400" />
                        </Col>
                        <Col>
                            <TextInput type="text" name="apiSecret" label={t('APISecret')} />
                            <ErrorMessage name="apiSecret" component="p" className="text-red-400" />
                        </Col>
                        <Button className={'text-white  font-medium rounded-lg text-sm py-2.5 focus:outline-none self-start px-10 bg-blue-1 hover:bg-blue-2'} type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                            <h5>{t('submit')}</h5>
                        </Button>
                    </Form>
                )}
            </Formik>
        );
    }, [formScheme, openModal, selectedExchange, t]);

    const display = useMemo(() => {
        const toggleModal = () => openModal("delete")
        const edit = () => openModal("edit");
        return (
            <Col className="flex flex-col w-full gap-4">
                <Row className='gap-4'>
                    <Col className='flex-1 gap-2'>
                        <label className="block text-sm text-white font-semibold">{t('portfolioname')}</label>
                        <Col className='relative'>
                            <Button className='text-sm rounded-lg text-start block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white pr-4' onClick={edit}>{selectedExchange?.name || ''}</Button>
                            <Col className='absolute right-3 top-[11px]'>
                                <EditIcon />
                            </Col>
                        </Col>
                    </Col>
                    <Col className='flex-1 gap-2'>
                        <label className="block text-sm text-white font-semibold">{t('creationDate')}</label>
                        <Col className='text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white'>{new Date(selectedExchange?.creation_date || '').toLocaleDateString()}</Col>
                    </Col>
                </Row>
                <Row className='justify-center items-center gap-4 h-[90px]'>
                    <Col className='flex-1 gap-2'>
                        <label className="block text-sm text-white font-semibold">{t('whitelistIPs')}</label>
                        <textarea disabled rows={2} cols={4} className="text-sm resize-none rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white">
                            {IPs}
                        </textarea>
                    </Col>
                    <Button className='text-white bg-grey-3 hover:bg-grey-4 font-medium rounded-lg text-sm h-[44px] min-w-[110px] mt-6' type="button" onClick={() => {
                        navigator.clipboard.writeText(IPs).then(() => {
                            toast.success(t('common:copied'));
                        });
                    }}>
                        <h5>{t('copy')}</h5>
                    </Button>
                </Row>
                <Col className='gap-2'>
                    <label className="block text-sm text-white font-semibold">{t('APIKey')}</label>
                    <Col className='text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white'>{selectedExchange?.public_key || ''}</Col>
                </Col>
                <Col className='gap-2'>
                    <label className="block text-sm text-white font-semibold">{t('APISecret')}</label>
                    <Col className='text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white'>********************************************</Col>
                </Col>
                <Button className={'text-white  font-medium rounded-lg text-sm py-2.5 focus:outline-none self-start px-10 bg-red-1 hover:bg-red-2'} onClick={toggleModal}>
                    <h5>{t('disconnect', { name: selectedExchange?.name || '' })}</h5>
                </Button>
            </Col>
        );
    }, [openModal, selectedExchange?.creation_date, selectedExchange?.name, selectedExchange?.public_key, t]);

    const deleteDialog = useMemo(() => {
        const onPress = () => {
            deleteExchange(selectedExchange?.provider_id, closeModal).then(() => {
                toast.success(t('discconectedSuccess'));
            });
            if (exchanges?.filter((e: ExchangeType) => e.provider_id !== selectedExchange?.provider_id && e.provider_id != null).length) {
                setSelectedExchange(exchanges?.filter((e: ExchangeType) => e.provider_id !== selectedExchange?.provider_id)[0]);
            } else {
                setSelectedExchange({});
                setExchanges([]);
            }
        }
        return (
            <ModalContainer closeModal={closeModal}>
                <DisccounetAlertIcon />
                <h3 className='text-white text-2xl font-bold'>{t('deleteTitle')}</h3>
                <p className='text-grey-1 text-base font-medium text-center'>{t('deleteFirstHint')}</p>
                <p className='text-grey-1 text-base font-medium text-center'>{t('deleteHint')}</p>
                <Button className={'text-white font-medium rounded-lg text-sm py-2.5 focus:outline-none mt-8 px-10 bg-red-1 hover:bg-opacity-95'} onClick={onPress}>
                    <h5>{t('disconnect', { name: selectedExchange?.name || '' })}</h5>
                </Button>
            </ModalContainer>
        );
    }, [closeModal, exchanges, selectedExchange?.name, selectedExchange?.provider_id, t]);

    const editNameDialog = useMemo(() => {
        const saveNewName = () => {
            if (editNameRef.current) {
                changeExchangeName(selectedExchange.provider_id, editNameRef.current.value, setSelectedExchange).then(() => {
                    closeModal();
                    toast.success(t('updateNameSuccess'));
                });
            }
        };

        return (
            <ModalContainer closeModal={closeModal} type="edit">
                <h3 className='text-white text-2xl font-bold'>{t("changeName")}</h3>

                <label className="block text-sm text-white font-semibold">{t('portfolioname')}</label>
                {activeExchange?.name && <input ref={editNameRef} className="text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" defaultValue={activeExchange?.name} />}

                <Row className='justify-end gap-4'>
                    <Button className={'text-white font-medium rounded-lg text-sm py-2.5 focus:outline-none mt-8 px-10 bg-transparent hover:bg-opacity-95'} onClick={closeModal}>
                        <h5>{t('cacnel')}</h5>
                    </Button>
                    <Button className={'text-white font-medium rounded-lg text-sm py-2.5 focus:outline-none mt-8 px-10 bg-blue-1 hover:bg-blue-2'} onClick={saveNewName}>
                        <h5>{t('save')}</h5>
                    </Button>
                </Row>
            </ModalContainer>
        );
    }, [activeExchange?.name, closeModal, selectedExchange.provider_id, t]);

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
    }, [closeModal]);

    const connectToExchangeName = useMemo(() => {
        if (selectedExchange?.provider_name) {
            return selectedExchange?.provider_name?.charAt(0) + selectedExchange?.provider_name?.slice(1)?.toLowerCase()

        } else {
            return selectedExchange?.name?.charAt(0) + selectedExchange?.name?.slice(1)?.toLowerCase()
        }
    }, [selectedExchange]);

    return (
        <>
            {
                exchanges?.length === 0 ?
                    <AddExchange onPressExchange={(data: any) => {
                        setExchanges(data);
                    }} />
                    :
                    <Row className='gap-10'>
                        <Col className='items-center gap-4 flex-1'>
                            <h1 className='font-bold text-lg'>{t('title')}</h1>
                            {exchanges.map((exchange: ExchangeType) => {
                                const bg = selectedExchange?.provider_id === exchange.provider_id ? 'bg-blue-3' : 'bg-grey-2';
                                const onClick = () => {
                                    setSelectedExchange(exchange);
                                }
                                return (
                                    <Button className={`w-full h-[44px] ${bg} rounded-md hover:bg-grey-4 px-5`} onClick={onClick}>
                                        <Row className='gap-3'>
                                            <ExchangeImage height={20} width={20} providerId={exchange.provider_id} />
                                            <label className='font-bold text-white text-base'>{exchange?.create ? exchange?.name?.charAt(0)?.toUpperCase() + exchange?.name?.slice(1) : exchange.name}</label>
                                        </Row>
                                    </Button>
                                );
                            })}
                            {!selectedExchange?.create && <Button className='w-full h-[44px] bg-grey-2 rounded-md hover:bg-grey-4 px-5' onClick={() => openModal("add")}>
                                <Row className='gap-2'>
                                    <PlusIcon stroke="currentColor" className="w-5 h-5 stroke-blue-1" />

                                    <label className='font-bold text-blue-1 text-sm'>{t('addExchange')}</label>
                                </Row>
                            </Button>}
                        </Col>
                        <Col className='flex-[3] border-l-[1px] border-grey-3 pl-8 gap-8'>
                            <h1 className='font-bold text-lg'>{`Connect ${connectToExchangeName}`}</h1>

                            {selectedExchange?.create ? form : display}
                        </Col>
                        <Modal isVisible={showModal.bool} size={showModal.type === 'add' ? '5xl' : 'lg'}>
                            {showModal.type === 'delete' && deleteDialog}
                            {showModal.type === 'edit' && editNameDialog}
                            {showModal.type === 'connect' && connectedDialog}
                            {showModal.type === 'add' && addExchange}
                        </Modal>
                        <Col className='flex-[1.5] gap-4'>
                            <h1 className='font-bold text-lg'>Follow these steps:</h1>
                            <p className='whitespace-pre-wrap text-sm'>
                                1. login to your Binance account on your computer.<br /><br />
                                2. Deposit the capital you wish to trade with ARYA Crypto on Binance.<br /><br />
                                3. click on API Management from your profile icon dropdown menu on the top right.<br /><br />
                                4. In the “label your API key” field type in the name you want to call it. and click create.<br /><br />
                                5. Input your google authentication code (2FA) for binance.<br /><br />
                                6. Open your verification email Binance sent you and click Confirm new API key.<br /><br />
                                7. You can either scan the QR code with the ARYA Crypto app by pressing Scan QR code and pointing the camera onto the API QR code or copy and paste your API key and Secret keys into the app.<br /><br />
                            </p>
                        </Col>
                    </Row>
            }
        </>
    )
}

export default ExchangeTab