import {Button, Col, Row, Select, Spin} from 'antd';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useGetFeedbacksForOrganizationQuery} from "../../services/feedbackApi.tsx";
import ReactApexChart from 'react-apexcharts';
import {FeedbackInterface} from "../../interfaces/FeedbackInterfaces.tsx";
import {WorkTime} from "../../interfaces/enums/WorktimeEnum.tsx";
import {Engagement} from "../../interfaces/enums/EngagementEnum.tsx";
import {DangerTypeInterface} from "../../interfaces/enums/DangerTypeInterface.tsx";
import {FactorsWorkplaceSafetyInterface} from "../../interfaces/enums/FactorsWorkplaceSafetyInterface.tsx";
import {useGetAllOrganizationsCodeQuery} from "../../services/organizationApi.tsx";
import styles from './statistics.module.scss';
import {transformData} from "../../interfaces/TransformData.tsx";
import {Confirmation} from "../../interfaces/enums/ConfirmationEnum.tsx";

const {Option} = Select;

const fieldLabels: Record<string, string> = {
    confirmationEquipmentAdequate: 'Is the equipment adequate?',
    confirmationOvertime: 'Do you work overtime?',
    confirmationSafetyMeasures: 'Are safety measures adequate?',
    confirmationProtectionMeasures: 'Are protection measures adequate?',
    engagement: 'What is your engagement level?',
    dangerType: 'What type of danger do you face?',
    confirmationSalary: 'Are you satisfied with your salary?',
    factorsWorkplaceSafety: 'What factors affect workplace safety?',
    workTime: 'What is your time which you are exposed to danger ?',
};

