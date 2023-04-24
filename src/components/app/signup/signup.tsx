import { FC, useCallback, useMemo, useState } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import * as Yup from 'yup';

import Button from "../../shared/buttons/button";
import { Col, Row } from "../../shared/layout/flex";
import { MODE_DEBUG } from "../../../utils/constants/config";
import { registerUser, appleAuth, googleAuth } from "../../../services/firebase/auth/auth";
import TextInput from "../../shared/form/inputs/textInput/input";
import { images } from '../../../assets/images';

import styles from './signup.module.scss';

const Signup: FC<any> = (props: any) => {
    const { t } = useTranslation(['auth', 'common']);
    const [is2FALoading, setIs2FALoading] = useState<boolean>(false)
    const [errorForm, setError] = useState<string | null>()

    const signupValidationScheme = useCallback(() => {
        return Yup.object().shape({
            name: Yup.string().min(2, t('common:nameErrorMsg').toString()).required(),
            email: Yup.string().email().required(t('common:required').toString()),
            password: Yup.string().min(2, t('common:passwordErrorMsg').toString()).required(),
        });
    }, [])


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


    const signupForm = useMemo(() => {
        return (
            <Formik
                initialValues={{ email: '', password: '', name: '' }}
                validationSchema={signupValidationScheme}
                onSubmit={(values, { setSubmitting }) => {
                    registerUser(values)
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
                            <TextInput type="text" name="name" label={t('name')} placeholder={t('namePlaceholder') || ''} />
                            <ErrorMessage name="name" component="p" className="text-red-400" />
                        </Col>
                        <Col>
                            <TextInput type="email" name="email" label={t('common:email')} />
                            <ErrorMessage name="email" component="p" className="text-red-400" />
                        </Col>
                        <Col>
                            <TextInput type="password" name="password" label={t('common:password')} />
                            <ErrorMessage name="password" component="p" className="text-red-400" />
                        </Col>
                        <Col className="items-center gap-4">
                            {errorForm && <span className='text-red-600'>{(errorForm || 'Invalid email or password!')}</span>}
                            <Button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full' type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                                <h5>{t('common:signup')}</h5>
                            </Button>
                        </Col>

                    </Form>
                )}
            </Formik>
        )
    }, [errorForm, signupValidationScheme, t])

    return (
        <Row className='h-full w-full items-center justify-center'>
            <Col className='flex flex-1 items-center justify-center'>
                <Col className="justify-start w-full max-w-[400px] gap-8">
                    <Row className="items-center gap-4">
                        <Image src={images.logoIcon} alt="Arya_Crypto" />
                        <h1 className="font-extrabold dark:text-white header-label">{t('signupHeader')}</h1>
                    </Row>
                    {signupForm}
                    <Row className="gap-1 font-semibold text-sm self-center">
                        <h5 className="">{t('haveAccount')}</h5>
                        {props.changeSection ?
                            <Button onClick={() => props.changeSection('login')} className={styles.signupLabel}><h5>{t('common:signin')}</h5></Button>
                            :
                            <Link href={'/login'} className={styles.signupLabel}><h5>{t('common:signin')}</h5></Link>
                        }
                    </Row>
                    <Col className='gap-6 items-center justify-center'>
                        <Row className="w-full items-center gap-3">
                            <Col className={styles['left-border-side']} />
                            <h6 className="font-semibold text-lg">{t('or')}</h6>
                            <Col className={styles['left-border-side']} />
                        </Row>
                        <Row className="gap-8">
                            <Button className='' onClick={onGoogleAuth}
                                disabled={is2FALoading}>
                                <Image src={images.google} alt="Google_Icon" />
                            </Button>
                            <Button className='' onClick={onAppleAuth}
                                disabled={is2FALoading}>
                                <Image src={images.apple} alt="Apple_Icon" />
                            </Button>
                        </Row>
                        <Col className="font-semibold text-sm items-center">
                            <h5 className="">{t('ByProceedingYouAgreeToARYACryptos')}</h5>
                            <Row className="gap-1">
                                <Button className={styles.signupLabel}><h5>{t('TU')}</h5></Button>
                                &
                                <Button className={styles.signupLabel}><h5>{t('Pp')}</h5></Button>
                            </Row>
                        </Col>
                    </Col>
                </Col>
            </Col>
        </Row>
    )
}

export default Signup;