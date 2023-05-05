import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosConfig";
import { setConnectedExchanges, setSelectedExchange } from "../redux/exchangeSlice";
import { store } from "../redux/store";
import { ExchangeType } from "../../types/exchange.types";

export const deleteExchange = async (id?: string | number, closeModal?: any) => {
    await axiosInstance.delete(`/exchange/keys?provider=${id}`);
    const overAll = store.getState().exchange.data.connectedExchanges.filter((e: any) => e.provider_id == null)[0];
    const connectedProvider = store.getState().exchange.data.connectedExchanges.filter((e: any) => e.provider_id !== id);
    store.dispatch(setSelectedExchange(overAll));
    store.dispatch(setConnectedExchanges(connectedProvider));

    closeModal();

    toast.success("Discconected successfully");
};

export const addExchange = async (id?: string | number, fullExchange?: ExchangeType, setSelected?: any) => {
    await axiosInstance.post(`/exchange/keys?provider=${id}`, {
        name: fullExchange?.name,
        public_key: fullExchange?.public_key,
        private_key: fullExchange?.private_key,
        creation_date: fullExchange?.creation_date
    });
    const connectedProvider = store.getState().exchange.data.connectedExchanges;
    delete fullExchange?.create;
    setSelected(fullExchange);
    store.dispatch(setConnectedExchanges([fullExchange, ...connectedProvider]));
};

export const changeExchangeName = async (id?: string | number, name?: string, setSelected?: any) => {
    await axiosInstance.post(`/exchange/keys?provider=${id}`, {
        name: name,
    });
    const exchangeToBeUpdated = store.getState().exchange.data.connectedExchanges.filter((e: any) => e.provider_id === id);
    const connectedExchanges = store.getState().exchange.data.connectedExchanges;
    const arr = connectedExchanges;

    store.dispatch(setConnectedExchanges(arr.map((e: any) => e.provider_id === exchangeToBeUpdated[0].provider_id ? { ...exchangeToBeUpdated[0], name } : e)));
    store.dispatch(setSelectedExchange({ ...exchangeToBeUpdated[0], name }));
    setSelected({ ...exchangeToBeUpdated[0], name });
};