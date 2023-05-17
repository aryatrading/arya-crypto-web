import { FC } from "react";
import { Col } from "../layout/flex";
import LoadingSpinner from "../loading-spinner/loading-spinner";

const PageLoader: FC = () => (
    <Col className="w-full h-[calc(100vh_-_7rem)] md:h-[calc(100vh_-_7rem_-_60px)] items-center justify-center">
        <Col className="w-40 h-40 bg-slate-50 rounded-md">
            <LoadingSpinner />
        </Col>
    </Col>
)

export default PageLoader;