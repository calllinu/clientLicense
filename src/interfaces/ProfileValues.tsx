import {Qualification} from "./Qualification.tsx";

export interface ProfileValues {
    fullName: string;
    qualification: Qualification | "";
    yearsOfExperience: number;
    dateOfBirth: string;
    personalId: string;
}
