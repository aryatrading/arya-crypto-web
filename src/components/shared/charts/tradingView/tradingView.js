// TradingViewWidget.jsx

import React, { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "next-i18next";

let tvScriptLoadingPromise;

export default function TradingViewWidget({ height, asset }) {

  const onLoadScriptRef = useRef();
  const { i18n } = useTranslation();

  const graphId = useMemo(() => {
    return `asset-${asset}`
  }, [asset])

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
        document.getElementById(graphId) &&
        "TradingView" in window
      ) {
        new window.TradingView.widget({
          width: '100%',
          height: height.height,
          symbol: `BINANCE:${asset}`,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: i18n.language,
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          container_id: graphId,
        });
      }
    }
  }, [asset]);

  return (
    <div className="h-3/5r">
      <div id={graphId} />
    </div>
  );
}
