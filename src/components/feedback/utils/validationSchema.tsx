import * as Yup from "yup";
import {Confirmation} from "../../../interfaces/ConfirmationEnum.tsx";
import {Engagement} from "../../../interfaces/EngagementEnum.tsx";
import {WorkTime} from "../../../interfaces/WorktimeEnum.tsx";
import {FactorsWorkplaceSafetyInterface} from "../../../interfaces/FactorsWorkplaceSafetyInterface.tsx";

export const validationSchema = Yup.object().shape({
    confirmationSalary: Yup.mixed<Confirmation>().oneOf([Confirmation.YES, Confirmation.NO]).required("This field is required"),
    engagement: Yup.mixed<Engagement>().oneOf(Object.values(Engagement)).required("This field is required"),
    confirmationOvertime: Yup.mixed<Confirmation>().oneOf([Confirmation.YES, Confirmation.NO]).required("This field is required"),
    confirmationEquipmentAdequate: Yup.mixed<Confirmation>().oneOf([Confirmation.YES, Confirmation.NO]).required("This field is required"),
    confirmationSafetyMeasures: Yup.mixed<Confirmation>().oneOf([Confirmation.YES, Confirmation.NO]).required("This field is required"),
    confirmationProtectionMeasures: Yup.mixed<Confirmation>().oneOf([Confirmation.YES, Confirmation.NO]).required("This field is required"),
    timeExposeDanger: Yup.mixed<WorkTime>().oneOf(Object.values(WorkTime)).required("This field is required"),
    factorsWorkplaceSafety: Yup.mixed<FactorsWorkplaceSafetyInterface>().oneOf(Object.values(FactorsWorkplaceSafetyInterface)).required("This field is required")
});
