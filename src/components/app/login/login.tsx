import { FC, useCallback, useMemo, useState } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import * as Yup from 'yup';
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import Button from "../../shared/buttons/button";
import { Col, Row } from "../../shared/layout/flex";
import { MODE_DEBUG } from "../../../utils/constants/config";
import { loginUserEmailPassword, appleAuth, googleAuth } from "../../../services/firebase/auth/auth";
import TextInput from "../../shared/form/inputs/textInput/input";
import { useAuthModal } from "../../../context/authModal.context";
import { apple, google } from "../../../../public/assets/images/svg/auth";
import { logoIcon } from "../../../../public/assets/images/svg";

const Login: FC<any> = (props: any) => {
    const { t } = useTranslation(['auth', 'common']);
    const { hideModal } = useAuthModal();
    const router = useRouter();
    const [is2FALoading, setIs2FALoading] = useState<boolean>(false)
    const [errorForm, setError] = useState<string | null>()

    const loginFormSchema = useCallback(() => {
        return Yup.object().shape({
            email: Yup.string().email().required(t('common:required').toString()),
            password: Yup.string().min(2, t('common:passwordErrorMsg').toString()).required(),
        });
    }, [t])


    const onGoogleAuth = async () => {
        setIs2FALoading(true)
        try {
            await googleAuth()
        } catch (error) {
            if (MODE_DEBUG) {
                console.log(error)
            }
        } finally {
            setIs2FALoading(false)
        }
    }

    const onAppleAuth = async () => {
        setIs2FALoading(true)
        try {
            await appleAuth()
        } catch (error) {
            if (MODE_DEBUG) {
                console.log(error)
            }
        } finally {
            setIs2FALoading(false)
        }
    }


    const loginForm = useMemo(() => {
        return (
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginFormSchema}
                onSubmit={(values, { setSubmitting }) => {
                    loginUserEmailPassword(values)
                        .catch(err => {
                            setError(err.message);
                        })
                        .finally(() => {
                            setSubmitting(false);
                        })
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col w-full gap-4">
                        <Col>
                            <TextInput type="email" name="email" label={t('common:email')} />
                            <ErrorMessage name="email" component="p" className="text-red-400" />
                        </Col>
                        <Col>
                            <TextInput type="password" name="password" label={t('common:password')} />
                            <ErrorMessage name="password" component="p" className="text-red-400" />
                        </Col>
                        <div className='wb-100 aife self-end font-semibold text-sm'>
                            <Button className="description-text" onClick={() => {
                                hideModal();
                                router.push('/forgot-password');
                            }}>
                                <p>{t('forgetPassword')}</p>
                            </Button>
                        </div>
                        <Col className="items-center gap-4">
                            {errorForm && <span className='text-red-600'>{(errorForm || 'Invalid email or password!')}</span>}
                            <Button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 w-full' type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                                <h5>{t('common:signin')}</h5>
                            </Button>
                        </Col>

                    </Form>
                )}
            </Formik>
        )
    }, [errorForm, hideModal, loginFormSchema, router, t])

    return (
        <Row className='h-full w-full items-center justify-center'>
            <Col className='flex flex-1 items-center justify-center'>
                <Col className="justify-start w-full max-w-[400px] gap-8">
                    <Row className="items-center gap-4">
                        <Image src={logoIcon} alt="Arya_Crypto" />
                        <h1 className="font-extrabold text-white header-label">{t('loginHeader')}</h1>
                    </Row>
                    {loginForm}
                    <Col className='gap-6 items-center justify-center'>
                        <Row className="w-full items-center gap-3">
                            <Col className='flex-1 h-px bg-white' />
                            <h6 className="font-semibold text-lg">{t('or')}</h6>
                            <Col className='flex-1 h-px bg-white' />
                        </Row>
                        <Row className="gap-8">
                            <Button className='' onClick={onGoogleAuth}
                                disabled={is2FALoading}>
                                <Image src={google} alt="Google_Icon" />
                            </Button>
                            <Button className='' onClick={onAppleAuth}
                                disabled={is2FALoading}>
                                <Image src={apple} alt="Apple_Icon" />
                            </Button>
                        </Row>
                        <Row className="gap-1 font-semibold text-sm">
                            <h5 className="">{t('newToCrypto')}</h5>
                            {props.changeSection ?
                                <Button onClick={() => props.changeSection('signup')} className='text-blue-1'><h5>{t('common:signup')}</h5></Button>
                                :
                                <Link href={'/signup'} className='text-blue-1'><h5>{t('common:signup')}</h5></Link>
                            }
                        </Row>
                    </Col>
                </Col>
            </Col>
        </Row>
    )
}

export default Login;