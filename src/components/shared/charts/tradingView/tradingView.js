// TradingViewWidget.jsx

import React, { useEffect, useRef } from "react";

let tvScriptLoadingPromise;

export default function TradingViewWidget() {
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (
        document.getElementById("tradingview_d2d35") &&
        "TradingView" in window
      ) {
        new window.TradingView.widget({
          width: '100%',
          height: 400,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          // TODO: ad fr localization when reading value from firebase
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          container_id: "tradingview_d2d35",
        });
      }
    }
  }, []);

  return (
    <div className="h-3/5r">
      <div id="tradingview_d2d35" />
      <a
        href="https://www.tradingview.com/symbols/NASDAQ-AAPL/"
        rel="noopener"
        target="_blank"
      >
      </a>
    </div>
  );
}
