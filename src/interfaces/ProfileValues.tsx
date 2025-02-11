import {Qualification} from "./enums/Qualification.tsx";

export interface ProfileValues {
    fullName: string;
    qualification: Qualification | undefined;
    yearsOfExperience?: number;
    dateOfBirth?: Date;
    dateOfHiring?: Date;
    employeeCNP: string;
    organization?: string;
    subsidiary?: string;
}
