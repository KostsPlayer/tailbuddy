import * as yup from "yup";

export const transactionsSchema = yup.object().shape({
  user_id: yup.string().required("Your Id is required"),
  pet_id: yup.string().required("Pet Id is required"),
  seller_id: yup.string().required("Seller Id is required"),
  status: yup.string().required("Status is required"),
});
