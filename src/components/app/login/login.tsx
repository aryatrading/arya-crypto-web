import { FC, useCallback, useMemo, useState } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import * as Yup from 'yup';
import { useRouter } from "next/router";

import Button from "../../shared/buttons/button";
import { Col, Row } from "../../shared/layout/flex";
import { MODE_DEBUG } from "../../../utils/constants/config";
import { loginUserEmailPassword, appleAuth, googleAuth } from "../../../services/firebase/auth/auth";
import TextInput from "../../shared/form/inputs/textInput/input";
import {images} from '../../../assets/images';
import { useAuthModal } from "../../../context/authModal.context";

import styles from './login.module.scss';

const Login: FC<any> = (props: any) => {
    const {hideModal} = useAuthModal();
    const router = useRouter();
    const [is2FALoading, setIs2FALoading] = useState<boolean>(false)
    const [errorForm, setError] = useState<string | null>()

    const loginFormSchema = useCallback(() => {
        return Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().min(2).required(),
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
                            <TextInput type="email" name="email" label="Email" />
                            <ErrorMessage name="email" component="p" className="text-red-400" />
                        </Col>
                        <Col>
                            <TextInput type="password" name="password" label="Password" />
                            <ErrorMessage name="password" component="p" className="text-red-400" />
                        </Col>
                        <div className='wb-100 aife self-end font-semibold text-sm'>
                            <Button className="description-text" onClick={() => {
                                hideModal();
                                router.push('/forgot-password');
                            }}>
                                <p>Forgot Password?</p>
                            </Button>
                        </div>
                        <Col className="items-center gap-4">
                            {errorForm && <span className='text-red-600'>{(errorForm || 'Invalid email or password!')}</span>}
                            <Button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full' type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                                <h5>
                                    Sign In
                                </h5>
                            </Button>
                        </Col>

                    </Form>
                )}
            </Formik>
        )
    }, [errorForm, hideModal, loginFormSchema, router])

    return (
        <Row className='h-full items-center justify-center'>
            <Col className='flex flex-1 items-center justify-center'>
                <Col className="justify-start w-full max-w-[400px] gap-8">
                    <Row className="items-center gap-4">
                        <Image src={images.logoIcon} alt="Arya_Crypto" />
                        <h1 className="font-extrabold dark:text-white header-label">Login to ARYA Crypto</h1>
                    </Row>
                    {loginForm}
                    <Col className='gap-6 items-center justify-center'>
                        <Row className="w-full items-center gap-3">
                            <Col className={styles['left-border-side']} />
                            <h6 className="font-semibold text-lg">OR</h6>
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
                        <Row className="gap-1 font-semibold text-sm">
                            <h5 className="">New to Arya crypto?</h5>
                            {props.changeSection ? 
                            <Button onClick={() => props.changeSection('signup')} className={styles.signupLabel}><h5>Signup</h5></Button>
                            :
                                <Link href={'/signup'} className={styles.signupLabel}><h5>Signup</h5></Link>
                            }
                        </Row>
                    </Col>
                </Col>
            </Col>
        </Row>
    )
}

export default Login;