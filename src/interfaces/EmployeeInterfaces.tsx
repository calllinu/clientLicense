import {User} from "./UserInterfaces.tsx";
import {Subsidiary} from "./SubsidiaryInterfaces.tsx";
import {FeedbackInterface} from "./FeedbackInterfaces.tsx";
import {Organization} from "./OrganizationInterfaces.tsx";
import {Qualification} from "./enums/Qualification.tsx";


export interface Employee {
    employeeId?: number;
    employeeCNP?: string;
    dateOfBirth?: Date;
    dateOfHiring?: Date;
    fullName: string;
    qualification?: Qualification;
    yearsOfExperience?: number;
    subsidiary?: Subsidiary;
    user?: User;
    feedback?: FeedbackInterface;
}

export interface EmployeeResponse {
    employeeId: number;
    employeeCNP?: string;
    dateOfBirth?: Date;
    dateOfHiring?: Date;
    fullName: string;
    qualification?: Qualification;
    yearsOfExperience?: number;
    organization: Organization;
    subsidiary: Subsidiary;
    user?: User;
    feedback?: FeedbackInterface;
}

export interface UpdateEmployeeRequest {
    userId?: number;
    employee?: Employee;
}

export interface EmployeeDetailsResponse {
    employee: EmployeeResponse;
    hasNullFields: boolean;
}
