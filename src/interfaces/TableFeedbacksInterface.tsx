export interface TransformedEntry {
    feedbackId: number;
    subsidiaryCode?: string;
    country?: string;
    city?: string;
    address?: string;
    confirmationEquipmentAdequate?: string;
    confirmationOvertime?: string;
    confirmationProtectionMeasures?: string;
    confirmationSafetyMeasures?: string;
    confirmationSalary?: string;
    dangerType?: string;
    engagement?: string;
    factorsWorkplaceSafety?: string;
    workTime?: string;
}

export interface OwnerFeedbacksTransformedEntry {
    feedbackId: number;
    organizationCode: string;
    organizationName?: string
    industry?: string
    subsidiaryCode?: string
    subsidiaryCountry?: string
    subsidiaryCity?: string
    subsidiaryAddress?: string
    satisfactionLevel?: number;
    lastEvaluation?: number;
    numberProject?: number;
    averageMonthlyHours?: number;
    timeSpendCompany?: number;
    workAccident?: string;
    promotionLast5years?: string;
    department?: string;
    salary?: string;
}
