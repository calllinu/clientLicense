import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
    confirmationSalary: Yup.mixed().required("This field is required"),
    engagement: Yup.mixed().required("This field is required"),
    confirmationOvertime: Yup.mixed().required("This field is required"),
    confirmationEquipmentAdequate: Yup.mixed().required("This field is required"),
    confirmationSafetyMeasures: Yup.mixed().required("This field is required"),
    confirmationProtectionMeasures: Yup.mixed().required("This field is required"),
    workTime: Yup.mixed().required("This field is required"),
    dangerType: Yup.mixed().required("This field is required"),
    factorsWorkplaceSafety: Yup.mixed().required("This field is required"),
});
