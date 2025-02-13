import * as yup from "yup";

export const productsSchema = yup.object().shape({
  name: yup.string().required("Product's name is required"),
  price: yup.number().required("Product's price is required"),
  stock: yup.number().required("Product's stock is required"),
  image: yup.string().required("Products Category's Image is required"),
});
