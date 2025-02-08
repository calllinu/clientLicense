import {User} from "./UserInterfaces.tsx";
import {Subsidiary} from "./SubsidiaryInterfaces.tsx";
import {Feedback} from "./FeedbackInterfaces.tsx";
import {Organization} from "./OrganizationInterfaces.tsx";
import {Qualification} from "./Qualification.tsx";


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
    feedback?: Feedback;
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
    feedback?: Feedback;
}

export interface UpdateEmployeeRequest {
    userId: number;
    employee: Employee;
}
