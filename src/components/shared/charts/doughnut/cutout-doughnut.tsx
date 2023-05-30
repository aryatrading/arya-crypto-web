import { FC, useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, ChartOptions, ChartData } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Col, Row } from "../../layout/flex";
import { getCoinColor } from "../../../../utils/helpers/coinsColors";
import { doughnutChartDataType } from "./doughnut";
import { shortNumberFormat } from "../../../../utils/helpers/prices";

const CutoutDoughnutChart: FC<{ title: string, chartData: doughnutChartDataType[] }> = ({ title, chartData }) => {

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
                cutout: "80%",
            }

            return (
                <Doughnut data={data} options={graphOptions} />
            );
        }
    }, [chartData]);


    if (chartData?.length) {
        return (
            <Col className='justify-center items-center relative gap-5 overflow-hidden aspect-square w-[160px] md:w-[262px]'>
                {doughnutChart}
                <Row className='items-center justify-center font-bold inset-0 m-auto absolute -z-10'>
                    <p className='font-bold sm:text-sm xl:text-xl'>{title}</p>
                </Row>
            </Col>
        )
    } else {
        return <></>;
    }
}

export default CutoutDoughnutChart;
