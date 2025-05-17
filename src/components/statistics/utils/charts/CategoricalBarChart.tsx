import React from 'react';
import ReactApexChart from 'react-apexcharts';
import {FeedbackInterface} from "../../../../interfaces/FeedbackInterfaces.tsx";

interface CategoricalBarChartProps {
    feedbacks: FeedbackInterface[];
    field: keyof FeedbackInterface;
    label: string;
    colors: string[];
    transform?: (value: string) => string;
    sortOrder?: string[];
}

const CategoricalBarChart: React.FC<CategoricalBarChartProps> = ({
                                                                     feedbacks,
                                                                     field,
                                                                     label,
                                                                     colors,
                                                                     transform,
                                                                     sortOrder
                                                                 }) => {
    const categoryCounts: Record<string, number> = {};
    feedbacks.forEach((entry) => {
        let value = String(entry[field] ?? 'Unknown');
        if (transform) {
            value = transform(value);
        }
        categoryCounts[value] = (categoryCounts[value] || 0) + 1;
    });
    const categoryLabels = sortOrder
        ? sortOrder.filter(label => categoryCounts[label] !== undefined)
        : Object.keys(categoryCounts).sort();
    const data = categoryLabels.map(label => categoryCounts[label]);
    const options: ApexCharts.ApexOptions = {
        chart: {type: 'bar'},
        xaxis: {
            categories: categoryLabels,
            title: {text: label},
            labels: {
                rotate: -45,
                style: {
                    fontSize: '12px',
                },
            },
        },
        dataLabels: {enabled: true},
        colors,
        plotOptions: {
            bar: {
                distributed: true,
            },
        },
        tooltip: {
            x: {
                formatter: (val: number) => String(val),
            },
        },
    };
    const series = [{name: label, data}];
    return <ReactApexChart options={options} series={series} type="bar" height={350}/>;
};

export default CategoricalBarChart;