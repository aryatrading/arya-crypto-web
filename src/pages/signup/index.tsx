import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { AuthAction, withAuthUser } from 'next-firebase-auth'
import { useTranslation } from 'next-i18next'
import Layout from '../../components/layout/layout'
import Signup from '../../components/app/signup/signup'
import SEO from '../../components/seo'


const SignUpPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO title={t<string>("signup")} />
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
    ...(await serverSideTranslations(locale ?? 'en')),
  },
})