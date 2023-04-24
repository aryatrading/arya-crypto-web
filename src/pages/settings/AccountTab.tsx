import { useCallback, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ErrorMessage, Form, Formik } from "formik";


import Layout from '../../components/layout/layout'
import { Col, Row } from '../../components/shared/layout/flex';
import { Modal } from '../../components/app/modal';
import Button from '../../components/shared/buttons/button';
import TextInput from '../../components/shared/form/inputs/textInput';

interface InputTypes {
    label: string,
    value: string,
}

const Input = ({ label, value }: InputTypes) => {
    return (
        <Col className='gap-2'>
            <label className="block text-sm font-medium text-white">{label}</label>
            <input
                className='bg-grey_two text-white text-sm rounded-lg block w-[370px] p-2.5 opacity-60'
                disabled
                defaultValue={value} />
        </Col>
    )
};

const AccountTab = () => {
    const { t } = useTranslation(['settings', 'common']);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState<boolean>(false);

    const [errorForm, setError] = useState<string | null>()

    const showCPModal = useCallback(() => setShowChangePasswordModal(true), []);
    const hideCPModal = useCallback(() => {
        setShowChangePasswordModal(false);
    }, []);

    return (
        <Layout>
            <Col className='gap-4'>
                <Col className='gap-6'>
                    <Row className='gap-6 flex-wrap'>
                        <Col className='gap-2'>
                            <Input label={t('common:name')} value="Abdalla Emad Eldin" />
                        </Col>
                        <Col className='gap-2'>
                            <Input label={t('common:email')} value="aemadeldin@arya.com" />
                        </Col>
                    </Row>
                    <Col className='gap-2'>
                        <label className="block text-sm font-medium text-white">{t('common:password')}</label>
                        <Button
                            className="text-white font-medium rounded-lg text-sm px-5 bg-grey_two w-[300px] py-2.5"
                            onClick={showCPModal}>
                            {t('changePassword')}
                        </Button>
                    </Col>
                </Col>
            </Col>

            <Modal isVisible={showChangePasswordModal} size='md'>
                <Col className='min-h-[200px] p-5 bg-black_two'>
                    <Button className='self-end' onClick={hideCPModal}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 13L2 2" stroke="#D6D6D6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M13 2L2 13" stroke="#D6D6D6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </Button>

                    <h1 className='font-bold text-3xl mb-10'>{t('changePassword')}</h1>

                    <Formik
                        initialValues={{ currentPassword: '', newPassword: '', confirmNewPassowrd: '' }}
                        onSubmit={(values, { setSubmitting, setErrors }) => {
                            if (values.currentPassword !== values.confirmNewPassowrd) {
                                setErrors({
                                    newPassword: t('changePasswordNotMatchErrorMsg').toString()
                                })
                            }

                            setSubmitting(false);
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
                                {errorForm && <span className='input-error'>{(errorForm)}</span>}
                                <Col className="items-center gap-4 mt-6 mb-4">
                                    {errorForm && <span className='text-red-600'>{(errorForm || 'Invalid email or password!')}</span>}
                                    <Button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full' type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                                        <h5>{t('changePassword')}</h5>
                                    </Button>
                                </Col>

                            </Form>
                        )}
                    </Formik>
                </Col>
            </Modal>
        </Layout>
    )
}

export default AccountTab