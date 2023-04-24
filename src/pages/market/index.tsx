import { withAuthUser } from "next-firebase-auth";
import Layout from "../../components/layout/layout";
import PageLoader from "../../components/shared/pageLoader/pageLoader";
import Market from "../../components/app/market/market";
import "../../services/api/socketConfig";

const MarketPage = () => {
  return (
    <Layout>
      <Market />
    </Layout>
  );
};

export default withAuthUser({ LoaderComponent: PageLoader })(MarketPage);
