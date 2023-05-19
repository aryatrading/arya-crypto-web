import { FC, useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, ChartOptions, ChartData } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Col, Row } from "../../layout/flex";
import { getCoinColor } from "../../../../utils/helpers/coinsColors";
import { doughnutChartDataType } from "./doughnut";

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
                        hoverBorderWidth: 20
                    },
                ],
            }

            const graphOptions: ChartOptions<"doughnut"> = {
                plugins: {
                    tooltip: {
                        padding: 10,
                        borderWidth: 5
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
            <Col className='justify-center items-center flex-1 relative gap-5 overflow-hidden aspect-square'>
                <Row className='items-center justify-center font-bold inset-0 m-auto absolute'>
                    <p className='font-bold md:text-xl'>{title}</p>
                </Row>
                {doughnutChart}
            </Col>
        )
    } else {
        return <></>;
    }
}

export default CutoutDoughnutChart;
