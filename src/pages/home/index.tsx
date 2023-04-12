import { withAuthUser, AuthAction } from 'next-firebase-auth'
import Layout from '../../components/layout/layout'

const HomePage = () => (
    <Layout>
        <div>My home page</div>
    </Layout>
)

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    authPageURL: '/login/',
})(HomePage)