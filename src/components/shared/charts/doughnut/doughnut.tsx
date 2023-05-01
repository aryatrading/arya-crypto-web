import { FC, useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, ChartOptions, ChartData } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Col, Row } from "../../layout/flex";

export type doughnutChartDataType = {
    label: string,
    value: number,
}

const colors: string[] = ['pink', 'orange', 'blue', 'darkBlue', 'indigo', 'lime', 'purple', 'green', 'yellow', 'amber', 'red', 'cyan', 'brown', 'teal', 'grey', 'lime', 'blueGrey'];

const colorsHex: { [k: string]: string } = {
    'blue': '#224DDA',
    'darkBlue': '#232892',
    'red': '#FF1744',
    'yellow': '#FFA93A',
    'indigo': '#232892',
    'pink': '#E6007A',
    'purple': '#A05ACE',
    amber: '#FFAB00',
    cyan: '#00B8D4',
    orange: '#F7931A',
    brown: '#5D4037',
    teal: '#00BFA5',
    green: '#00C853',
    grey: '#616161',
    lime: '#C6FF00',
    blueGrey: '#455A64',
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
                backgroundColors.push(colorsHex[colors[index]]);
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
            <Col className='justify-center items-start w-full gap-5 px-14'>
                <p className='font-bold'>{title}</p>
                <Row className='justify-center w-full'>
                    <Row className={`max-w-[${maxWidth}]`}>
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
