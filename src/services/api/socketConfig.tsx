import { dispatchAction } from "../../utils/global_dispatch";
import { fetchAssets, fetchSymbolsList } from "../controllers/market";
import { pricechange } from "../redux/marketSlice";

var W3CWebSocket = require("websocket").w3cwebsocket;

const channel = `${process.env.NEXT_PUBLIC_TWELEVE_SOCKET}?apikey=${process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY}`;

const socket = new W3CWebSocket(channel);

socket.onopen = async () => {
  let _assets = await fetchAssets();

  let _list = await fetchSymbolsList(_assets);

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
    dispatchAction(pricechange({ symbol: _symbol, price }));
  }
};
