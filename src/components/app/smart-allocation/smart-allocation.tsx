import { FC } from "react";
import { Col } from "../../shared/layout/flex";
import AuthedSmartAllocation from "./authed-smart-allocation/authed-smart-alocation";
import { useAuthUser } from "next-firebase-auth";

const SmartAllocation: FC = () => {

    const authUser = useAuthUser();

    if (authUser) {

        return (
            <AuthedSmartAllocation />
        )

    } else {
        return <>Login please</>
    }
}


export default SmartAllocation;