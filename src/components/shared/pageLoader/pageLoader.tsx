import { FC } from "react";
import Lottie from "lottie-react";

import { Col } from "../layout/flex";
import LoadingSpinner from "../loading-spinner/loading-spinner";

import loadingLottie from "./loading-lottie.json";

const PageLoader: FC = () => (
    <Col className="w-full h-[calc(100vh_-_7rem)] md:h-[calc(100vh_-_7rem_-_60px)] items-center justify-center">
            <Lottie
                animationData={loadingLottie}
            />
    </Col>
)

export default PageLoader;