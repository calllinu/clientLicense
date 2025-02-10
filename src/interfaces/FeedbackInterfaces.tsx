import {Employee} from './EmployeeInterfaces';
import {WorkTime} from "./WorktimeEnum.tsx";
import {Confirmation} from "./ConfirmationEnum.tsx";
import {Engagement} from "./EngagementEnum.tsx";
import {DangerTypeInterface} from "./DangerTypeInterface.tsx";
import {FactorsWorkplaceSafetyInterface} from "./FactorsWorkplaceSafetyInterface.tsx";

export interface Feedback {
    feedBackId: number;
    confirmationSalary?: Confirmation;
    engagement?: Engagement;
    confirmationOvertime?: Confirmation;
    confirmationEquipmentAdequate?: Confirmation;
    confirmationSafetyMeasures?: Confirmation;
    confirmationProtectionMeasures?: Confirmation;
    timeExposeDanger?: WorkTime;
    dangerType?: DangerTypeInterface;
    factorsWorkplaceSafety?: FactorsWorkplaceSafetyInterface;
    employee?: Employee;
}
