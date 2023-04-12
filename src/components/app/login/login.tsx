import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { FC, useCallback, useMemo, useState } from "react";
import * as Yup from 'yup';


import Button from "../../shared/buttons/button";
import { LoginFormValues } from "./login.types";
import { Col, Row } from "../../shared/layout/flex";
import { MODE_DEBUG } from "../../../utils/constants/config";
import { images } from "../../../assets/images/images";
import { loginUserEmailPassword } from "../../../services/firebase/auth/auth";




const Login: FC = () => {
    const [is2FALoading, setIs2FALoading] = useState<boolean>(false)
    const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false)
    const [errorForm, setError] = useState<string | null>()


    const disabledBtn = isLoginLoading || is2FALoading;



    const loginFormSchema = useCallback(() => {
        return Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().min(2).required(),
        });
    }, [])


    const onGoogleAuth = async () => {
        setIs2FALoading(true)
        try {
            // await googleAuth()
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
            // await appleAuth()
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
                    loginUserEmailPassword(values).then((res) => {
                        console.log({res})
                    })
                        .finally(() => {
                            setSubmitting(false);
                        })
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col w-full gap-10">
                        <Col className="gap-1">
                            <Field className="w-full h-12 p-3 rounded-md bg-white text-black" type="email" name="email" />
                            <ErrorMessage name="email" component="p" className="text-red-400" />
                        </Col>
                        <Col className="gap-1">
                            <Field className="w-full h-12 p-3 rounded-md bg-white text-black" type="password" name="password" />
                            <ErrorMessage name="password" component="p" className="text-red-400" />
                        </Col>
                        <div className='wb-100 aife'>
                            <Link href={'/forgot-password'} className="description-text">
                                <p>Forgot Password?</p>
                            </Link>
                        </div>
                        <Button className='bw-btn btn' type="submit" disabled={disabledBtn} isLoading={isSubmitting}>
                            <h5>
                                Login
                            </h5>
                        </Button>
                        {errorForm && <span className='input-error'>{(errorForm)}</span>}

                    </Form>
                )}
            </Formik>
        )
    }, [])


    return (
        <Row className='h-full items-center justify-center'>
            <Col className='flex items-center justify-center flex-1 gap-10'>
                <Image src={images.logo} alt="logo"></Image>
                <h3>The app to trade and invest your cryptos on Binance</h3>
                <Image alt="" src={images.login} />
            </Col>
            <Col className='flex flex-1 items-start justify-center'>
                <Col className="justify-start w-full max-w-[400px] gap-10">
                    <h1>ARYA login</h1>
                    {loginForm}
                    <Col className='gap-10 items-center justify-center'>
                        <h6 className="">Or</h6>
                        <Row className="gap-10">
                            <Button className='' onClick={onGoogleAuth}
                                disabled={is2FALoading}>
                                googleIcon
                            </Button>
                            <Button className='' onClick={onAppleAuth}
                                disabled={is2FALoading}>
                                appleIcon
                            </Button>
                        </Row>
                        <Row className="gap-2">
                            <h5 className="">New to Arya crypto?</h5>
                            <Link href={'/signup'} className="la-signup-link"><h5>Signup</h5></Link>
                        </Row>
                    </Col>
                </Col>
            </Col>
        </Row>
    )
}

export default Login;