const StatisticsContent = () => {
    const {data: organizationsCodes, isLoading: orgLoading} = useGetAllOrganizationsCodeQuery();
    const [selectedOrgCode, setSelectedOrgCode] = useState<string | null>(organizationsCodes ? organizationsCodes[0] : null);

    const [chartTypes, setChartTypes] = useState<Record<string, 'bar' | 'pie'>>({
        confirmationEquipmentAdequate: 'bar',
        confirmationOvertime: 'bar',
        confirmationSafetyMeasures: 'bar',
        confirmationProtectionMeasures: 'bar',
        confirmationSalary: 'bar',
        engagement: 'bar',
        dangerType: 'bar',
        factorsWorkplaceSafety: 'bar',
        workTime: 'bar',
    });

    const colors = [
        "#1f77b4",
        "#9467bd",
        "#ff7f0e",
        "#2ca02c",
        "#d62728",
        "#8c564b",
        "#e377c2",
        "#7f7f7f",
        "#bcbd22",
        "#17becf"
    ];


    const toggleChartType = (field: string) => {
        setChartTypes((prev) => ({
            ...prev,
            [field]: prev[field] === 'bar' ? 'pie' : 'bar',
        }));
    };

    useEffect(() => {
        if (organizationsCodes && organizationsCodes.length > 0 && !selectedOrgCode) {
            setSelectedOrgCode(organizationsCodes[0]);
        }
    }, [organizationsCodes, selectedOrgCode]);

    const handleOrgChange = useCallback((orgCode: string) => {
        setSelectedOrgCode(orgCode);
    }, []);

    const {
        data: feedbacksForOrganization,
        isLoading: feedbackLoading,
        error: feedbackError
    } = useGetFeedbacksForOrganizationQuery({
        organizationCode: selectedOrgCode || ""
    }, {
        skip: !selectedOrgCode
    });

    const generateYesNoChartData = useCallback((field: keyof FeedbackInterface) => {
        if (!feedbacksForOrganization) return [];

        const validEntries = feedbacksForOrganization.filter((entry: FeedbackInterface) => entry[field] !== undefined && entry[field] !== null);

        const yesCount = validEntries.filter((entry: FeedbackInterface) => entry[field] === 'YES').length;
        const noCount = validEntries.filter((entry: FeedbackInterface) => entry[field] === 'NO').length;

        return [
            {name: 'Yes', data: [yesCount]},
            {name: 'No', data: [noCount]}
        ];
    }, [feedbacksForOrganization]);

    const generateCategoryChartData = useCallback(
        (
            field: keyof FeedbackInterface,
            enumType: string[],
            transformFn?: (value: string | undefined) => string | undefined,
            isPieChart: boolean = false
        ) => {
            if (!feedbacksForOrganization) return [];

            const categoryCounts = enumType.reduce((acc: Record<string, number>, category: string) => {
                const transformedCategory = transformFn ? transformFn(category) : category;
                const fieldValue = feedbacksForOrganization.filter((entry: FeedbackInterface) => {
                    const transformedValue = transformFn ? transformFn(String(entry[field])) : String(entry[field]);
                    return transformedValue === transformedCategory;
                });
                acc[transformedCategory || category] = fieldValue.length;
                return acc;
            }, {});

            return Object.keys(categoryCounts).map((category) => {
                const label = isPieChart ? category : transformData(category) || category;
                return {
                    name: label,
                    data: [categoryCounts[category]],
                };
            });
        },
        [feedbacksForOrganization]
    );


    const chartOptions = useMemo(() => ({
        chart: {
            id: 'basic-bar'
        },
        xaxis: {
            categories: ['Responses']
        },
    }), []);

    if (orgLoading || feedbackLoading) return <Spin/>;

    if (feedbackError) {
        return <div>Error fetching feedbacks</div>;
    }

    return (
        <div className={styles.mainContainer}>
            <Row className={styles.firstRow}>
                <Select
                    value={selectedOrgCode}
                    style={{width: 200}}
                    onChange={handleOrgChange}
                >
                    {organizationsCodes?.map(orgCode => (
                        <Option key={orgCode} value={orgCode}>
                            {orgCode}
                        </Option>
                    ))}
                </Select>
            </Row>

            <Row gutter={20} style={{marginTop: 20}}>
                <Col span={8}>
                    <Button onClick={() => toggleChartType('confirmationEquipmentAdequate')}>
                        Toggle {chartTypes.confirmationEquipmentAdequate} chart
                    </Button>
                    <ReactApexChart
                        options={{
                            ...chartOptions,
                            xaxis: {
                                categories: [fieldLabels['confirmationEquipmentAdequate']]
                            },
                            chart: {
                                ...chartOptions.chart,
                                type: chartTypes.confirmationEquipmentAdequate
                            },
                            dataLabels: {
                                formatter: (value: number) => {
                                    return chartTypes.confirmationEquipmentAdequate === 'pie'
                                        ? `${value.toFixed(2)}%`
                                        : value;
                                }
                            },
                            colors: colors,
                            labels: Object.values(Confirmation).map(factor => transformData(factor) || factor),
                        }}
                        series={chartTypes.confirmationEquipmentAdequate === 'bar' ? generateYesNoChartData('confirmationEquipmentAdequate') : generateCategoryChartData('confirmationEquipmentAdequate', Object.values(Confirmation)).map(category => category.data[0])}
                        type={chartTypes.confirmationEquipmentAdequate}
                        height={350}
                    />
                </Col>
                <Col span={8}>
                    <Button onClick={() => toggleChartType('confirmationOvertime')}>
                        Toggle {chartTypes.confirmationOvertime} chart
                    </Button>
                    <ReactApexChart
                        options={{
                            ...chartOptions,
                            xaxis: {
                                categories: [fieldLabels['confirmationOvertime']]
                            },
                            chart: {
                                ...chartOptions.chart,
                                type: chartTypes.confirmationOvertime
                            },
                            dataLabels: {
                                formatter: (value: number) => {
                                    return chartTypes.confirmationOvertime === 'pie'
                                        ? `${value.toFixed(2)}%`
                                        : value;
                                }
                            },
                            colors: colors,
                            labels: Object.values(Confirmation).map(factor => transformData(factor) || factor),
                        }}
                        series={chartTypes.confirmationOvertime === 'bar' ? generateYesNoChartData('confirmationOvertime') : generateCategoryChartData('confirmationOvertime', Object.values(Confirmation)).map(category => category.data[0])}
                        type={chartTypes.confirmationOvertime}
                        height={350}
                    />
                </Col>
                <Col span={8}>
                    <Button onClick={() => toggleChartType('confirmationSafetyMeasures')}>
                        Toggle {chartTypes.confirmationSafetyMeasures} chart
                    </Button>
                    <ReactApexChart
                        options={{
                            ...chartOptions,
                            xaxis: {
                                categories: [fieldLabels['confirmationSafetyMeasures']]
                            },
                            chart: {
                                ...chartOptions.chart,
                                type: chartTypes.confirmationSafetyMeasures
                            },
                            dataLabels: {
                                formatter: (value: number) => {
                                    return chartTypes.confirmationSafetyMeasures === 'pie'
                                        ? `${value.toFixed(2)}%`
                                        : value;
                                }
                            },
                            colors: colors,
                            labels: Object.values(Confirmation).map(factor => transformData(factor) || factor),
                        }}
                        series={chartTypes.confirmationSafetyMeasures === 'bar' ? generateYesNoChartData('confirmationSafetyMeasures') : generateCategoryChartData('confirmationSafetyMeasures', Object.values(Confirmation)).map(category => category.data[0])}
                        type={chartTypes.confirmationSafetyMeasures}
                        height={350}
                    />
                </Col>
            </Row>
            <Row gutter={20} style={{marginTop: 20}}>
                <Col span={8}>
                    <Button onClick={() => toggleChartType('workTime')}>
                        Toggle {chartTypes.workTime} chart
                    </Button>
                    <ReactApexChart
                        options={{
                            ...chartOptions,
                            xaxis: {
                                categories: [fieldLabels['workTime']],
                            },
                            chart: {
                                ...chartOptions.chart,
                                type: chartTypes.workTime,
                            },
                            dataLabels: {
                                formatter: (value: number) => {
                                    return chartTypes.workTime === 'pie' ? `${value.toFixed(2)}%` : value;
                                },
                            },
                            colors: colors,
                            labels: Object.values(WorkTime).map((factor) => transformData(factor) || factor),
                        }}
                        series={
                            chartTypes.workTime === 'bar'
                                ? generateCategoryChartData('workTime', Object.values(WorkTime), (value) => WorkTime[value as keyof typeof WorkTime] || value)
                                : generateCategoryChartData('workTime', Object.values(WorkTime), (value) => WorkTime[value as keyof typeof WorkTime] || value, true).map((category) => category.data[0])
                        }
                        type={chartTypes.workTime}
                        height={350}
                    />
                </Col>
                <Col span={8}>
                    <Button onClick={() => toggleChartType('dangerType')}>
                        Toggle {chartTypes.dangerType} chart
                    </Button>
                    <ReactApexChart
                        options={{
                            ...chartOptions,
                            xaxis: {
                                categories: [fieldLabels['dangerType']]
                            },
                            chart: {
                                ...chartOptions.chart,
                                type: chartTypes.dangerType
                            },
                            dataLabels: {
                                formatter: (value: number) => {
                                    return chartTypes.dangerType === 'pie'
                                        ? `${value.toFixed(2)}%`
                                        : value;
                                }
                            },
                            colors: colors,
                            labels: Object.values(DangerTypeInterface).map(factor => transformData(factor) || factor),
                        }}
                        series={chartTypes.dangerType === 'bar' ? generateCategoryChartData('dangerType', Object.values(DangerTypeInterface), (value) => DangerTypeInterface[value as keyof typeof DangerTypeInterface] || value) : generateCategoryChartData('dangerType', Object.values(DangerTypeInterface)).map(category => category.data[0])}
                        type={chartTypes.dangerType}
                        height={350}
                    />
                </Col>
                <Col span={8}>
                    <Button onClick={() => toggleChartType('factorsWorkplaceSafety')}>
                        Toggle {chartTypes.factorsWorkplaceSafety} chart
                    </Button>
                    <ReactApexChart
                        options={{
                            ...chartOptions,
                            xaxis: {
                                categories: [fieldLabels['factorsWorkplaceSafety']]
                            },
                            chart: {
                                ...chartOptions.chart,
                                type: chartTypes.factorsWorkplaceSafety
                            },
                            dataLabels: {
                                formatter: (value: number) => {
                                    return chartTypes.factorsWorkplaceSafety === 'pie'
                                        ? `${value.toFixed(2)}%`
                                        : value;
                                }
                            },
                            colors: colors,
                            labels: Object.values(FactorsWorkplaceSafetyInterface).map(factor => transformData(factor) || factor),
                        }}
                        series={chartTypes.factorsWorkplaceSafety === 'bar' ? generateCategoryChartData('factorsWorkplaceSafety', Object.values(FactorsWorkplaceSafetyInterface), (value) => FactorsWorkplaceSafetyInterface[value as keyof typeof FactorsWorkplaceSafetyInterface] || value) : generateCategoryChartData('factorsWorkplaceSafety', Object.values(FactorsWorkplaceSafetyInterface)).map(category => category.data[0])}
                        type={chartTypes.factorsWorkplaceSafety}
                        height={350}
                    />
                </Col>
            </Row>
            <Row gutter={20} style={{marginTop: 20}}>
                <Col span={8}>
                    <Button onClick={() => toggleChartType('confirmationProtectionMeasures')}>
                        Toggle {chartTypes.confirmationProtectionMeasures} chart
                    </Button>
                    <ReactApexChart
                        options={{
                            ...chartOptions,
                            xaxis: {
                                categories: [fieldLabels['confirmationProtectionMeasures']]
                            },
                            chart: {
                                ...chartOptions.chart,
                                type: chartTypes.confirmationProtectionMeasures
                            },
                            dataLabels: {
                                formatter: (value: number) => {
                                    return chartTypes.confirmationProtectionMeasures === 'pie'
                                        ? `${value.toFixed(2)}%`
                                        : value;
                                }
                            },
                            colors: colors,
                            labels: Object.values(Confirmation).map(factor => transformData(factor) || factor),
                        }}
                        series={chartTypes.confirmationProtectionMeasures === 'bar' ? generateYesNoChartData('confirmationProtectionMeasures') : generateCategoryChartData('confirmationProtectionMeasures', Object.values(Confirmation)).map(category => category.data[0])}
                        type={chartTypes.confirmationProtectionMeasures}
                        height={350}
                    />
                </Col>
                <Col span={8}>
                    <Button onClick={() => toggleChartType('engagement')}>
                        Toggle {chartTypes.engagement} chart
                    </Button>
                    <ReactApexChart
                        options={{
                            ...chartOptions,
                            xaxis: {
                                categories: [fieldLabels['engagement']]
                            },
                            chart: {
                                ...chartOptions.chart,
                                type: chartTypes.engagement
                            },
                            dataLabels: {
                                formatter: (value: number) => {
                                    return chartTypes.engagement === 'pie'
                                        ? `${value.toFixed(2)}%`
                                        : value;
                                }
                            },
                            colors: colors,
                            labels: Object.values(Engagement).map(factor => transformData(factor) || factor),
                        }}
                        series={chartTypes.engagement === 'bar' ? generateCategoryChartData('engagement', Object.values(Engagement), (value) => Engagement[value as keyof typeof Engagement] || value) : generateCategoryChartData('engagement', Object.values(Engagement)).map(category => category.data[0])}
                        type={chartTypes.engagement}
                        height={350}
                    />
                </Col>
                <Col span={8}>
                    <Button onClick={() => toggleChartType('confirmationSalary')}>
                        Toggle {chartTypes.confirmationSalary} chart
                    </Button>
                    <ReactApexChart
                        options={{
                            ...chartOptions,
                            xaxis: {
                                categories: [fieldLabels['confirmationSalary']]
                            },
                            chart: {
                                ...chartOptions.chart,
                                type: chartTypes.confirmationSalary
                            },
                            dataLabels: {
                                formatter: (value: number) => {
                                    return chartTypes.confirmationSalary === 'pie'
                                        ? `${value.toFixed(2)}%`
                                        : value;
                                }
                            },
                            colors: colors,
                            labels: Object.values(Confirmation).map(factor => transformData(factor) || factor),
                        }}
                        series={chartTypes.confirmationSalary === 'bar' ? generateYesNoChartData('confirmationSalary') : generateCategoryChartData('confirmationSalary', Object.values(Confirmation)).map(category => category.data[0])}
                        type={chartTypes.confirmationSalary}
                        height={350}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default StatisticsContent;