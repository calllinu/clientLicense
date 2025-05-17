import React from 'react';
import ReactApexChart from 'react-apexcharts';
import {FeedbackInterface} from "../../../../interfaces/FeedbackInterfaces.tsx";

interface BooleanBarChartProps {
    feedbacks: FeedbackInterface[];
    field: keyof FeedbackInterface;
    label: string;
    colors: string[];
}

const BooleanBarChart: React.FC<BooleanBarChartProps> = ({feedbacks, field, label, colors}) => {
    const yesCount = feedbacks.filter(entry => entry[field] === 1).length;
    const noCount = feedbacks.filter(entry => entry[field] === 0).length;
    const options: ApexCharts.ApexOptions = {
        chart: {type: 'bar'},
        xaxis: {
            categories: ['Yes', 'No'],
            title: {text: label},
        },
        dataLabels: {enabled: false},
        colors,
        plotOptions: {
            bar: {
                distributed: true,
            },
        },
    };
    const series = [{name: label, data: [yesCount, noCount]}];
    return <ReactApexChart options={options} series={series} type="bar" height={350}/>;
};

export default BooleanBarChart;