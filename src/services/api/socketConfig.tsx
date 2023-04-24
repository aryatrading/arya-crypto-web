import { fetchAssets, fetchSymbolsList } from "../controllers/market";
import { pricechange } from "../redux/marketSlice";
import { store } from "../redux/store";

var W3CWebSocket = require("websocket").w3cwebsocket;

const channel = `${process.env.NEXT_PUBLIC_TWELEVE_SOCKET}?apikey=${process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY}`;

const socket = new W3CWebSocket(channel);

socket.onopen = async () => {
  await fetchAssets();
  let _list = await fetchSymbolsList();

  socket.send(
    JSON.stringify({
      action: "subscribe",
      params: {
        symbols: _list,
      },
    })
  );
};

socket.onerror = (error: any) => {
  console.log(`Error with web socket connection: ${error}`);
  socket.close();
};

socket.onmessage = function (e: any) {
  const { price, symbol } = JSON.parse(e.data);

  let _symbol = symbol?.split("/")[0].toLowerCase();

  if (price && _symbol) {
    store.dispatch(pricechange({ symbol: _symbol, price }));
  }
};
