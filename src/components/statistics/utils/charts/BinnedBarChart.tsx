import React from 'react';
import ReactApexChart from 'react-apexcharts';
import {FeedbackInterface} from "../../../../interfaces/FeedbackInterfaces";

interface BinnedBarChartProps {
    feedbacks: FeedbackInterface[];
    field: keyof FeedbackInterface;
    label: string;
    binSize: number;
    colors: string[];
}

const generateBinnedBarData = (
    feedbacks: FeedbackInterface[],
    field: keyof FeedbackInterface,
    binSize: number
) => {
    const bins: Record<string, number> = {};

    feedbacks.forEach((entry) => {
        const value = entry[field];
        if (typeof value === "number" && !isNaN(value)) {
            const binStart = Math.floor(value / binSize) * binSize;
            const binEnd = binStart + binSize;
            const binLabel = `${binStart.toFixed(1)} - ${binEnd.toFixed(1)}`;
            bins[binLabel] = (bins[binLabel] || 0) + 1;
        }
    });

    const binLabels = Object.keys(bins).sort(
        (a, b) => parseFloat(a.split(" - ")[0]) - parseFloat(b.split(" - ")[0])
    );
    const data = binLabels.map((label) => bins[label]);

    return {binLabels, data};
};

const BinnedBarChart: React.FC<BinnedBarChartProps> = ({
                                                           feedbacks,
                                                           field,
                                                           label,
                                                           binSize,
                                                           colors,
                                                       }) => {
    const {binLabels, data} = generateBinnedBarData(feedbacks, field, binSize);

    const options: ApexCharts.ApexOptions = {
        chart: {type: "bar"},
        xaxis: {
            categories: binLabels,
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

    return (
        <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
        />
    );
};

export default BinnedBarChart;