import React from 'react';
import ReactApexChart from 'react-apexcharts';
import {FeedbackInterface} from "../../../../interfaces/FeedbackInterfaces.tsx";


interface DiscreteBarChartProps {
    feedbacks: FeedbackInterface[];
    field: keyof FeedbackInterface;
    label: string;
    colors: string[];
}

const DiscreteBarChart: React.FC<DiscreteBarChartProps> = ({feedbacks, field, label, colors}) => {
    const valueCounts: Record<string, number> = {};
    feedbacks.forEach(entry => {
        const val = entry[field];
        if (typeof val === 'number') {
            const key = `${Math.round(val)}`;
            valueCounts[key] = (valueCounts[key] || 0) + 1;
        }
    });
    const labels = Object.keys(valueCounts).sort((a, b) => parseInt(a) - parseInt(b));
    const data = labels.map(label => valueCounts[label]);
    const options: ApexCharts.ApexOptions = {
        chart: {type: 'bar'},
        xaxis: {
            categories: labels,
            title: {text: label},
        },
        colors,
        plotOptions: {
            bar: {
                distributed: true,
            },
        },
        dataLabels: {enabled: false},
        legend: {show: false},
    };
    const series = [{name: label, data}];
    return <ReactApexChart options={options} series={series} type="bar" height={350}/>;
};

export default DiscreteBarChart;