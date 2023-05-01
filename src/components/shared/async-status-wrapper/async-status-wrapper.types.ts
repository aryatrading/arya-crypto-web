import StatusAsync from "../../../utils/status-async";

export type AsyncStatusWrapperType = {
    children: any,
    asyncStatus: StatusAsync,
    whenIdleComponent: any,
    whenPendingComponent: any,
    whenRejectedComponent: any,
}