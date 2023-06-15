import { FC, useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, ChartOptions, ChartData } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Col, Row } from "../../layout/flex";
import { getCoinColor } from "../../../../utils/helpers/coinsColors";
import { doughnutChartDataType } from "./doughnut";
import { shortNumberFormat } from "../../../../utils/helpers/prices";
import { DoughnutSkeleton, TextSkeleton } from "../../skeletons/skeletons";
import clsx from "clsx";

const CutoutDoughnutChart: FC<{ title?: string, chartData: doughnutChartDataType[], isLoading?: boolean , cutout?:string, className?: string}> = ({ title, chartData, isLoading, cutout="80%", className }) => {

    ChartJS.register(ArcElement, Tooltip);

    const doughnutChart = useMemo(() => {
        if (chartData) {
            const labels: string[] = [];
            const values: number[] = [];
            const backgroundColors: string[] = [];

            chartData.forEach((data, index) => {
                labels.push(data.label);
                values.push(data.value);
                const backgroundColor = getCoinColor(data.coinSymbol, index);
                backgroundColors.push(backgroundColor);
            })

            const data: ChartData<"doughnut", number[], string> = {
                labels,
                datasets: [
                    {
                        data: values,
                        backgroundColor: backgroundColors,
                        borderWidth: 0,
                    },
                ],
            }

            const graphOptions: ChartOptions<"doughnut"> = {
                plugins: {
                    tooltip: {
                        padding: 10,
                        callbacks: {
                            label: (label) => {
                                return `${label.label} ${shortNumberFormat(label.raw as number)}$`;
                            }
                        },
                        boxPadding: 5,
                        position: "nearest",
                    },
                    legend: {
                        display: false,
                    },
                },
                cutout,
            }

            return (
                <Doughnut data={data} options={graphOptions} />
            );
        }
    }, [chartData, cutout]);



    return (
        <Col className={clsx('justify-center items-center relative gap-5 overflow-hidden aspect-square', className)}>
            {isLoading ? <DoughnutSkeleton /> : doughnutChart}
            <Row className='items-center justify-center font-bold inset-0 m-auto absolute -z-10'>
                {isLoading ? <TextSkeleton /> : <p className='font-bold sm:text-sm xl:text-xl'>{title}</p>}
            </Row>
        </Col>
    )
}

export default CutoutDoughnutChart;
