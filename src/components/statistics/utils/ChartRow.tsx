import React from 'react';
import {Col, Row} from 'antd';
import BinnedBarChart from './charts/BinnedBarChart';
import DiscreteBarChart from './charts/DiscreteBarChart';
import CategoricalBarChart from './charts/CategoricalBarChart';
import {FeedbackInterface} from '../../../interfaces/FeedbackInterfaces.tsx';
import {colors, fieldConfigs} from './fieldConfigs.tsx';
import {getDepartmentDisplayName, transformData} from './chartUtils.tsx';
import BooleanBarChart from './charts/BooleanChart.tsx';

interface ChartRowProps {
    feedbacks: FeedbackInterface[] | undefined;
}

const ChartRow: React.FC<ChartRowProps> = ({feedbacks}) => {
    if (!feedbacks) {
        return null;
    }

    const getLabel = (field: keyof FeedbackInterface) => {
        const config = fieldConfigs.find(config => config.key === field);
        return config ? config.label : field;
    };

    const binnedFields: { field: keyof FeedbackInterface; binSize: number }[] = [
        {field: 'satisfactionLevel', binSize: 0.1},
        {field: 'lastEvaluation', binSize: 0.1},
        {field: 'averageMonthlyHours', binSize: 50},
    ];

    const discreteFields: (keyof FeedbackInterface)[] = ['numberProject', 'timeSpendCompany'];

    return (
        <Row gutter={20} style={{marginTop: 20}}>
            {binnedFields.map(({field, binSize}) => (
                <Col lg={8} md={12} xs={24} key={field}>
                    <BinnedBarChart
                        feedbacks={feedbacks}
                        field={field}
                        label={getLabel(field)}
                        binSize={binSize}
                        colors={colors}
                    />
                </Col>
            ))}

            {discreteFields.map(field => (
                <Col lg={8} md={12} xs={24} key={field}>
                    <DiscreteBarChart
                        feedbacks={feedbacks}
                        field={field}
                        label={getLabel(field)}
                        colors={colors}
                    />
                </Col>
            ))}

            {fieldConfigs.map(({key, type}) => {
                if (type === 'categorical') {
                    const transform = key === 'salary' ? transformData : key === 'department' ? getDepartmentDisplayName : undefined;
                    const sortOrder = key === 'salary' ? ['Low', 'Medium', 'High'] : undefined;
                    return (
                        <Col lg={8} md={12} xs={24} key={key}>
                            <CategoricalBarChart
                                feedbacks={feedbacks}
                                field={key as keyof FeedbackInterface}
                                label={getLabel(key as keyof FeedbackInterface)}
                                colors={colors}
                                transform={transform}
                                sortOrder={sortOrder}
                            />
                        </Col>
                    );
                } else if (type === 'boolean') {
                    return (
                        <Col lg={8} md={12} xs={24} key={key}>
                            <BooleanBarChart
                                feedbacks={feedbacks}
                                field={key as keyof FeedbackInterface}
                                label={getLabel(key as keyof FeedbackInterface)}
                                colors={colors}
                            />
                        </Col>
                    );
                }
                return null;
            })}
        </Row>
    );
};

export default ChartRow;