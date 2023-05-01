import { FC, useMemo } from "react";
import StatusAsync from "../../../utils/status-async";
import { AsyncStatusWrapperType } from "./async-status-wrapper.types";

const AsyncStatusWrapper: FC<AsyncStatusWrapperType> = ({ children, asyncStatus, whenIdleComponent, whenPendingComponent, whenRejectedComponent }) => {


    return useMemo(() => {
        switch (asyncStatus) {
            case StatusAsync.IDLE:
                return <>{whenIdleComponent}</>
            case StatusAsync.PENDING:
                return <>{whenPendingComponent}</>
            case StatusAsync.RESOLVED:
                return <>{children}</>
            case StatusAsync.REJECTED:
                return <>{whenRejectedComponent}</>
            default:
                return children
        }


    }, [asyncStatus, whenIdleComponent, whenPendingComponent, children, whenRejectedComponent])
}

export default AsyncStatusWrapper;