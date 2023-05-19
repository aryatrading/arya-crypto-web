import { FC, useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, ChartOptions, ChartData } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Col, Row } from "../../layout/flex";
import { getCoinColor } from "../../../../utils/helpers/coinsColors";

export type doughnutChartDataType = {
    coinSymbol: string,
    label: string,
    value: number,
}

const DoughnutChart: FC<{ title: string, chartData: doughnutChartDataType[], maxWidth: string }> = ({ title, chartData, maxWidth }) => {

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
                        padding: 10
                    },
                    legend: {
                        display: false,
                    },
                }
            }

            return (
                <Doughnut data={data} options={graphOptions} />
            );
        }
    }, [chartData]);


    if (chartData?.length) {
        return (
            <Col className='justify-center items-start w-full gap-5'>
                <p className='font-bold'>{title}</p>
                <Row className='justify-center w-full'>
                    <Row style={{ maxWidth }}>
                        {doughnutChart}
                    </Row>
                </Row>
            </Col>
        )
    } else {
        return <></>;
    }
}

export default DoughnutChart;
