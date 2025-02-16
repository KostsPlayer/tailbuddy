import * as yup from "yup";

export const petSalesSchema = yup.object().shape({
  transaction_id: yup.string().required("Transaction ID is required"),
  pet_id: yup.string().required("Pet ID is required"),
});
