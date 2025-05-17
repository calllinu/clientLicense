import {Employee} from "./EmployeeInterfaces.tsx";

export interface FeedbackInterface {
    feedbackId: number;
    satisfactionLevel?: number;
    lastEvaluation?: number;
    numberProject?: number;
    averageMonthlyHours?: number;
    timeSpendCompany?: number;
    workAccident?: number;
    promotionLast5years?: number;
    department?: string;
    salary?: string;
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
    feedbackId: number;
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
    feedback: FeedbackInterface;
}