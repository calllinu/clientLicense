import {Confirmation} from "./enums/ConfirmationEnum.tsx";
import {Engagement} from "./enums/EngagementEnum.tsx";
import {DangerTypeInterface} from "./enums/DangerTypeInterface.tsx";
import {FactorsWorkplaceSafetyInterface} from "./enums/FactorsWorkplaceSafetyInterface.tsx";

export interface FeedbackInterface {
    confirmationSalary?: Confirmation;
    engagement?: Engagement;
    confirmationOvertime?: Confirmation;
    confirmationEquipmentAdequate?: Confirmation;
    confirmationSafetyMeasures?: Confirmation;
    confirmationProtectionMeasures?: Confirmation;
    workTime?: string;
    dangerType?: DangerTypeInterface;
    factorsWorkplaceSafety?: FactorsWorkplaceSafetyInterface;
}
