import {Button, Col, Row, Select, Spin} from 'antd';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useGetFeedbacksForOrganizationQuery} from "../../../services/feedbackApi.tsx";
import ReactApexChart from 'react-apexcharts';
import {FeedbackInterface} from "../../../interfaces/FeedbackInterfaces.tsx";
import {WorkTime} from "../../../interfaces/enums/WorktimeEnum.tsx";
import {Engagement} from "../../../interfaces/enums/EngagementEnum.tsx";
import {DangerTypeInterface} from "../../../interfaces/enums/DangerTypeInterface.tsx";
import {FactorsWorkplaceSafetyInterface} from "../../../interfaces/enums/FactorsWorkplaceSafetyInterface.tsx";
import {useGetAllOrganizationsCodeQuery} from "../../../services/organizationApi.tsx";
import styles from './statistics.module.scss';
import {transformData} from "../../../interfaces/TransformData.tsx";
import {Confirmation} from "../../../interfaces/enums/ConfirmationEnum.tsx";

const {Option} = Select;

const fieldConfigs = [
    {key: 'confirmationEquipmentAdequate', label: 'Is the equipment adequate?', type: Confirmation},
    {key: 'confirmationOvertime', label: 'Do you work overtime?', type: Confirmation},
    {key: 'confirmationSafetyMeasures', label: 'Are safety measures adequate?', type: Confirmation},
    {key: 'dangerType', label: 'What type of danger do you face?', type: DangerTypeInterface},
    {
        key: 'factorsWorkplaceSafety',
        label: 'What factors affect workplace safety?',
        type: FactorsWorkplaceSafetyInterface
    },
    {key: 'workTime', label: 'What is your exposure time to danger?', type: WorkTime},
    {key: 'confirmationProtectionMeasures', label: 'Are protection measures adequate?', type: Confirmation},
    {key: 'confirmationSalary', label: 'Are you satisfied with your salary?', type: Confirmation},
    {key: 'engagement', label: 'What is your engagement level?', type: Engagement}
];

const StatisticsContentOwner = () => {
    const {data: organizationsCodes, isLoading: orgLoading} = useGetAllOrganizationsCodeQuery();
    const [selectedOrgCode, setSelectedOrgCode] = useState<string | null>(organizationsCodes ? organizationsCodes[0] : null);

    const [chartTypes, setChartTypes] = useState<Record<string, 'bar' | 'pie'>>(
        Object.fromEntries(fieldConfigs.map(({key}) => [key, 'bar']))
    );

    const colors = ["#1f77b4", "#9467bd", "#ff7f0e", "#2ca02c", "#d62728", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

    const toggleChartType = (field: string) => {
        setChartTypes((prev) => ({
            ...prev,
            [field]: prev[field] === 'bar' ? 'pie' : 'bar',
        }));
    };

    useEffect(() => {
        if (organizationsCodes?.length && !selectedOrgCode) {
            setSelectedOrgCode(organizationsCodes[0]);
        }
    }, [organizationsCodes, selectedOrgCode]);

    const handleOrgChange = useCallback((orgCode: string) => {
        setSelectedOrgCode(orgCode);
    }, []);

    const {data: feedbacksForOrganization, isLoading: feedbackLoading, error: feedbackError} =
        useGetFeedbacksForOrganizationQuery({organizationCode: selectedOrgCode || ""}, {skip: !selectedOrgCode});

    const generateChartData = useCallback(
        (
            field: keyof FeedbackInterface,
            enumType: string[],
            transformFn?: (value: string | undefined) => string | undefined,
            isYesNo = false
        ) => {
            if (!feedbacksForOrganization) return [];

            if (isYesNo) {
                const yesCount = feedbacksForOrganization.filter((entry) => entry[field] === 'YES').length;
                const noCount = feedbacksForOrganization.filter((entry) => entry[field] === 'NO').length;
                return [{name: 'Yes', data: [yesCount]}, {name: 'No', data: [noCount]}];
            }

            const categoryCounts = enumType.reduce((acc: Record<string, number>, category: string) => {
                const transformedCategory = transformFn ? transformFn(category) : category;  // Apply transformFn if passed
                const fieldValue = feedbacksForOrganization.filter((entry) => {
                    const transformedValue = transformFn ? transformFn(String(entry[field])) : String(entry[field]);
                    return transformedValue === transformedCategory;
                });
                acc[transformedCategory || category] = fieldValue.length;
                return acc;
            }, {});

            return Object.keys(categoryCounts).map((category) => {
                const label = transformData(category) || category;
                return {
                    name: label,
                    data: [categoryCounts[category]],
                };
            });
        },
        [feedbacksForOrganization]
    );


    const chartOptions = useMemo(() => ({
        chart: {id: 'basic-bar'},
        xaxis: {categories: ['Responses']},
    }), []);

    if (orgLoading || feedbackLoading) return <Spin className={styles.spinner}/>;
    if (feedbackError) return <div>Error fetching feedbacks</div>;

    return (
        <div className={styles.mainContainer}>
            <Row className={styles.firstRow}>
                <Select value={selectedOrgCode} style={{width: 200}} onChange={handleOrgChange}>
                    {organizationsCodes?.map(orgCode => (
                        <Option key={orgCode} value={orgCode}>
                            {orgCode}
                        </Option>
                    ))}
                </Select>
            </Row>

            <Row gutter={20} style={{marginTop: 20}}>
                {fieldConfigs.map(({key, label, type}) => (
                    <Col span={8} key={key}>
                        <Button onClick={() => toggleChartType(key)}>Toggle {chartTypes[key]} chart</Button>
                        <ReactApexChart
                            options={{
                                ...chartOptions,
                                xaxis: {categories: [label]},
                                chart: {...chartOptions.chart, type: chartTypes[key]},
                                dataLabels: {
                                    formatter: (value: number) => {
                                        return chartTypes[key] === 'pie' ? `${value.toFixed(2)}%` : value
                                    }
                                },
                                colors: colors,
                                labels: Object.values(type).map(factor => transformData(factor) || factor),
                            }}
                            series={
                                chartTypes[key] === 'bar'
                                    ? generateChartData(
                                        key as keyof FeedbackInterface,
                                        Object.values(type),
                                        key === 'workTime'
                                            ? (value) => WorkTime[value as keyof typeof WorkTime] || value
                                            : undefined
                                    )
                                    : generateChartData(
                                        key as keyof FeedbackInterface,
                                        Object.values(type),
                                        key === 'workTime'
                                            ? (value) => WorkTime[value as keyof typeof WorkTime] || value
                                            : undefined
                                    ).map(category => category.data[0])
                            }

                            type={chartTypes[key]}
                            height={350}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default StatisticsContentOwner;
