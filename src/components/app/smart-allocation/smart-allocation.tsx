import { FC } from "react";
import AuthedSmartAllocation from "./authed-smart-allocation/authed-smart-alocation";
import { useAuthUser } from "next-firebase-auth";
import PageLoader from "../../shared/pageLoader/pageLoader";
import SmartAllocationSalesPage from "./salesPage";

const SmartAllocation: FC = () => {

    const authUser = useAuthUser();

    if (authUser) {
        if (authUser.id != null) {
            return (
                <AuthedSmartAllocation />
            )
        } else {
            return (
                <SmartAllocationSalesPage />
            );
        }

    } else {
        return <PageLoader />
    }

}


export default SmartAllocation;