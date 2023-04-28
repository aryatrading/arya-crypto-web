import { AnyAction, Dispatch, Store } from "@reduxjs/toolkit";

import { setConnectedExchanges, setExchangeStoreAsyncStatus, setExchangeStoreError, setSelectedExchange } from "../../services/redux/exchangeSlice";
import { getConnectedProviders } from "../../services/controllers/market";
import { ExchangeType } from "../../types/exchange.types";
import StatusAsync from "../../utils/status-async";

export const initStoreData = (store: Store<any, AnyAction>) => {
    initExchangeStore(store.dispatch);
}

async function initExchangeStore(dispatch: Dispatch<AnyAction>) {
    dispatch(setExchangeStoreAsyncStatus(StatusAsync.PENDING));
    await Promise.all([
        initConnectedProviders(dispatch),
    ]).then(() => {
        dispatch(setExchangeStoreAsyncStatus(StatusAsync.RESOLVED));
    }).catch((error) => {
        dispatch(setExchangeStoreError(error));
        dispatch(setExchangeStoreAsyncStatus(StatusAsync.REJECTED));
    });
}

async function initConnectedProviders(dispatch: Dispatch<AnyAction>) {
    return await getConnectedProviders().then((res) => {
        const exchanges: ExchangeType[] = res.data;
        if (exchanges?.length) {
            dispatch(setSelectedExchange({...exchanges[0]}))
            dispatch(setConnectedExchanges(exchanges));
        }
    });
}