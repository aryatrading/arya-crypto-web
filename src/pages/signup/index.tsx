import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { AuthAction, withAuthUser } from 'next-firebase-auth'
import Layout from '../../components/layout/layout'
import Signup from '../../components/app/signup/signup'


const SignUpPage = () => {
  return (
    <Layout >
      <Signup />
    </Layout>
  )
}


export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(SignUpPage)

export const getStaticProps: GetStaticProps<any> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', [
      'common', 'auth', 'nav'
    ])),
  },
})