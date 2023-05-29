import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ErrorMessage, Form, Formik } from "formik";
import { useAuthUser } from 'next-firebase-auth';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';

import { Col, Row } from '../../shared/layout/flex';
import { Modal } from '../modal';
import Button from '../../shared/buttons/button';
import TextInput from '../../shared/form/inputs/textInput';
import { changePassword } from '../../../services/firebase/auth/auth';
import CloseIcon from '../../svg/Shared/CloseIcon';

interface InputTypes {
    label: string,
    value: string,
}

const Input = ({ label, value }: InputTypes) => {
    return (
        <Col className='gap-4'>
            <label className="block text-base font-medium text-white">{label}</label>
            <input
                className='text-base rounded-lg block w-[90vw] md:w-[370px] overflow-auto p-2.5 bg-grey-3 placeholder-grey-1 h-[48px] justify-center text-white'
                disabled
                defaultValue={value} />
        </Col>
    )
};

const AccountTab = () => {
    const { t } = useTranslation(['settings', 'common']);
    const { email, displayName } = useAuthUser();
    const ref = useRef<any>();
    const [showChangePasswordModal, setShowChangePasswordModal] = useState<boolean>(false);

    const [errorForm, setError] = useState<string | null>()

    const showCPModal = useCallback(() => setShowChangePasswordModal(true), []);
    const hideCPModal = useCallback(() => {
        setShowChangePasswordModal(false);
        setError('');
        ref.current?.resetForm();
    }, []);

    const formScheme = useCallback(() => {
        return Yup.object().shape({
            currentPassword: Yup.string().required(t('common:required').toString()),
            newPassword: Yup.string().required(t('common:required').toString()),
            confirmNewPassowrd: Yup.string().required(t('common:required').toString()),
        });
    }, [t]);

    return (
        <>
            <Col className='gap-4'>
                <Col className='gap-6'>
                    <Row className='gap-6 flex-wrap justify-center md:justify-start'>
                        <Col className='gap-2'>
                            <Input label={t('common:name')} value={displayName?.replace('+', ' ') || ''} />
                        </Col>
                        <Col className='gap-2'>
                            <Input label={t('common:email')} value={email || ''} />
                        </Col>
                    </Row>
                    <Col className='gap-4 items-center md:items-start'>
                        <label className="text-base font-medium text-white hidden md:block">{t('common:password')}</label>
                        <Button
                            className="text-white font-medium rounded-lg text-base px-5 bg-grey-2 w-[90vw] md:w-[300px] h-[48px]"
                            onClick={showCPModal}>
                            {t('changePassword')}
                        </Button>
                    </Col>
                </Col>
            </Col>

            <Modal isVisible={showChangePasswordModal} size='lg'>
                <Col className='min-h-[200px] p-6 bg-black-2 rounded-lg'>
                    <Button className='self-end' onClick={hideCPModal}>
                        <CloseIcon className='stroke-current text-[#89939F] w-3 h-3' />
                    </Button>

                    <h3 className='font-bold text-3xl mb-10'>{t('changePassword')}</h3>

                    <Formik
                        innerRef={ref}
                        validationSchema={formScheme}
                        initialValues={{ currentPassword: '', newPassword: '', confirmNewPassowrd: '' }}
                        onSubmit={(values, { setSubmitting, setErrors }) => {
                            if (values.newPassword !== values.confirmNewPassowrd) {
                                setErrors({
                                    newPassword: t('changePasswordNotMatchErrorMsg').toString()
                                })
                            } else {
                                changePassword(values.currentPassword, values.newPassword).then(e => {
                                    hideCPModal();
                                    toast.success(t('changePasswordMsg'), {
                                        position: "top-right",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        theme: "light",
                                        icon: "🔑",
                                    });
                                    setSubmitting(false);
                                }).catch(error => {
                                    setSubmitting(false);
                                    setError(error.message);
                                });
                            }
                        }}
                    >
                        {({ isSubmitting }: any) => (
                            <Form className="flex flex-col w-full gap-4">
                                <Col>
                                    <TextInput type="password" name="currentPassword" label={t('currentpassword')} labelClassName='block text-base text-white font-semibold' />
                                    <ErrorMessage name="currentPassword" component="p" className="text-red-400" />
                                </Col>
                                <Col>
                                    <TextInput type="password" name="newPassword" label={t('newPassword')} labelClassName='block text-base text-white font-semibold' />
                                    <ErrorMessage name="newPassword" component="p" className="text-red-400" />
                                </Col>
                                <Col>
                                    <TextInput type="password" name="confirmNewPassowrd" label={t('confirmNewPassword')} labelClassName='block text-base text-white font-semibold' />
                                    <ErrorMessage name="confirmNewPassowrd" component="p" className="text-red-400" />
                                </Col>
                                <Col className="items-center gap-4 mt-6 mb-4">
                                    {errorForm && <span className='text-red-600'>{(errorForm || 'Invalid email or password!')}</span>}
                                    <Button className='text-white bg-blue-1 hover:bg-blue-2 focus:ring-4 focus:ring-blue-2 rounded-md text-base h-[48px] font-bold focus:outline-none w-full' type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                                        <h5>{t('changePassword')}</h5>
                                    </Button>
                                </Col>

                            </Form>
                        )}
                    </Formik>
                </Col>
            </Modal>
        </>
    )
}

export default AccountTab