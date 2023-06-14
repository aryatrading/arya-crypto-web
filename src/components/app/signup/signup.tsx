import { FC, useCallback, useMemo, useState } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import * as Yup from 'yup';

import Button from "../../shared/buttons/button";
import { Col, Row } from "../../shared/layout/flex";
import { MODE_DEBUG } from "../../../utils/constants/config";
import { registerUser, appleAuth, googleAuth } from "../../../services/firebase/auth/auth";
import TextInput from "../../shared/form/inputs/textInput/input";
import { logoIcon } from "../../../../public/assets/images/svg";
import { apple, google } from "../../../../public/assets/images/svg/auth";
import { useAuthModal } from "../../../context/authModal.context";


const Signup: FC<any> = (props: any) => {
    const { t } = useTranslation(['auth', 'common']);
    const { hideModal } = useAuthModal();
    const [is2FALoading, setIs2FALoading] = useState<boolean>(false)
    const [errorForm, setError] = useState<string | null>()
    const { back } = useRouter()

    const signupValidationScheme = useCallback(() => {
        return Yup.object().shape({
            name: Yup.string().min(2, t('common:min', { number: 2 }).toString()).required(),
            email: Yup.string().email().required(t('common:required').toString()),
            password: Yup.string().min(2, t('common:min', { number: 2 }).toString()).required(),
        });
    }, [t])


    const onGoogleAuth = async () => {
        setIs2FALoading(true)
        try {
            await googleAuth()
            hideModal()
            back()
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
            hideModal()
            back()
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
                        .then(() => {
                            hideModal()
                            back()
                        })
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
                            <Button className='text-white  focus:ring-4 font-medium rounded-lg text-sm py-2.5 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 w-full' type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                                <h5>{t('common:signup')}</h5>
                            </Button>
                        </Col>

                    </Form>
                )}
            </Formik>
        )
    }, [back, errorForm, hideModal, signupValidationScheme, t])

    return (
        <Row className='h-full w-full items-center justify-center'>
            <Col className="justify-start w-full max-w-[500px] gap-8 flex-1">
                <Row className="items-center gap-4">
                    <Image src={logoIcon} alt="Arya_Crypto" />
                    <h3 className="font-extrabold text-white header-label">{t('signupHeader')}</h3>
                </Row>
                {signupForm}
                <Row className="gap-1 font-semibold text-sm self-center">
                    <h5 className="">{t('haveAccount')}</h5>
                    {props.changeSection ?
                        <Button onClick={() => props.changeSection('login')} className='text-blue-1'><h5>{t('common:signin')}</h5></Button>
                        :
                        <Link href={'/login'} className='text-blue-1'><h5>{t('common:signin')}</h5></Link>
                    }
                </Row>
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
                    <Col className="font-semibold text-sm items-center">
                        <h5 className="">{t('ByProceedingYouAgreeToARYACryptos')}</h5>
                        <Row className="gap-1">
                            <Button className='text-blue-1'><h5>{t('TU')}</h5></Button>
                            &
                            <Button className='text-blue-1'><h5>{t('Pp')}</h5></Button>
                        </Row>
                    </Col>
                </Col>
            </Col>
        </Row>
    )
}

export default Signup;