export interface TransformedEntry {
    feedbackId: number;
    subsidiaryCode?: string;
    country?: string;
    city?: string;
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
