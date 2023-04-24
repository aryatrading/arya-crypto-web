import { FC, useCallback, useMemo } from "react";
// import "./PieCharts.scss";
import { Chart as ChartJS, ArcElement, Tooltip, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import numeral from "numeral";
import { Col, Row } from "../../layout/flex";

export type doughnutChartDataType = {
    label: string,
    value: number,
}

const colors: string[] = ['blue', 'red', 'yellow', 'indigo', 'lime', 'pink', 'green', 'purple', 'amber', 'cyan', 'brown', 'teal', 'grey', 'lime', 'blueGrey'];

const colorsHex: { [k: string]: string } = {
    'blue': '#526BE8',
    'red': '#FF1744',
    'yellow': '#FFA93A',
    'indigo': '#232892',
    'pink': '#FF4081',
    'purple': '#A05ACE',
    amber: '#FFAB00',
    cyan: '#00B8D4',
    orange: '#FF6D00',
    brown: '#5D4037',
    teal: '#00BFA5',
    green: '#00C853',
    grey: '#616161',
    lime: '#C6FF00',
    blueGrey: '#455A64',
}

const DoughnutChart: FC<{ title: string, chartData: doughnutChartDataType[], maxWidth:string }> = ({ title, chartData, maxWidth }) => {

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

            const data = {
                labels,
                datasets: [
                    {
                        data: values,
                        backgroundColor: backgroundColors,
                        borderColor: [
                            'rgba(255, 255, 255, 0)',
                        ],
                        borderWidth: 1,
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
                <h5 className='description-text font-bold'>{title}</h5>
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