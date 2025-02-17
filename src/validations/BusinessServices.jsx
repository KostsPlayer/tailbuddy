import * as yup from "yup";

export const businessServicesSchema = yup.object().shape({
  name: yup.string().required("Service's Name is required"),
  price: yup.number().required("Service's Price is required"),
});
