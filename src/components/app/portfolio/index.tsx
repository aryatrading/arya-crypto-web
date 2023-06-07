import { useAuthUser } from "next-firebase-auth";
import { FC } from "react";

import Dashboard from "../dashboard/dashboard";

import { PortfolioSalesPage } from "../dashboard/salesPage";
import PageLoader from "../../shared/pageLoader/pageLoader";

const Portfolio: FC = () => {

    const authUser = useAuthUser();

    if (authUser.clientInitialized) {
        if (!authUser.id) {
            return (
                <PortfolioSalesPage />
            );
        } else {
            return <Dashboard />
        }
    } else {
        return <PageLoader />
    }
}

export default Portfolio;