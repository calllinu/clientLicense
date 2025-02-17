import {Confirmation} from "./enums/ConfirmationEnum.tsx";
import {Engagement} from "./enums/EngagementEnum.tsx";
import {DangerTypeInterface} from "./enums/DangerTypeInterface.tsx";
import {FactorsWorkplaceSafetyInterface} from "./enums/FactorsWorkplaceSafetyInterface.tsx";
import {Employee} from "./EmployeeInterfaces.tsx";

export interface FeedbackInterface {
    confirmationSalary?: Confirmation;
    engagement?: Engagement;
    confirmationOvertime?: Confirmation;
    confirmationEquipmentAdequate?: Confirmation;
    confirmationSafetyMeasures?: Confirmation;
    confirmationProtectionMeasures?: Confirmation;
    workTime?: string;
    dangerType?: DangerTypeInterface;
    factorsWorkplaceSafety?: FactorsWorkplaceSafetyInterface;
    employee?: Employee;
}

interface OrganizationDetails {
    industry: string;
    name: string;
    organizationCode: string;
}

interface SubsidiaryDetails {
    address: string;
    country: string;
    city: string;
    subsidiaryCode: string;
}

interface EmployeeDetails {
    subsidiaryDetails: SubsidiaryDetails;
    organizationDetails: OrganizationDetails;
}

interface FeedbackDetails {
    feedback: FeedbackInterface;
    employeeDetails: EmployeeDetails;
}

export interface FeedbackPageableInterface {
    feedbacks: FeedbackDetails[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
}

export interface SubsidiariesFeedbacks {
    subsidiaryCode: string;
    country: string;
    city: string;
    address: string;
    fullName: string;
    dateOfBirth?: Date;
    dateOfHiring?: Date;
    personalNumber?: string;
    feedback: FeedbackInterface;
}