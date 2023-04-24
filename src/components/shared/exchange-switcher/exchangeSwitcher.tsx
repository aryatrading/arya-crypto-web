import { FC } from "react";
import { Col, Row } from "../layout/flex";
import { ArrowDownCircleIcon } from "@heroicons/react/24/solid"
import { useSelector } from "react-redux";
import { selectExchangeDataStatus, selectSelectedExchange } from "../../../services/redux/exchangeSlice";
import { priceFormat } from "../../../utils/helpers/prices";
import LoadingSpinner from "../loading-spinner/loading-spinner";
import AsyncStatusWrapper from "../async-status-wrapper/async-status-wrapper";


const ExchangeSwitcher: FC = () => {

    const selectedExchange = useSelector(selectSelectedExchange);
    const selectExchangeLoadingStatus = useSelector(selectExchangeDataStatus);

    return (
        <AsyncStatusWrapper
            asyncStatus={selectExchangeLoadingStatus}
            whenIdleComponent={<LoadingSpinner />}
            whenPendingComponent={<LoadingSpinner />}
            whenRejectedComponent={<p>Error</p>}
        >
            <Col className="col-span-12 items-start">
                <Row className="items-center justify-center gap-2">
                    <h3 className="text-2xl font-bold">{selectedExchange?.name}</h3>
                    <div><ArrowDownCircleIcon height="20px" width="20px" /></div>
                </Row>
                <Row>
                    <h3 className="text-3xl font-bold">${priceFormat(selectedExchange?.portfolioValue ?? 0, true)} <span className="text-base">USD</span></h3>
                </Row>
            </Col>
        </AsyncStatusWrapper>
    )
}

export default ExchangeSwitcher;