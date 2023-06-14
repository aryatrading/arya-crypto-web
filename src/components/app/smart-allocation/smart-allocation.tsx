import { FC } from "react";
import AuthedSmartAllocation from "./authed-smart-allocation/authed-smart-alocation";
import { useAuthUser } from "next-firebase-auth";
import PageLoader from "../../shared/pageLoader/pageLoader";

const SmartAllocation: FC = () => {


    const authUser = useAuthUser();

    if (authUser.clientInitialized) {
        if (!authUser.id) {
            return (
                <>Login please</>
            );
        } else {
            console.log(authUser.id)
            return <AuthedSmartAllocation />
        }
    } else {
        return <PageLoader />
    }
    

}


export default SmartAllocation;