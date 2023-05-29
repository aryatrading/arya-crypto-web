import { FC, useEffect, useMemo, useRef } from "react";
import {
  createChart,
  CrosshairMode,
  ColorType,
  PriceScaleMode,
  BarPrice,
} from "lightweight-charts";
import colors from "tailwindcss/colors";

import { Col } from "../../layout/flex";

import { GraphChartType } from "./graph.type";
import clsx from "clsx";
import { shortNumberFormat } from "../../../../utils/helpers/prices";
import { useResponsive } from "../../../../context/responsive.context";

const LineChart: FC<GraphChartType> = ({
  primaryLineData,
  secondaryLineData: secondaryData,
  className,
  fixed = true,
  isLoading = false,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const {isTabletOrMobileScreen} = useResponsive();

  useEffect(() => {
    if (!chartContainerRef?.current || !primaryLineData) {
      return;
    }

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef?.current, {
      width: chartContainerRef?.current?.clientWidth,
      height: chartContainerRef?.current?.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "#00000000" },
        textColor: "#6B7280",
        fontSize: 12,
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: !isTabletOrMobileScreen,
          color: "#1F2A41",
        },
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
      },
      leftPriceScale: {
        borderVisible: false,
        autoScale: true,
        visible: !isTabletOrMobileScreen,
        mode: PriceScaleMode.Normal,
      },
      rightPriceScale: {
        visible: false,
      },
      timeScale: {
        borderColor: "#1F2A41",
        visible: !isTabletOrMobileScreen,
        timeVisible: true,
        secondsVisible: false,
      },
      handleScale: !fixed,
      handleScroll: !fixed,
    });

    chart.timeScale().fitContent();

    const series = chart.addLineSeries({
      color: colors.blue[500],
      priceLineVisible: false,
      lastValueVisible: true,
      priceFormat: {
        type: "custom",
        formatter: (priceValue: BarPrice) => {
          return shortNumberFormat(priceValue);
        },
      },
    });

    series.setData(
      primaryLineData.map((d) => ({ time: d.time, value: d.value }))
    );

    if (secondaryData) {
      const series2 = chart.addLineSeries({
        color: colors.yellow[500],
        priceLineVisible: false,
        lastValueVisible: true,
      });
      series2.setData(secondaryData);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [fixed, isTabletOrMobileScreen, primaryLineData, secondaryData]);



  const loadingOverlay = useMemo(() => {
    if (isLoading) {
      return (
        <Col className="items-center justify-center bg-[#00000080] absolute w-full h-full z-10">
          <p className="text-2xl font-bold">Calculating...</p>
        </Col>
      )
    }
  }, [isLoading]);

  return (
    <>
      {primaryLineData ? (
        <Col reference={chartContainerRef} className={clsx('relative', className)} >
          {loadingOverlay}
        </Col>
      ) : (
        <></>
      )}
    </>
  );
};

export default LineChart;
