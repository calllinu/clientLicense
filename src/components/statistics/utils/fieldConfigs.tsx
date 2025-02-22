import {Confirmation} from "../../../interfaces/enums/ConfirmationEnum.tsx";
import {DangerTypeInterface} from "../../../interfaces/enums/DangerTypeInterface.tsx";
import {FactorsWorkplaceSafetyInterface} from "../../../interfaces/enums/FactorsWorkplaceSafetyInterface.tsx";
import {WorkTime} from "../../../interfaces/enums/WorktimeEnum.tsx";
import {Engagement} from "../../../interfaces/enums/EngagementEnum.tsx";
import {transformData} from "../../../interfaces/TransformData.tsx";
import {FeedbackInterface} from "../../../interfaces/FeedbackInterfaces.tsx";

export const fieldConfigs = [
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

export const colors =
    [
        '#775DD0',
        '#008FFB',
        '#00E396',
        '#FEB019',
        '#FF4560',
        '#D10CE8',
        '#546E7A',
        '#26a69a'
    ];

export const generateChartData = (
    feedbacksForOrganization: FeedbackInterface[] | undefined,
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
        const transformedCategory = transformFn ? transformFn(category) : category;
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
};