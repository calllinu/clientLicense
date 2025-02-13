import {Confirmation} from "./enums/ConfirmationEnum.tsx";
import {DangerTypeInterface} from "./enums/DangerTypeInterface.tsx";
import {Engagement} from "./enums/EngagementEnum.tsx";
import {FactorsWorkplaceSafetyInterface} from "./enums/FactorsWorkplaceSafetyInterface.tsx";

export interface DataFeedback {
    id: number;
    organization: string;
    cnp: string;
    salary: string;
    engagement: string;
    overtime: string;
    equipment: string;
    safety: string;
    protection: string;
    dangerTimes: string;
}

export interface TransformedEntry {
    subsidiaryCode?: string;
    country?: string;
    city?: string;
    fullName?: string;
    dateOfBirth?: Date;
    dateOfHiring?: Date;
    personalNumber?: string;
    confirmationEquipmentAdequate?: Confirmation | string;
    confirmationOvertime?: Confirmation | string;
    confirmationProtectionMeasures?: Confirmation | string;
    confirmationSafetyMeasures?: Confirmation | string;
    confirmationSalary?: Confirmation | string;
    dangerType?: DangerTypeInterface | string;
    engagement?: Engagement | string;
    factorsWorkplaceSafety?: FactorsWorkplaceSafetyInterface | string;
    workTime?: string;
}
