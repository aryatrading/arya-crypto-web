import { forwardRef, useCallback, useMemo, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ErrorMessage, Form, Formik } from "formik";
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';

import { addExchange as addNewExchange } from '../../../../services/controllers/settings';
import TextInput from '../../../shared/form/inputs/textInput';
import { Col, Row } from '../../../shared/layout/flex';
import Button from '../../../shared/buttons/button';
import ExchangeImage from '../../../shared/exchange-image/exchange-image';
import { AccordionArrow } from '../../../svg/accordionArrow';
import { getRemoteConfigValue } from '../../../../services/firebase/remoteConfig';
import { IPs } from '../../../../utils/constants/settings';
import { ExchangeType } from '../../../../types/exchange.types';
import { EditIcon } from '../../../svg/edit';
import { Modal } from '../../modal';
import ExchangeModals from '../Modal';

import styles from './index.module.scss';
import { CopyIcon } from '../../../svg/copyIcon';

const labelClasses = "text-base text-white font-semibold";
const displayClasses = "text-base rounded-md block w-full overflow-auto p-2.5 bg-grey-3 placeholder-grey-1 h-[48px] justify-center text-white";

const ExchangeAccordionCard = ({ cardId, exchange, setExchanges, exchanges }: any) => {
    const { t, i18n } = useTranslation(['settings']);
    const [showModal, setShowModal] = useState({ bool: false, type: '' });
    const name = useMemo(() => exchange?.create ? exchange?.name?.charAt(0)?.toUpperCase() + exchange?.name?.slice(1) : exchange.name, [exchange?.create, exchange.name])
    const exchangeDetails = getRemoteConfigValue('exchanges')?.[exchange.provider_id];

    const openModal = useCallback((type: string) => setShowModal({ bool: true, type }), []);
    const closeModal = useCallback(() => setShowModal({ bool: false, type: '' }), []);

    const formScheme = useCallback(() => {
        return Yup.object().shape({
            portfolioname: Yup.string().min(4).required(t('common:required').toString()),
            creationDate: Yup.string().required(t('common:required').toString()),
            apiKey: Yup.string().min(10).required(t('common:required').toString()),
            apiSecret: Yup.string().min(10).required(t('common:required').toString()),
        });
    }, [t]);

    const copyWhiteListIPs = useMemo(() => (
        <Row className='items-start gap-4 h-[90px] flex-col lg:flex-row lg:items-center'>
            <Col className='flex-1 gap-4'>
                <label className="text-base text-white font-semibold">{t('whitelistIPs')}</label>

                <p>{t('whiteListText')}</p>
            </Col>
            <Button className='text-white bg-grey-3 hover:bg-grey-4 px-4 font-medium rounded-md text-base min-h-[44px] mt-6' type="button" onClick={() => {
                navigator.clipboard.writeText(IPs).then(() => {
                    toast.success(t('common:copied'));
                });
            }}>
                <Row className='gap-4'>
                    <CopyIcon />
                    <h5>{t('copy')}</h5>
                </Row>
            </Button>
        </Row>
    ), [t]);

    const form = useMemo(() => {
        return (
            <Formik
                initialValues={{ portfolioname: '', creationDate: '', apiKey: '', apiSecret: '' }}
                validationSchema={formScheme}
                onSubmit={(values, { setSubmitting, }) => {
                    addNewExchange(exchange.provider_id, {
                        ...exchange,
                        name: values.portfolioname,
                        public_key: values.apiKey,
                        private_key: values.apiSecret,
                        creation_date: values.creationDate,
                    }).then(() => {
                        openModal('connect');
                        setSubmitting(false);
                    }).catch((err) => {
                        toast.error(err?.response?.data?.error || err);
                        setSubmitting(false);
                    });
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col w-full gap-4">
                        <Row className='gap-4 flex-col lg:flex-row'>
                            <Col className='flex-1'>
                                <TextInput type="text" name="portfolioname" label={t('portfolioname')} placeholder={t('portfolioname')} labelClassName={labelClasses} />
                                <ErrorMessage name="portfolioname" component="p" className="text-red-400" />
                            </Col>
                            <Col className='flex-1'>
                                <TextInput type="date" name="creationDate" label={t('creationDate')} placeholder={t('creationDate')} labelClassName={labelClasses} />
                                <ErrorMessage name="creationDate" component="p" className="text-red-400" />
                            </Col>
                        </Row>
                        <Col>
                            <TextInput type="text" name="apiKey" label={t('APIKey')} placeholder={t('APIKey')} labelClassName={labelClasses} />
                            <ErrorMessage name="apiKey" component="p" className="text-red-400" />
                        </Col>
                        <Col>
                            <TextInput type="text" name="apiSecret" label={t('APISecret')} placeholder={t('APISecret')} labelClassName={labelClasses} />
                            <ErrorMessage name="apiSecret" component="p" className="text-red-400" />
                        </Col>

                        {copyWhiteListIPs}

                        <Row className='gap-4'>
                            <Button className={'text-white mt-14 lg:mt-0 font-medium rounded-md text-base min-h-[44px] focus:outline-none self-start px-10 bg-blue-1 hover:bg-blue-2'} type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                                {t('submit', { name: exchange?.create ? exchange?.name?.charAt(0)?.toUpperCase() + exchange?.name?.slice(1) : exchange.name })}
                            </Button>

                            <Button className={'text-white mt-14 lg:mt-0 font-medium rounded-md text-base min-h-[44px] focus:outline-none self-start px-10 bg-transparent'} type="button" disabled={isSubmitting} onClick={() => {
                                setExchanges((st: ExchangeType[]) => st.filter(e => !e?.create))
                            }}>
                                {t('cancel')}
                            </Button>
                        </Row>
                    </Form>
                )}
            </Formik>
        );
    }, [copyWhiteListIPs, exchange, formScheme, openModal, setExchanges, t]);

    const display = useMemo(() => {
        const toggleModal = () => openModal("delete")
        const edit = () => openModal("edit");
        return (
            <Col className="flex flex-col w-full gap-4">
                <Row className='gap-4 flex-col lg:flex-row'>
                    <Col className='flex-1 gap-4'>
                        <label className={labelClasses}>{t('portfolioname')}</label>
                        <Col className='relative w-full overflow-hidden'>
                            <Button className='text-base rounded-md text-start block w-full overflow-auto lg:w-full p-2.5 bg-grey-3 placeholder-grey-1 h-[48px] justify-center text-white pr-4' onClick={edit}>{exchange?.name || ''}</Button>
                            <Col className='absolute right-3 top-[15px]'>
                                <EditIcon />
                            </Col>
                        </Col>
                    </Col>
                    <Col className='flex-1 gap-4'>
                        <label className={labelClasses}>{t('creationDate')}</label>
                        <Col className={displayClasses}>{new Date(exchange?.creation_date || '').toLocaleDateString()}</Col>
                    </Col>
                </Row>
                <Col className='gap-2'>
                    <label className={labelClasses}>{t('APIKey')}</label>
                    <Col className={displayClasses}>{exchange?.public_key || ''}</Col>
                </Col>
                <Col className='gap-2'>
                    <label className={labelClasses}>{t('APISecret')}</label>
                    <Col className={displayClasses}>********************************************</Col>
                </Col>

                {copyWhiteListIPs}

                <Button className={'text-red-1 mt-20 lg:mt-0 font-medium rounded-md text-base min-h-[44px] focus:outline-none self-start px-10 bg-red-2 hover:divide-opacity-95'} onClick={toggleModal}>
                    {t('disconnect', { name: exchange?.name || '' })}
                </Button>
            </Col>
        );
    }, [copyWhiteListIPs, exchange?.creation_date, exchange?.name, exchange?.public_key, openModal, t]);


    const AccordionTrigger = forwardRef(({ children, className, ...props }: any, forwardedRef) => (
        <Accordion.Header>
            <Accordion.Trigger
                className={clsx({ "opacity-50 cursor-not-allowed": exchanges.filter((e: ExchangeType) => e?.create).length > 0 && !exchange.create }, 'flex-row w-full focus:outline-none focus:ring-0 focus:border-0', className, styles.AccordionTrigger)}
                {...props}
                disabled={exchanges.filter((e: ExchangeType) => e?.create).length > 0}
                ref={forwardedRef}
            >
                <Row className='w-full items-center justify-between px-6 h-[80px]'>
                    {children}
                    <div className={styles.AccordionChevron}>
                        <AccordionArrow />
                    </div>
                </Row>
            </Accordion.Trigger>
        </Accordion.Header>
    ));

    const AccordionContent = forwardRef(({ children, className, ...props }: any, forwardedRef) => (
        <Accordion.Content
            className={clsx('border-t-[2px] border-t-grey-3', className, styles.AccordionContent)}
            {...props}
            ref={forwardedRef}
            forceMount={!!exchange?.create}
        >
            {children}
        </Accordion.Content>
    ));


    const AccordionItem = useMemo(() => (
        <Accordion.Item className={"w-full bg-grey-2 mb-6 rounded-md"} value={cardId}>
            <AccordionTrigger>
                <Row className='gap-4 items-center'>
                    <ExchangeImage providerId={exchange?.provider_id} width={20} height={20} />
                    <h3 className='text-white font-bold text-xl'>{name}</h3>
                </Row>
            </AccordionTrigger>
            <AccordionContent>
                <Row className='flex-col gap-10 lg:flex-row lg:gap-5 p-6'>
                    <Col className='flex-1'>
                        {exchange.create ? form : display}
                    </Col>
                    <Col className='flex-[1] gap-6'>

                        <Row className='justify-center items-center bg-yellow-1 rounded-md flex-col md:flex-row'>
                            <Col className='p-4 gap-3'>
                                <p className='text-white font-bold text-xl'>{t('exchangeAccQ', { name: exchange.provider_name })}</p>
                                <p className='text-white font-bold text-base'>{exchangeDetails?.signupDescription?.[i18n?.language] || ''}</p>
                            </Col>
                            <Button className={'text-white font-medium rounded-md text-base focus:outline-none w-[300px] px-4 bg-grey-2 hover:divide-opacity-95 h-[56px] self-center me-0 mb-4 md:mb-0 md:me-6'} onClick={() => window.open(
                                exchangeDetails?.exchangeURL,
                                '_blank'
                            )}>
                                <h5>{t('createAccount')}</h5>
                            </Button>
                        </Row>

                        <Row className='justify-between items-center bg-blue-3 rounded-md h-[65px] px-6'>
                            <p className='text-white font-bold text-lg'>{t('howToConnect', { name: name })}</p>
                            <h5 className='text-blue-1 font-bold cursor-pointer' onClick={() => openModal('video')}>{t('vidTutorial')}</h5>
                        </Row>

                        <Col className='gap-2'>
                            {exchangeDetails?.steps?.map((info: string, index: number) => {
                                return (
                                    <p key={index} className='text-sm text-white font-medium'>{info}</p>
                                );
                            })}
                        </Col>
                    </Col>
                </Row>
            </AccordionContent>
        </Accordion.Item>
    ), [AccordionContent, AccordionTrigger, cardId, display, exchange.create, exchange?.provider_id, exchange.provider_name, exchangeDetails, form, i18n?.language, name, openModal, t]);


    return (
        <Row className='gap-10 w-full overflow-hidden'>
            {AccordionItem}
            <Modal isVisible={showModal.bool} size={showModal.type === 'video' ? '4xl' : 'lg'}>
                <ExchangeModals closeModal={closeModal} showModal={showModal} id={exchange.provider_id} name={name} />
            </Modal>
        </Row>
    );
}

export default ExchangeAccordionCard