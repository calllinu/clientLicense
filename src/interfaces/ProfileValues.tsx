import {Qualification} from "./Qualification.tsx";

export interface ProfileValues {
    fullName: string;
    qualification: Qualification | null;
    yearsOfExperience: number;
    dateOfBirth: Date | string;
    dateOfHiring: Date | string;
    employeeCNP: string;
    organization: string;
    subsidiary: string;
}
