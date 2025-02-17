export interface TransformedEntry {
    subsidiaryCode?: string;
    country?: string;
    city?: string;
    fullName?: string;
    dateOfBirth?: Date;
    dateOfHiring?: Date;
    personalNumber?: string;
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
