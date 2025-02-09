import {Employee} from "../../../../interfaces/EmployeeInterfaces.tsx";
import {Qualification} from "../../../../interfaces/Qualification.tsx";

const useInitialValuesUpdateProfile = (employee: Employee | null) => ({
    fullName: employee?.fullName || '',
    employeeCNP: employee?.employeeCNP || '',
    dateOfBirth: employee?.dateOfBirth ? new Date(employee.dateOfBirth) : undefined,
    dateOfHiring: employee?.dateOfHiring ? new Date(employee.dateOfHiring) : undefined,
    qualification: employee?.qualification && Qualification[employee.qualification as keyof typeof Qualification],
});

export default useInitialValuesUpdateProfile;
