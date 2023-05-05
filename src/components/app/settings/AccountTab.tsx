import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ErrorMessage, Form, Formik } from "formik";
import { useAuthUser } from 'next-firebase-auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Col, Row } from '../../shared/layout/flex';
import { Modal } from '../modal';
import Button from '../../shared/buttons/button';
import TextInput from '../../shared/form/inputs/textInput';
import { changePassword } from '../../../services/firebase/auth/auth';

interface InputTypes {
    label: string,
    value: string,
}

const Input = ({ label, value }: InputTypes) => {
    return (
        <Col className='gap-2'>
            <label className="block text-sm font-medium text-white">{label}</label>
            <input
                className='bg-grey-2 text-white text-sm rounded-lg block w-[370px] p-2.5 opacity-60'
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

    return (
        <>
            <Col className='gap-4'>
                <Col className='gap-6'>
                    <Row className='gap-6 flex-wrap'>
                        <Col className='gap-2'>
                            <Input label={t('common:name')} value={displayName?.replace('+', ' ') || ''} />
                        </Col>
                        <Col className='gap-2'>
                            <Input label={t('common:email')} value={email || ''} />
                        </Col>
                    </Row>
                    <Col className='gap-2'>
                        <label className="block text-sm font-medium text-white">{t('common:password')}</label>
                        <Button
                            className="text-white font-medium rounded-lg text-sm px-5 bg-grey-2 w-[300px] py-2.5"
                            onClick={showCPModal}>
                            {t('changePassword')}
                        </Button>
                    </Col>
                </Col>
            </Col>

            <Modal isVisible={showChangePasswordModal} size='md'>
                <Col className='min-h-[200px] p-5 bg-black-2'>
                    <Button className='self-end' onClick={hideCPModal}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 13L2 2" stroke="#D6D6D6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M13 2L2 13" stroke="#D6D6D6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </Button>

                    <h1 className='font-bold text-3xl mb-10'>{t('changePassword')}</h1>

                    <Formik
                        innerRef={ref}
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
                                    <TextInput type="password" name="currentPassword" label={t('currentpassword')} />
                                    <ErrorMessage name="currentPassword" component="p" className="text-red-400" />
                                </Col>
                                <Col>
                                    <TextInput type="password" name="newPassword" label={t('newPassword')} />
                                    <ErrorMessage name="newPassword" component="p" className="text-red-400" />
                                </Col>
                                <Col>
                                    <TextInput type="password" name="confirmNewPassowrd" label={t('confirmNewPassword')} />
                                    <ErrorMessage name="confirmNewPassowrd" component="p" className="text-red-400" />
                                </Col>
                                <Col className="items-center gap-4 mt-6 mb-4">
                                    {errorForm && <span className='text-red-600'>{(errorForm || 'Invalid email or password!')}</span>}
                                    <Button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 focus:outline-none w-full' type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
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