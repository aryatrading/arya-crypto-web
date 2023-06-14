import { useAuthUser } from "next-firebase-auth";
import { FC } from "react";

import Dashboard from "../dashboard/dashboard";

import { PortfolioSalesPage } from "../dashboard/salesPage";
import PageLoader from "../../shared/pageLoader/pageLoader";
import Layout, { SalesPagesLayout } from "../../layout/layout";

const Portfolio: FC = () => {

    const authUser = useAuthUser();

    if (authUser.clientInitialized) {
        if (!authUser.id !== null) {
            return (
                <SalesPagesLayout>
                    <PortfolioSalesPage />
                </SalesPagesLayout>
            );
        } else {
            return (
                <Layout>
                    <Dashboard />
                </Layout>
            )
        }
    } else {
        return (
            <Layout>
                <PageLoader />
            </Layout>
        )
    }
}

export default Portfolio;