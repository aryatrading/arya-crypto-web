import { FC } from "react";
import AuthedSmartAllocation from "./authed-smart-allocation/authed-smart-alocation";
import { useAuthUser } from "next-firebase-auth";
import PageLoader from "../../shared/pageLoader/pageLoader";

const SmartAllocation: FC = () => {

    return (
        <AuthedSmartAllocation />
    )

}


export default SmartAllocation;