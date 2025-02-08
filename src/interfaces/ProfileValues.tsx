import {Qualification} from "./Qualification.tsx";

export interface ProfileValues {
    fullName: string;
    qualification: Qualification;
    yearsOfExperience: number;
    dateOfBirth?: Date;
    dateOfHiring?: Date;
    employeeCNP: string;
    organization: string;
    subsidiary: string;
}
