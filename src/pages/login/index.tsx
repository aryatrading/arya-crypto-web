import { GetStaticProps } from 'next'
import { withAuthUser } from 'next-firebase-auth'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Login from '../../components/app/login/login'
import Layout from '../../components/layout/layout'


const LoginPage = (props: any) => {
  return (
    <Layout >
      <Login />
    </Layout>
  )
}


export default withAuthUser({
  // whenAuthed: AuthAction.REDIRECT_TO_APP,
  // whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  // whenUnauthedAfterInit: AuthAction.RENDER,
  // LoaderComponent: PageLoader,
})(LoginPage)

export const getStaticProps: GetStaticProps<any> = async ({
  locale,
}) => ({
  props: {
      ...(await serverSideTranslations(locale ?? 'en', [
          'common', 'auth',
      ])),
  },
})