import { useAuthUser } from "next-firebase-auth";
import { FC } from "react";

import Dashboard from "../dashboard/dashboard";

import { PortfolioSalesPage } from "../dashboard/salesPage";

const Portfolio: FC = () => {

    const authUser = useAuthUser();

    if (authUser.id) {
        return <Dashboard />
    } else {
        return (
            <PortfolioSalesPage />
        );
    }

}

export default Portfolio;