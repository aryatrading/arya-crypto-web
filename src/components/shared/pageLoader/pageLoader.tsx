import { FC } from "react";
import { Col } from "../layout/flex";
import LoadingSpinner from "../loading-spinner/loading-spinner";

const PageLoader: FC = () => (
    <Col className="w-full h-full bg-black-2 fixed z-30 left-0 top-0 items-center justify-center">
        <Col className="w-40 h-40 bg-slate-50 rounded-md">
            <LoadingSpinner />
        </Col>
    </Col>
)

export default PageLoader;