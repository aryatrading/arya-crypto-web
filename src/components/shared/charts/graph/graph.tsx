import { createChart, CrosshairMode, ColorType, PriceScaleMode, BarPrice, LineData, IChartApi, ISeriesApi } from "lightweight-charts";
import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import colors from "tailwindcss/colors";
import moment from "moment";
import clsx from "clsx";

import { formatNumber, percentageFormat, shortNumberFormat } from "../../../../utils/helpers/prices";
import { useResponsive } from "../../../../context/responsive.context";
import { GraphChartType } from "./graph.type";
import { Col } from "../../layout/flex";
import { TextSkeleton } from "../../skeletons/skeletons";

const LineChart: FC<GraphChartType> = ({
  primaryLineData,
  secondaryLineData,
  className,
  fixed = true,
  isLoading = false,
  tooltip
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const tooltipContainerRef = useRef<HTMLDivElement>(null);

  const { isTabletOrMobileScreen } = useResponsive();

  const getTooltipUI = useCallback((pointValue: number, prevPointValue: number, textColor: string) => {

    const profitChange = `
        <p style="font-size: 24px; margin: 4px 0px; color:${textColor};">
          ${percentageFormat((pointValue - prevPointValue) / prevPointValue * 100)}%
        </p>
    `;

    const value = `
        <p style="font-size: 24px; margin: 4px 0px; color:${textColor};">
          ${formatNumber(pointValue, true)}
        </p>
    `;

    return (`
        ${tooltip.showProfitChange ? profitChange : ''}
        ${tooltip.showValue ? value : ''}
        `);

  }, [tooltip.showProfitChange, tooltip.showValue]);

  const manageTooltip = useCallback((chart: IChartApi, primarySeries: ISeriesApi<"Line">, secondarySeries: ISeriesApi<"Line">) => {
    if (tooltip.show) {
      const toolTipWidth = 170;
      if (tooltipContainerRef.current) {
        if (chartContainerRef.current)
          chartContainerRef.current.appendChild(tooltipContainerRef.current);
      }

      chart.subscribeCrosshairMove(param => {
        if (tooltipContainerRef.current && chartContainerRef.current) {

          if (
            param.point === undefined ||
            !param.time ||
            param.point.x < 0 ||
            param.point.x > chartContainerRef.current.clientWidth ||
            param.point.y < 0 ||
            param.point.y > chartContainerRef.current.clientHeight
          ) {
            tooltipContainerRef.current.style.display = 'none';
          } else {
            tooltipContainerRef.current.style.display = 'block';

            const primaryLine: LineData = param.seriesData.get(primarySeries) as LineData;
            const dateStr = moment(new Date((param.time as number) * 1000)).utcOffset(0).format("DD-MM-YYYY HH:mm");

            const secondaryLine: LineData = param.seriesData.get(secondarySeries) as LineData;
            const primaryPrice = primaryLine?.value ?? 0;
            const secondaryPrice = secondaryLine?.value ?? 0;


            let primaryPrevPointPrice = primaryLineData[0]?.value ?? 0;

            let secondaryPrevPointPrice = secondaryLineData ? (secondaryLineData[0]?.value ?? 0) : 0;

            const secondaryDataTooltip = secondaryLineData ? getTooltipUI(secondaryPrice, secondaryPrevPointPrice, colors.yellow[500]) : '';

            tooltipContainerRef.current.innerHTML =
              `
                  <p>${tooltip.title}</p>
                  ${getTooltipUI(primaryPrice, primaryPrevPointPrice, colors.blue[500])}
                  ${secondaryDataTooltip}
                  <p>${dateStr}</p>
              `;

            let left = param?.point?.x as number;  // relative to timeScale
            const timeScaleWidth = chart.timeScale().width();
            const priceScaleWidth = chart.priceScale('left').width();
            const halfTooltipWidth = toolTipWidth / 2;
            left += priceScaleWidth - halfTooltipWidth;
            left = Math.min(left, priceScaleWidth + timeScaleWidth - toolTipWidth);
            left = Math.max(left, priceScaleWidth);

            tooltipContainerRef.current.style.left = left + 'px';
            tooltipContainerRef.current.style.top = 0 + 'px';

          }
        }
      });
    }
  }, [getTooltipUI, primaryLineData, secondaryLineData, tooltip.show, tooltip.title]);

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
        textColor: isTabletOrMobileScreen ? "#050913" : "#6B7280",
        fontSize: 12,
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: !isTabletOrMobileScreen,
          color: "#6B7280",
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
        borderColor: isTabletOrMobileScreen ? "transparent" : "#1F2A41",
        visible: true,
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

    const series2 = chart.addLineSeries({
      color: colors.yellow[500],
      priceLineVisible: false,
      lastValueVisible: true,
    });
    series2.setData(secondaryLineData ?? []);

    window.addEventListener("resize", handleResize);

    manageTooltip(chart, series, series2);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [fixed, isTabletOrMobileScreen, manageTooltip, primaryLineData, secondaryLineData]);

  const loadingOverlay = useMemo(() => {
    if (isLoading) {
      return (
        <Col className="items-center justify-center bg-[#00000080] absolute w-full h-full z-10">
          <p className="text-2xl font-bold">Calculating...</p>
        </Col>
      )
    }
  }, [isLoading]);

  const tooltipContainer = useMemo(() => {
    return (
      <Col className="w-[170px] text-center bg-[#21376070] text-white h-full absolute left-[50%] top-0 z-50 hidden p-2 pointer-events-none" reference={tooltipContainerRef}>
      </Col>
    )
  }, [])

  return (
    primaryLineData ? (
      <Col reference={chartContainerRef} className={clsx('relative', className)} >
        {loadingOverlay}
        {tooltipContainer}
      </Col>
    ) : isLoading ? <TextSkeleton heightClassName="h-full" widthClassName="w-full" /> : (
      <></>
    )
  );
};

export default LineChart;
