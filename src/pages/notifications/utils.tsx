import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import ExchangeImage from "../../components/shared/exchange-image/exchange-image";
import { PortfolioDefault } from "../../components/svg/navbar/portfolioIcon";

export const titleColor = (type: string | undefined) => {
    switch (type) {
        case "BUY_ORDER":
            return 'text-green-1';
        case "KEYS_EXPIRATION_SOON":
        case "KEYS_EXPIRED":
        case "STOP_LOSS_EXECUTED":
            return 'text-red-1';
        case "TAKE_PROFIT_EXECUTED":
        case "SMART_ALLOCATION_REBALANCED":
            return 'text-blue-1';
        default:
            return 'text-white';
    }
}

const notificationIcon = (type: string, id?: number) => {
    switch (type) {
        case "BUY_ORDER":
        case "SELL_ORDER":
        case "TAKE_PROFIT_EXECUTED":
        case "STOP_LOSS_EXECUTED":
        case "TRAILIING_EXECUTED":
            return <ExchangeImage providerId={id} width={26} height={26} />
        case "KEYS_EXPIRATION_SOON":
        case "KEYS_EXPIRED":
            return <Cog6ToothIcon className="stroke-current w-7 h-7" />;
        case "SMART_ALLOCATION_REBALANCED":
        case "EXIT_STRATEGY_EXECUTED":
            return <PortfolioDefault className="stroke-white w-7 h-7" color="#0E1421" fill="white" />;
    }
}

export default notificationIcon;