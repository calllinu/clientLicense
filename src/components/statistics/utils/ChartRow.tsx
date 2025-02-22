import {Button, Col, Row} from "antd";
import ReactApexChart from "react-apexcharts";
import {FeedbackInterface} from "../../../interfaces/FeedbackInterfaces.tsx";
import {colors, fieldConfigs, generateChartData} from "./fieldConfigs.tsx";
import {transformData} from "../../../interfaces/TransformData.tsx";
import {WorkTime} from "../../../interfaces/enums/WorktimeEnum.tsx";
import {useMemo, useState} from "react";

interface ChartRowProps {
    feedbacks?: FeedbackInterface[];
}

const ChartRow = ({feedbacks}: ChartRowProps) => {
    const chartOptions = useMemo(() => ({
        chart: {id: 'basic-bar'},
        xaxis: {categories: ['Responses']},
    }), []);

    const [chartTypes, setChartTypes] = useState<Record<string, 'bar' | 'pie'>>(
        Object.fromEntries(fieldConfigs.map(({key}) => [key, 'bar']))
    );

    const toggleChartType = (field: string) => {
        setChartTypes((prev) => ({
            ...prev,
            [field]: prev[field] === 'bar' ? 'pie' : 'bar',
        }));
    };

    return (
        <Row gutter={20} style={{marginTop: 20}}>
            {fieldConfigs.map(({key, label, type}) => (
                <Col lg={8} md={12} xs={24} key={key}>
                    <Button onClick={() => toggleChartType(key)}>Toggle {chartTypes[key]} chart</Button>
                    <ReactApexChart
                        options={{
                            ...chartOptions,
                            xaxis: {categories: [label]},
                            chart: {...chartOptions.chart, type: chartTypes[key]},
                            dataLabels: {
                                formatter: (value: number) => {
                                    return chartTypes[key] === "pie" ? `${value.toFixed(2)}%` : value;
                                },
                            },
                            colors: colors,
                            labels: Object.values(type).map((factor) => transformData(factor) || factor),
                        }}
                        series={
                            chartTypes[key] === "bar"
                                ? generateChartData(
                                    feedbacks,
                                    key as keyof FeedbackInterface,
                                    Object.values(type),
                                    key === "workTime"
                                        ? (value) => WorkTime[value as keyof typeof WorkTime] || value
                                        : undefined
                                )
                                : generateChartData(
                                    feedbacks,
                                    key as keyof FeedbackInterface,
                                    Object.values(type),
                                    key === "workTime"
                                        ? (value) => WorkTime[value as keyof typeof WorkTime] || value
                                        : undefined
                                ).map((category) => category.data[0])
                        }
                        type={chartTypes[key]}
                        height={350}
                    />
                </Col>
            ))}
        </Row>
    );
};

export default ChartRow;
