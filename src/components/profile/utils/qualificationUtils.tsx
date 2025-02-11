import {Qualification} from "../../../interfaces/enums/Qualification.tsx";

export const formatQualification = (qualification: Qualification | null): string => {
    switch (qualification) {
        case Qualification.FACULTY_DEGREE:
            return "Faculty Degree";
        case Qualification.HIGH_SCHOOL:
            return "High School";
        case Qualification.PROFESSIONAL_QUALIFICATION:
            return "Professional Qualification";
        case Qualification.SEMI_QUALIFIED_WORKER:
            return "Semi Qualified Worker";
        case Qualification.WITHOUT_PROFESSIONAL_QUALIFICATION:
            return "Without Professional Qualification";
        default:
            return "Unknown Qualification";
    }
};
