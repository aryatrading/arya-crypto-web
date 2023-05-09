import { setConnectedExchanges, setExchangeStoreAsyncStatus, setExchangeStoreError, setSelectedExchange } from "../../services/redux/exchangeSlice";
import { getConnectedProviders } from "../../services/controllers/market";
import { ExchangeType } from "../../types/exchange.types";
import StatusAsync from "../../utils/status-async";
import { store } from "../../services/redux/store";
import { overallExchangeName } from "../../utils/constants/dashboard";

export const initStoreData = () => {
    initExchangeStore();
}

async function initExchangeStore() {
    store?.dispatch(setExchangeStoreAsyncStatus(StatusAsync.PENDING));
    await Promise.all([
        initConnectedProviders(),
    ]).then(() => {
        store?.dispatch(setExchangeStoreAsyncStatus(StatusAsync.RESOLVED));
    }).catch((error) => {
        store?.dispatch(setExchangeStoreError(error));
        store?.dispatch(setExchangeStoreAsyncStatus(StatusAsync.REJECTED));
    });
}

async function initConnectedProviders() {
    return await getConnectedProviders().then((res) => {
        const exchanges: ExchangeType[] = res.data;
        if (exchanges?.length) {
            const overallExchange = exchanges.find((exchange) => (exchange.name === overallExchangeName))
            store?.dispatch(setSelectedExchange(overallExchange ? { ...overallExchange } : { ...exchanges[0] }))
            store?.dispatch(setConnectedExchanges(exchanges));
        }
    });
}