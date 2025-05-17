import * as Yup from "yup";
import {Salary} from "../../../interfaces/enums/SalaryInterface.tsx";
import {departmentDisplayMap} from "../../../interfaces/enums/DepartmentsInterface.tsx";

export const validationSchema = Yup.object().shape({
    satisfactionLevel: Yup.number()
        .min(0, "Must be between 0 and 10")
        .max(10, "Must be between 0 and 10")
        .required("Satisfaction Level is required"),

    lastEvaluation: Yup.number()
        .min(0, "Must be between 0 and 10")
        .max(10, "Must be between 0 and 10")
        .required("Last Evaluation is required"),

    numberProject: Yup.number()
        .min(0, "Must be 0 or more")
        .required("Number of Projects is required"),

    averageMonthlyHours: Yup.number()
        .min(0, "Must be 0 or more")
        .required("Average Monthly Hours is required"),

    timeSpendCompany: Yup.number()
        .min(0, "Must be 0 or more")
        .required("Time Spent at Company is required"),

    promotionLast5years: Yup.number()
        .oneOf([0, 1], "Must select Yes or No")
        .required("Promotion field is required"),

    workAccident: Yup.number()
        .oneOf([0, 1], "Must select Yes or No")
        .required("Work Accident field is required"),

    department: Yup.string()
        .required("Department is required")
        .oneOf(
            Object.keys(departmentDisplayMap),
            "Please select a valid Department"
        ),

    salary: Yup.string()
        .required("Salary is required")
        .oneOf(
            Object.values(Salary).map(s => s.toLowerCase()),
            "Please select a valid Salary"
        ),
});
