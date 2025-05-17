export const fieldConfigs = [
    {key: 'satisfactionLevel', label: 'How satisfied are you with your job?', type: 'numeric'},
    {key: 'lastEvaluation', label: 'What was your score on your last performance evaluation?', type: 'numeric'},
    {key: 'numberProject', label: 'How many projects are you currently working on?', type: 'numeric'},
    {key: 'averageMonthlyHours', label: 'How many hours do you work per month on average?', type: 'numeric'},
    {key: 'timeSpendCompany', label: 'How many years have you been with the company?', type: 'numeric'},
    {key: 'workAccident', label: 'Have you ever had a work-related accident?', isYesNo: true, type: 'boolean'},
    {key: 'promotionLast5years', label: 'Have you been promoted in the last 5 years?', isYesNo: true, type: 'boolean'},
    {key: 'department', label: 'Which department do you work in?', type: 'categorical'},
    {key: 'salary', label: 'How would you describe your salary level?', type: 'categorical'},
];

export const colors = [
    '#1F77B4',
    '#5DADE2',
    '#85C1E9',
    '#16A085',
    '#1ABC9C',
    '#48C9B0'
];

export const formatBoolean = (value?: number) => {
    if (value === 1) return "Yes";
    if (value === 0) return "No";
    return "Unknown";
};



