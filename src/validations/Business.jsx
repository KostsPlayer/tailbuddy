import * as yup from "yup";

export const businessSchema = yup.object().shape({
  business: yup.string().required("Business Category's Business is required"),
  business_category_id: yup
    .string()
    .required("Business Category's Id is required"),
  image: yup.string().required("Business Category's Image is required"),
});
