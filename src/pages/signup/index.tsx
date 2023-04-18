import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { withAuthUser } from 'next-firebase-auth'
import Layout from '../../components/layout/layout'
import Signup from '../../components/app/signup/signup'


const SignUpPage = () => {
  return (
    <Layout >
      <Signup/>
    </Layout>
  )
}


export default withAuthUser({
  // whenAuthed: AuthAction.REDIRECT_TO_APP,
  // whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  // whenUnauthedAfterInit: AuthAction.RENDER,
  // LoaderComponent: PageLoader,
})(SignUpPage)

export const getStaticProps: GetStaticProps<any> = async ({
  locale,
}) => ({
  props: {
      ...(await serverSideTranslations(locale ?? 'en', [
          'common', 'auth',
      ])),
  },
})