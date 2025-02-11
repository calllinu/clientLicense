import {Confirmation} from "./ConfirmationEnum.tsx";
import {Engagement} from "./EngagementEnum.tsx";
import {DangerTypeInterface} from "./DangerTypeInterface.tsx";
import {FactorsWorkplaceSafetyInterface} from "./FactorsWorkplaceSafetyInterface.tsx";

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
