import * as yup from "yup";

export const petCategoriesSchema = yup.object().shape({
  name: yup.string().required("Pet Category's Name is required"),
});
