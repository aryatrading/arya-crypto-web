import { withAuthUser, AuthAction } from 'next-firebase-auth'
import Layout from '../../components/layout/layout'
import PageLoader from '../../components/shared/pageLoader/pageLoader'
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