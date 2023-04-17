import { withAuthUser, AuthAction } from 'next-firebase-auth'
import Login from '../../components/app/login/login'
import Layout from '../../components/layout/layout'
import PageLoader from '../../components/shared/pageLoader/pageLoader'


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