import { useCallback, useMemo, useState } from 'react'
import { withAuthUser, AuthAction } from 'next-firebase-auth'
import { Formik, Form, ErrorMessage } from 'formik';
import { useRouter } from 'next/router'
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '../../components/layout/layout'
import PageLoader from '../../components/shared/pageLoader/pageLoader'
import { Col, Row } from '../../components/shared/layout/flex';
import TextInput from '../../components/shared/form/inputs/textInput/input';
import Button from '../../components/shared/buttons/button';
import { resetPassword } from '../../services/firebase/auth/auth';

const ForgotPassword = () => {
    const router = useRouter();
    const [errorForm, setError] = useState<string | null>()

    const loginFormSchema = useCallback(() => {
        return Yup.object().shape({
            email: Yup.string().email().required(),
        });
    }, [])

    const forgotPasswordForm = useMemo(() => {
      return (
          <Formik
              initialValues={{ email: ''}}
              validationSchema={loginFormSchema}
              onSubmit={({email}, { setSubmitting }) => {
                resetPassword(email)
                  .then(() => {
                    toast.success(`Reset password link has been sent to ${email}!`, {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      theme: "light",
                      icon: "📨",
                      });
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
                  <Form className="flex flex-col w-full gap-8">
                      <Col>
                          <TextInput type="email" name="email" label="Email" />
                          <ErrorMessage name="email" component="p" className="text-red-400" />
                      </Col>
                      <Col className="items-center gap-4">
                          {errorForm && <span className='text-red-600'>{(errorForm || 'Invalid email format!')}</span>}
                          <Button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full' type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                              <h5>
                                Send reset link
                              </h5>
                          </Button>
                      </Col>

                  </Form>
              )}
          </Formik>
      )
  }, [errorForm, loginFormSchema])

  return (
    <Layout>
      <Row className='h-full items-center justify-center'>
          <Col className='flex flex-1 items-center justify-center'>
              <Col className="justify-start w-full max-w-[400px] gap-8">
                  <Col className='gap-2'>
                    <h1 className="font-extrabold dark:text-white header-label">Reset your password</h1>
                    <h6 className="font-medium dark:text-white">Enter your email address you’re using for your account below and we will send you password reset link.</h6>
                  </Col>
                  {forgotPasswordForm}
                  <Col className='items-center justify-center'>
                      <Button className="font-semibold text-sm" onClick={() => router.back()}>
                          <h5 className="">Back to sign-in</h5>
                      </Button>
                  </Col>
              </Col>
          </Col>
      </Row>
    </Layout>
  )
}


export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  LoaderComponent: PageLoader,
})(ForgotPassword)