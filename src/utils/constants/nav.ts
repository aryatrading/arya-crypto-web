import HomeDefault, { HomeHover } from "../../components/svg/navbar/homeIcon";
import { MarketDefault, MarketHover } from "../../components/svg/navbar/marketIcon";
import PortfolioHover, { PortfolioDefault } from "../../components/svg/navbar/portfolioIcon";
import { TradeDefault, TradeHover } from "../../components/svg/navbar/tradeIcon";

export const navLinkData = [
    {
        title: 'portfolio',
        route: '/home',
        Icon: HomeDefault,
        Hover :HomeHover
    },
    {
        title: 'smartAllocation',
        route: '/smart-allocation',
        Icon: PortfolioDefault,
        Hover: PortfolioHover
    },
    {
        title: 'trade',
        route: '/trade',
        Icon: TradeDefault,
        Hover: TradeHover
    },
    {
        title: 'market',
        route: '/market',
        Icon: MarketDefault,
        Hover: MarketHover
    }

]