import {ProfileValues} from "../../../interfaces/ProfileValues.tsx";
import {EmployeeResponse} from "../../../interfaces/EmployeeInterfaces.tsx";

const useInitialValues = (employeeData: EmployeeResponse | undefined): ProfileValues => {

    return {
        fullName: employeeData?.fullName || "",
        qualification: employeeData?.qualification || null,
        yearsOfExperience: employeeData?.yearsOfExperience,
        dateOfBirth: employeeData?.dateOfBirth || "",
        dateOfHiring: employeeData?.dateOfHiring || "",
        employeeCNP: employeeData?.employeeCNP?.toString() || "",
        organization: employeeData?.organization.name || "",
        subsidiary: employeeData?.subsidiary.subsidiaryCode || "",
    } as ProfileValues;
};

export default useInitialValues;
