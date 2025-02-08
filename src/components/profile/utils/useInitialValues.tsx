import {useGetEmployeeByUserIdQuery} from "../../../services/employeeApi.tsx";
import {ProfileValues} from "../../../interfaces/ProfileValues.tsx";

const userId = parseInt(sessionStorage.getItem("userId") || "0", 10);

const useInitialValues = (): ProfileValues => {
    const {data: employeeData} = useGetEmployeeByUserIdQuery(userId);
    console.log(employeeData);
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
