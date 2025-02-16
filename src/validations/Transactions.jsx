import * as yup from "yup";

export const transactionsSchema = yup.object().shape({
  status: yup.string().required("Status is required"),
  type: yup.string().required("Type is required"),
});
