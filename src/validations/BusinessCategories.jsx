import * as yup from "yup";

export const businessCategoriesSchema = yup.object().shape({
  name: yup.string().required("Business Category's Name is required"),
  image: yup.string().required("Business Category's Image is required"),
});
